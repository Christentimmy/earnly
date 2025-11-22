
import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.type"; 

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "blocked", "banned"],
        default: "active",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    credits: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;