import express from "express";
import { earnController } from "../controllers/earn.controller";
import tokenValidationMiddleware from "../middlewares/token_validator";

const router = express.Router();

router.post("/ad-watch", tokenValidationMiddleware, earnController.adWatch);
router.post("/dice", tokenValidationMiddleware, earnController.dice);
router.post("/wheel-spin", tokenValidationMiddleware, earnController.wheelSpin);

export default router;
