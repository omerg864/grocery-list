import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { password_regex, email_regex } from '../utils/regex';



const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
}