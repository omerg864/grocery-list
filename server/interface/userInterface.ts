import * as mongoose from 'mongoose';

export interface User {
    id?: string;
    _id: string| mongoose.Schema.Types.ObjectId;
    f_name: string;
    l_name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    avatar?: string;
}

export interface UserDocument extends User, Document {}