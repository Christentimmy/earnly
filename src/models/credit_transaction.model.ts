import mongoose, { Schema, Document, Types } from "mongoose";

export type CreditTransactionType =
  | "ad_watch"
  | "dice_win"
  | "dice_loss"
  | "wheel_spin"
  | "withdraw"
  | "manual_adjust";

export interface ICreditTransaction extends Document {
  userId: Types.ObjectId;
  type: CreditTransactionType;
  amount: number; // +ve for credit, -ve for debit
  balanceBefore: number;
  balanceAfter: number;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "ad_watch",
        "dice_win",
        "dice_loss",
        "wheel_spin",
        "withdraw",
        "manual_adjust",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const CreditTransactionModel = mongoose.model<ICreditTransaction>(
  "CreditTransaction",
  CreditTransactionSchema
);

export default CreditTransactionModel;
