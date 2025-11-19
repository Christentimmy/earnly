import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/token_generator";
import { sendEmail } from "../services/email_service";
import { redisController } from "./redis_controller";

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({ message: "No data provided" });
        return;
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const otp = Math.floor(100000 + Math.random() * 900000);
      const token = generateToken(user);

      await redisController.saveOtpToStore(user.email, otp.toString());
      await sendEmail(user.email, otp.toString());

      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({ message: "No data provided" });
        return;
      }
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(400).json({ message: "Email and OTP are required" });
        return;
      }
      const storedOtp = await redisController.getOtpFromStore(email);
      if (!storedOtp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
      }
      if (storedOtp !== otp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
      }
      await redisController.removeOtp(email);
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  sendOtp: async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({ message: "No data provided" });
        return;
      }
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      const otp = Math.floor(100000 + Math.random() * 900000);

      await redisController.saveOtpToStore(user.email, otp.toString());
      await sendEmail(user.email, otp.toString());

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({ message: "No data provided" });
        return;
      }
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid password" });
        return;
      }
      if (!user.isEmailVerified) {
        res.status(400).json({ message: "Email not verified" });
        return;
      }
      const token = generateToken(user);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
