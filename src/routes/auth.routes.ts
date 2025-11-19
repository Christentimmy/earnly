import express, { Request, Response } from "express";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);

export default router;
