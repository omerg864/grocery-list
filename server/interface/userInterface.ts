import { Document, ObjectId } from 'mongoose';

export interface User {
    f_name: string;
    l_name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    avatar?: string;
    sharingToken?: string;
    sharedWith: ObjectId[];
    fullSwipe: boolean;
    language: string;
}

export interface UserDocument extends User, Document {}