import mongoose, { Schema, Document } from "mongoose";

export interface IAppSettings extends Document {
  exchangeRate: number; // 1 credit -> currency amount (your chosen currency)
  adReward: number; // credits per ad watch
  wheelSpinRewards: number[]; // rewards per wheel segment
  maxWheelSpinsPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppSettingsSchema = new Schema<IAppSettings>(
  {
    exchangeRate: {
      type: Number,
      required: true,
      default: 1,
    },
    adReward: {
      type: Number,
      required: true,
      default: 30,
    },
    wheelSpinRewards: {
      type: [Number],
      required: true,
      default: [0, 5, 10, 20, 50],
    },
    maxWheelSpinsPerDay: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const AppSettingsModel = mongoose.model<IAppSettings>("AppSettings", AppSettingsSchema);

export default AppSettingsModel;
