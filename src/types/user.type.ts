
import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: "user" | "admin";
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
