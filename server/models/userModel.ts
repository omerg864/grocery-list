import * as mongoose from "mongoose";
import { UserDocument } from "../interface/userInterface";

const UserScheme = new mongoose.Schema<UserDocument>({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    avatar: {
        type: String
    },
    fullSwipe: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        default: 'en'
    }
}, { timestamps: true });

export default mongoose.model<UserDocument>('User', UserScheme);