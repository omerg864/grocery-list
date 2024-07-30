import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { password_regex, email_regex } from '../utils/regex';
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { User as UserInterface } from '../interface/userInterface';
import { userExclude } from '../utils/modelsConst';
import { sendEmail } from '../utils/functions';



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
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id as string);
    const userEx = User.findById(user._id).select(userExclude);
    res.status(200).json({
        success: true,
        user: userEx,
        token
    });
});

const register = asyncHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
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
        name,
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



export { login, verify, register };