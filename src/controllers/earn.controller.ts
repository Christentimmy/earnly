import { Request, Response } from "express";
import UserModel from "../models/user.model";
import AppSettingsModel from "../models/app_settings.model";
import CreditTransactionModel from "../models/credit_transaction.model";

export const earnController = {
  adWatch: async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.status !== "active") {
        res.status(403).json({ message: "User is not active" });
        return;
      }

      if (!user.isEmailVerified) {
        res.status(403).json({ message: "Email not verified" });
        return;
      }

      const appSettings = await AppSettingsModel.findOne();
      const adReward = appSettings?.adReward ?? 30;

      const balanceBefore = user.credits ?? 0;
      const amount = adReward;
      const balanceAfter = balanceBefore + amount;

      const { adId } = req.body || {};

      user.credits = balanceAfter;
      await user.save();

      await CreditTransactionModel.create({
        userId: user._id,
        type: "ad_watch",
        amount,
        balanceBefore,
        balanceAfter,
        meta: adId ? { adId } : undefined,
      });

      res.status(200).json({
        message: "Ad watch credited successfully",
        credits: user.credits,
      });
    } catch (error) {
      console.error("Error in adWatch:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  dice: async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { stake } = req.body || {};

      if (!stake || typeof stake !== "number" || stake <= 0) {
        res.status(400).json({ message: "Stake must be a positive number" });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.status !== "active") {
        res.status(403).json({ message: "User is not active" });
        return;
      }

      if (!user.isEmailVerified) {
        res.status(403).json({ message: "Email not verified" });
        return;
      }

      if (user.credits < stake) {
        res.status(400).json({ message: "Insufficient credits" });
        return;
      }

      const win = Math.random() < 0.5;
      const amount = win ? stake : -stake;

      const balanceBefore = user.credits ?? 0;
      const balanceAfter = balanceBefore + amount;

      user.credits = balanceAfter;
      await user.save();

      await CreditTransactionModel.create({
        userId: user._id,
        type: win ? "dice_win" : "dice_loss",
        amount,
        balanceBefore,
        balanceAfter,
        meta: { stake, win },
      });

      res.status(200).json({
        message: win ? "You won the dice game" : "You lost the dice game",
        win,
        stake,
        amount,
        credits: user.credits,
      });
    } catch (error) {
      console.error("Error in dice:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  wheelSpin: async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.status !== "active") {
        res.status(403).json({ message: "User is not active" });
        return;
      }

      if (!user.isEmailVerified) {
        res.status(403).json({ message: "Email not verified" });
        return;
      }

      const appSettings = await AppSettingsModel.findOne();
      const wheelSpinRewards = appSettings?.wheelSpinRewards ?? [0, 5, 10, 20, 50];
      const maxWheelSpinsPerDay = appSettings?.maxWheelSpinsPerDay ?? 1;

      if (!wheelSpinRewards.length) {
        res.status(500).json({ message: "Wheel spin rewards not configured" });
        return;
      }

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const spinsToday = await CreditTransactionModel.countDocuments({
        userId: user._id,
        type: "wheel_spin",
        createdAt: { $gte: startOfDay },
      });

      if (spinsToday >= maxWheelSpinsPerDay) {
        res.status(400).json({ message: "Daily wheel spin limit reached" });
        return;
      }

      const segmentIndex = Math.floor(Math.random() * wheelSpinRewards.length);
      const reward = wheelSpinRewards[segmentIndex];

      const balanceBefore = user.credits ?? 0;
      const amount = reward;
      const balanceAfter = balanceBefore + amount;

      user.credits = balanceAfter;
      await user.save();

      await CreditTransactionModel.create({
        userId: user._id,
        type: "wheel_spin",
        amount,
        balanceBefore,
        balanceAfter,
        meta: { segmentIndex, reward },
      });

      res.status(200).json({
        message: "Wheel spin completed",
        reward,
        segmentIndex,
        credits: user.credits,
      });
    } catch (error) {
      console.error("Error in wheelSpin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
