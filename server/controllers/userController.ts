import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { password_regex, email_regex } from '../utils/regex';
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { userExclude } from '../utils/modelsConst';
import { sendEmail } from '../utils/functions';
import { RequestWithUser } from '../interface/requestInterface';



const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });
}


const login = asyncHandler(async (req:  Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    var user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    if(!user.isVerified) {
        res.status(400);
        throw new Error('Please verify your email');
    }
    console.log(email, password);
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id as string);
    const userEx = await User.findById(user._id).select(userExclude);
    res.status(200).json({
        success: true,
        user: userEx,
        token
    });
});

const register = asyncHandler(async (req, res, next) => {
    const {f_name, l_name, email, password} = req.body;
    if(!f_name || !l_name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const userExists = await User.findOne({ "email" : { $regex : new RegExp(email, "i") } });
    if (userExists) {
        res.status(400)
        throw new Error('User with that email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        f_name,
        l_name,
        email: email,
        password: hashedPassword
    });
    let success;
    try {
        success = await sendEmail(user.email, 'Verify your email', `Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`);
    } catch(err) {
        console.log(err);
        user.isVerified = true;
        await user.save();
    }
    if(!success) {
        user.isVerified = true;
        await user.save();
    }
    res.status(201).json({
        success: true,
    });
});

const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userReq = (req as RequestWithUser).user;
    const user = await User.findById(userReq._id).select(userExclude);
    res.status(200).json({
        success: true,
        user
    });
});


const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const userReq = (req as RequestWithUser).user;
    if(!password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const user = await User.findById(userReq._id);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user!.password = hashedPassword;
    await user!.save();
    res.status(200).json({
        success: true
    });
});

const resetPasswordToken = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ "resetPasswordToken" : { $regex : new RegExp(`^${token}$`, 'i') } });
    if(!user) {
        res.status(400);
        throw new Error('Invalid token');
    }
    if(!password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();
    res.status(200).json({
        success: true
    });
});

const resetPasswordEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    const user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    });
    user.resetPasswordToken = token;
    await user.save();
    let success;
    try {
        success = await sendEmail(user.email, 'Reset your password', `Please reset your password by clicking on the link: ${process.env.HOST_ADDRESS}/reset-password/${token}`);
    } catch(err) {
        console.log("email error: " + err);
        user.resetPasswordToken = undefined;
        await user.save();
        success = false;
    }
    res.status(200).json({
        success
    });
});



const verify = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({
        success: true
    });
});



export { login, verify, register, getUser, updateUserPassword, resetPasswordToken, resetPasswordEmail };