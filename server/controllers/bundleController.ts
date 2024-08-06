import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import Bundle from '../models/bundleModel'
import { RequestWithUser } from '../interface/requestInterface';
import Item from '../models/itemModel';
import { BundleDocument } from '../interface/bundleInterface';
import { ItemDocument } from '../interface/itemInterface';


const getBundles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { limit } = req.query;
    const bundles = await Bundle.find({ user: user._id }).populate('items').limit(limit ? parseInt(limit as string) : 0);
    res.status(200).json({
        success: true,
        bundles
    });
});

const getBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const bundle = await Bundle.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
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
    const bundle: BundleDocument | null = await Bundle.findById(req.params.id);
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
    await Bundle.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true
    });
});

const createItemFromItemAndAddToList = async (item: ItemDocument, items: ObjectId[], userId: unknown) => {
    const newItem = await Item.create({
        name: item.name,
        description: item.description,
        unit: item.unit,
        category: item.category,
        img: item.img,
        user: userId
    });
    items.push(newItem._id as ObjectId);
}

const shareBundle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { id } = req.params;
    const bundle = await Bundle.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    let items: ObjectId[] = [];
    const promises = [];
    for (let i = 0; i < bundle.items.length; i++) {
        const itemContext = bundle.items[i] as ItemDocument;
        promises.push(createItemFromItemAndAddToList(itemContext, items, user._id));
    }
    await Promise.all(promises);
    const newBundle = await Bundle.create({
        title: bundle.title,
        description: bundle.description,
        items,
        user: user._id
    });
    res.status(200).json({
        success: true,
        bundle: newBundle
    });
});



export { getBundles, addBundle, updateBundle, deleteBundle, getBundle, shareBundle };