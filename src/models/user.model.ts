
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
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;