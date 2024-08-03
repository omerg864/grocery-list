import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { RequestWithUser } from '../interface/requestInterface';
import ListItem from '../models/listItemModel';
import { List } from '../interface/listInterface';
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageListItem, deleteImage } from '../utils/functions';
import { ListItemDocument } from '../interface/listItemInterface';

const getItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ListItemDocument | null = await ListItem.findById(id).populate('list');
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
		const item = await ListItem.findById(id).populate('list');
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
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			if (item.img) {
				const [_, image_url] = await Promise.all([
					deleteImage(item.img),
					uploadImageListItem(req.file, id),
				]);
				item.img = image_url;
			} else {
				item.img = await uploadImageListItem(req.file, id);
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

export { getItem, updateItem };
