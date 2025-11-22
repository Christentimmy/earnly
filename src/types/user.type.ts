
import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: "user" | "admin";
    status: "active" | "blocked" | "banned";
    isEmailVerified: boolean;
    credits: number;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
