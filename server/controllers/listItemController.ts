import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { RequestWithUser } from '../interface/requestInterface';
import ListItem from '../models/listItemModel';
import { List } from '../interface/listInterface';
import { deleteImage } from '../utils/functions';
import { ListItemDocument } from '../interface/listItemInterface';
import { uploadToCloudinary } from '../config/cloud';
import Item from '../models/itemModel';

const getItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ListItemDocument | null = await ListItem.findById(
			id
		).populate('list');
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		let found = false;
		for (let i = 0; i < (item.list as List).users.length; i++) {
			if (
				(item.list as List).users[i].toString() ===
				(user._id as ObjectId).toString()
			) {
				found = true;
				break;
			}
		}
		if (!found) {
			res.status(403);
			throw new Error('Not Authorized');
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
		const { name, description, unit, category, amount } = req.body;
		if (!name) {
			res.status(400);
			throw new Error('Name is Required');
		}
		const item: ListItemDocument | null = await ListItem.findById(
			id
		).populate('list');
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		let found = false;
		for (let i = 0; i < (item.list as List).users.length; i++) {
			if (
				(item.list as List).users[i].toString() ===
				(user._id as ObjectId).toString()
			) {
				found = true;
				break;
			}
		}
		if (!found) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		if (req.file) {
			if (item.img) {
				const [_, image_url] = await Promise.all([
					deleteImage(item.img),
					uploadToCloudinary(
						req.file.buffer,
						`${process.env.CLOUDINARY_BASE_FOLDER}/listItems`,
						id
					),
				]);
				item.img = image_url;
			} else {
				item.img = await uploadToCloudinary(
					req.file.buffer,
					`${process.env.CLOUDINARY_BASE_FOLDER}/listItems`,
					id
				);
			}
		}
		item.name = name;
		item.description = description;
		item.unit = unit;
		item.category = category;
		item.amount = amount;
		await item.save();
		res.status(200).json({
			success: true,
			item,
		});
	}
);

const shareItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item = await ListItem.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		const newItem = await Item.create({
			name: item.name,
			description: item.description,
			unit: item.unit,
			category: item.category,
			img: item.img,
			user: user._id,
		});
		res.status(200).json({
			success: true,
			item: newItem,
		});
	}
);

const getSharedItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ListItemDocument | null = await ListItem.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		const itemDisplay = {
			name: item.name,
			description: item.description,
			unit: item.unit,
			category: item.category,
			img: item.img,
		};
		res.status(200).json({
			success: true,
			item: itemDisplay,
		});
	}
);

export { getItem, updateItem, shareItem, getSharedItem };
