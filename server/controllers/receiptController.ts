import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { ReceiptDocument } from '../interface/receiptInterface';
import Receipt from '../models/receiptModel';
import { RequestWithUser } from '../interface/requestInterface';
import List from '../models/listModel';
import { ListDocument } from '../interface/listInterface';
import { uploadToCloudinary } from '../config/upload';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from '../utils/functions';


const getReceipts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as RequestWithUser).user;
        const { id } = req.params;
        const list: ListDocument | null = await List.findById(id);
        if (!list) {
            res.status(404);
            throw new Error('List not found');
        }
        let found = false;
		list.users.forEach((listUser) => {
			if (
				(listUser as ObjectId).toString() ===
				(user._id as ObjectId).toString()
			) {
				found = true;
			}
		});
		if (!found) {
			res.status(403);
			throw new Error('Not Authorized');
		}
        const receipts = await Receipt.find({ list: id });
        res.status(200).json({
            success: true,
            receipts,
        });
    }
);

const addReceipt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as RequestWithUser).user;
        const { id } = req.params;
        const list: ListDocument | null = await List.findById(id);
        if (!list) {
            res.status(404);
            throw new Error('List not found');
        }
        let found = false;
        list.users.forEach((listUser) => {
            if (
                (listUser as ObjectId).toString() ===
                (user._id as ObjectId).toString()
            ) {
                found = true;
            }
        });
        if (!found) {
            res.status(403);
            throw new Error('Not Authorized');
        }
        if (!req.file) {
            res.status(400);
            throw new Error('No file uploaded');
        }
        const img = await uploadToCloudinary(req.file.buffer, `SuperCart/lists/${id}`, new Date().toISOString());
        const receipt: ReceiptDocument = await Receipt.create({
            img,
            list: id,
        });
        res.status(201).json({
            success: true,
            receipt,
        });
    }
);

const deleteReceipt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as RequestWithUser).user;
        const { id, receiptId } = req.params;
        const list: ListDocument | null = await List.findById(id);
        if (!list) {
            res.status(404);
            throw new Error('List not found');
        }
        let found = false;
        list.users.forEach((listUser) => {
            if (
                (listUser as ObjectId).toString() ===
                (user._id as ObjectId).toString()
            ) {
                found = true;
            }
        });
        if (!found) {
            res.status(403);
            throw new Error('Not Authorized');
        }
        const receipt: ReceiptDocument | null = await Receipt.findById(receiptId);
        if (!receipt) {
            res.status(404);
            throw new Error('Receipt not found');
        }
        if ((receipt.list as ObjectId).toString() !== id) {
            res.status(403);
            throw new Error('Not Authorized');
        }
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const public_id = extractPublicId(receipt.img);
        await cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.log(error);
            }
        });
        await Receipt.deleteOne({ _id: receiptId });
        res.status(200).json({
            success: true,
        });
    }
);

export { getReceipts, addReceipt, deleteReceipt };