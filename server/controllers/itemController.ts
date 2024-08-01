import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { ItemDocument } from '../interface/itemInterface';
import Item from '../models/itemModel';
import { RequestWithUser } from '../interface/requestInterface';
import { itemExclude } from '../utils/modelsConst';
import List from '../models/listModel';
import { v2 as cloudinary } from 'cloudinary';

const getItems = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const items = await Item.find({
			user: user._id,
			deleted: false,
		}).select(itemExclude);
		const categories = [...new Set(items.map(item => item.category))];
		res.status(200).json({
			success: true,
			items,
			categories
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
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: 'SuperCart/items',
				public_id: `${user._id}/${item._id}`,
			});
			item.img = result.secure_url;
			await item.save();
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
		const { id } = req.params
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
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			const public_id = `SuperCart/items/${user._id}/${id}`;
			if (item.img) {
				await cloudinary.uploader.destroy(public_id, (error, result) => {
					if (error) {
						console.log(error);
					}
				})
			}
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: 'SuperCart/items',
				public_id: `${user._id}/${item._id}`,
			});
			item.img = result.secure_url;
		}
		item.name = name;
		item.description = description;
		item.unit = unit;
		item.category = category;
		await item.save();
		res.status(200).json({
			success: true,
			item
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
		const foundLists = await List.find({
			$or: [
				{ items: item._id },
				{ boughtItems: item._id },
				{ deletedItems: item._id },
			],
		});
		if (foundLists.length) {
			item.deleted = true;
			await item.save();
		} else {
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			const public_id = `SuperCart/items/${user._id}/${id}`;
			await Promise.all([
				cloudinary.uploader.destroy(public_id, (error, result) => {
					if (error) {
						console.log(error);
					}
				}),
				item.deleteOne(),
			]);
		}
		res.status(200).json({
			success: true,
			id,
		});
	}
);

export { getItems, deleteItem, addItem, updateItem };
