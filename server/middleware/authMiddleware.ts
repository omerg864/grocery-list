import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { User as UserInterface } from '../interface/userInterface';

const protectUser = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            req.user = await User.findById(decoded.id).select('-password') as UserInterface;
            next();
        } catch(error){
            console.log(error);
            res.status(401)
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

export {protectUser};