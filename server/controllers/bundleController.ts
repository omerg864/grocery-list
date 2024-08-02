import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import Bundle from '../models/bundleModel'
import { RequestWithUser } from '../interface/requestInterface';


const getBundles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const bundles = await Bundle.find({ user: user._id }).populate('items');
    res.status(200).json({
        success: true,
        bundles
    });
});

const getBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { id } = req.params;
    const bundle = await Bundle.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    res.status(200).json({
        success: true,
        bundle
    });
});


const addBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { title, description, items } = req.body;
    if (!title || !items.length) {
        res.status(400);
        throw new Error('Title and Items are Required');
    }
    const bundle = await Bundle.create({
        title,
        description,
        items,
        user: user._id
    });
    res.status(200).json({
        success: true,
        bundle
    });
});


const updateBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { title, description, items } = req.body;
    if (!title || !items) {
        res.status(400);
        throw new Error('Title and Items are Required');
    }
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    bundle.title = title;
    bundle.description = description;
    bundle.items = items;
    await bundle.save();
    res.status(200).json({
        success: true,
        bundle
    });
});


const deleteBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    await bundle.deleteOne();
    res.status(200).json({
        success: true
    });
});



export { getBundles, addBundle, updateBundle, deleteBundle, getBundle };