import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import { ItemDocument } from '../interface/itemInterface';
import Item from '../models/itemModel';
import { RequestWithUser } from '../interface/requestInterface';
import { itemExclude } from '../utils/modelsConst';
import { deleteImage } from '../utils/functions';
import { uploadToCloudinary } from '../config/cloud';
import Bundle from '../models/bundleModel';
import { v4 as uuidv4 } from 'uuid';

const getItems = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		let { category, limit } = req.query;
		let addCategories = true;
		if (category) {
			addCategories = false;
		}
		const items = await Item.find({
			user: { $in: [user._id, ...user.sharedWith] },
		})
			.select(itemExclude)
			.limit(limit ? parseInt(limit as string) : 0);
		if (addCategories) {
			let categories: Set<string> | Array<string> = new Set<string>();
			items.forEach((item) => {
				if (
					item.category &&
					item.category.replace(/\s/g, '').length > 0
				) {
					(categories as Set<string>).add(item.category);
				}
			});
			categories = Array.from(categories);
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
		const imageID = uuidv4();
		const item = await Item.create({
			name,
			description,
			unit,
			category,
			user: user._id,
		});
		if (req.file) {
			item.img = await uploadToCloudinary(
				req.file.buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/items`,
				`${imageID}`
			);
			await item.save();
		}
		res.status(200).json({
			success: true,
			item,
		});
	}
);

const changeDefault = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const item = await Item.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		item.default = item.default ? false : true;
		await item.save();
		res.status(200).json({
			success: true,
			default: item.default,
		});
	}
);

const getItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const item: ItemDocument | null = await Item.findById(id).select(
			itemExclude
		);
		if (!item) {
			res.status(404);
			throw new Error('Item Not Found');
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
		if (item.user.toString() !== (user._id as ObjectId).toString() && !user.sharedWith.includes((item.user as ObjectId))) {
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
			const imageID = uuidv4();
			item.img = await uploadToCloudinary(
				req.file.buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/items`,
				`${imageID}`
			);
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
		const bundlesFound = await Bundle.find({ items: item._id });
		const promises = [];
		for (let bundle of bundlesFound) {
			if (bundle.items.length > 1) {
				bundle.items = (bundle.items as ObjectId[]).filter(
					(bundleItem) =>
						(bundleItem as ObjectId).toString() !==
						(item._id as ObjectId).toString()
				);
				promises.push(bundle.save());
			} else {
				promises.push(Bundle.findByIdAndDelete(bundle._id));
			}
		}
		if (item.img) {
			promises.push(deleteImage(item.img, true));
		}
		promises.push(Item.deleteOne({ _id: id }));
		await Promise.all(promises);
		res.status(200).json({
			success: true,
			id,
		});
	}
);

const shareItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const item: ItemDocument | null = await Item.findById(id);
		if (!item) {
			res.status(404);
			throw new Error('Item not found');
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

export {
	getItems,
	deleteItem,
	addItem,
	updateItem,
	getItem,
	changeDefault,
	shareItem,
};
