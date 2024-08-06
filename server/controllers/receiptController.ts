import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { ReceiptDocument } from '../interface/receiptInterface';
import Receipt from '../models/receiptModel';
import { RequestWithUser } from '../interface/requestInterface';
import List from '../models/listModel';
import { ListDocument } from '../interface/listInterface';
import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloud';

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
		const img = await uploadToCloudinary(
			req.file.buffer,
			`SuperCart/lists/${id}`,
			new Date().toISOString()
		);
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
		const receipt: ReceiptDocument | null = await Receipt.findById(
			receiptId
		);
		if (!receipt) {
			res.status(404);
			throw new Error('Receipt not found');
		}
		if ((receipt.list as ObjectId).toString() !== id) {
			res.status(403);
			throw new Error('Not Authorized');
		}
        const promises = [];
        promises.push(deleteFromCloudinary(receipt.img));
		promises.push(Receipt.deleteOne({ _id: receiptId }));
        await Promise.all(promises);
		res.status(200).json({
			success: true,
		});
	}
);

export { getReceipts, addReceipt, deleteReceipt };
