import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { ItemDocument } from '../interface/itemInterface';
import Item from '../models/itemModel';
import { RequestWithUser } from '../interface/requestInterface';
import { itemExclude } from '../utils/modelsConst';
import { deleteImage } from '../utils/functions';
import { uploadToCloudinary } from '../config/upload';

const getItems = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		let { category, limit } = req.query;
		let addCategories = true;
		if (category) {
			addCategories = false;
		}
		const items = await Item.find({
			user: user._id,
		})
			.select(itemExclude)
			.limit(limit ? parseInt(limit as string) : 0);
		if (addCategories) {
			const categories = [...new Set(items.map((item) => item.category))];
			res.status(200).json({
				success: true,
				items,
				categories,
			});
			return;
		}
		res.status(200).json({
			success: true,
			items,
		});
	}
);

const addItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { name, description, unit, category } = req.body;
		if (!name) {
			res.status(400);
			throw new Error('Name is Required');
		}
		const item = await Item.create({
			name,
			description,
			unit,
			category,
			user: user._id,
		});
		if (req.file) {
			item.img = await uploadToCloudinary(req.file.buffer, 'SuperCart/items', `${user._id}/${item._id}`);
			await item.save();
		}
		res.status(200).json({
			success: true,
			item,
		});
	}
);

const getItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item = await Item.findById(id).select(itemExclude);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		if (item.user.toString() !== (user._id as ObjectId).toString()) {
			res.status(401);
			throw new Error('Not authorized');
		}
		res.status(200).json({
			success: true,
			item,
		});
	}
);

const updateItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ItemDocument | null = await Item.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		if (item.user.toString() !== (user._id as ObjectId).toString()) {
			res.status(401);
			throw new Error('Not authorized');
		}
		const { name, description, unit, category } = req.body;
		if (!name) {
			res.status(400);
			throw new Error('Name is Required');
		}
		if (req.file) {
			if (item.img) {
				await deleteImage(item.img, true);
			}
			item.img = await uploadToCloudinary(req.file.buffer, 'SuperCart/items', `${user._id}/${item._id}`);
		}
		item.name = name;
		item.description = description;
		item.unit = unit;
		item.category = category;
		await item.save();
		res.status(200).json({
			success: true,
			item,
		});
	}
);

const deleteItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ItemDocument | null = await Item.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item not found');
		}
		if (item.user.toString() !== (user._id as ObjectId).toString()) {
			res.status(401);
			throw new Error('Not authorized');
		}
		if (item.img) {
			await Promise.all([deleteImage(item.img, true), item.deleteOne()]);
		} else {
			await item.deleteOne();
		}
		res.status(200).json({
			success: true,
			id,
		});
	}
);

export { getItems, deleteItem, addItem, updateItem, getItem };
