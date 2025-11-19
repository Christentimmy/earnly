import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/token_generator";

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

      const token = generateToken(user);

      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
