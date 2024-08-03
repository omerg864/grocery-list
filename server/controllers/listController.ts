import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { RequestWithUser } from '../interface/requestInterface';
import List from '../models/listModel';
import { UserDocument } from '../interface/userInterface';
import { itemExclude, populateList } from '../utils/modelsConst';
import { ListDocument } from '../interface/listInterface';
import Item from '../models/itemModel';
import ListItem from '../models/listItemModel';
import { v2 as cloudinary } from 'cloudinary';
import Bundle from '../models/bundleModel';
import { ItemDocument } from '../interface/itemInterface';
import { ListItemDocument } from '../interface/listItemInterface';
import streamifier from "streamifier";

const getLists = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const lists = await List.find({ users: user._id });
		const listsDisplay = lists.map((list) => ({
			...list.toObject(),
			users: list.users.length,
			items: list.items.length,
			deletedItems: list.deletedItems.length,
			boughtItems: list.boughtItems.length,
			owner:
				(list.owner as ObjectId).toString() ===
				(user._id as ObjectId).toString(),
		}));
		res.status(200).json({
			success: true,
			lists: listsDisplay,
		});
	}
);

const getList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list: ListDocument | null = await List.findById(id).populate(
			populateList
		);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		let found = false;
		list.users.forEach((listUser) => {
			if (
				((listUser as UserDocument)._id as ObjectId).toString() ===
				(user._id as ObjectId).toString()
			) {
				found = true;
			}
		});
		if (!found) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		const categories = new Set<string>();
		(list.items as ListItemDocument[]).forEach((item) => {
			if (item.category) {
				categories.add(item.category);
			}
		});
		(list.deletedItems as ListItemDocument[]).forEach((item) => {
			if (item.category) {
				categories.add(item.category);
			}
		});
		(list.boughtItems as ListItemDocument[]).forEach((item) => {
			if (item.category) {
				categories.add(item.category);
			}
		});
		const listDisplay = {
			...list.toObject(),
			owner:
				(list.owner as ObjectId).toString() ===
				(user._id as ObjectId).toString(),
			users: list.users.filter(
				(listUser) =>
					((listUser as UserDocument)._id as ObjectId).toString() !==
					(user._id as ObjectId).toString()
			),
			categories: Array.from(categories),
		};
		res.status(200).json({
			success: true,
			list: listDisplay,
		});
	}
);

const addList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { title, defaultItems, previousList } = req.body;
		if (!title) {
			res.status(400);
			throw new Error('Title is Required');
		}
		const list = await List.create({
			title,
			users: [user._id],
			owner: user._id,
		});
		res.status(200).json({
			success: true,
			list,
		});
	}
);

const createListItem = async (
	name: string,
	description: string,
	unit: string,
	amount: number,
	category: string,
	list: ObjectId,
	img: string | Express.Multer.File | undefined
) => {
	let newItem;
	if (img && typeof img !== 'string') {
		newItem = await ListItem.create({
			name,
			description,
			unit,
			amount,
			category,
			list,
		});
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
		const result = await cloudinary.uploader.upload(img.path, {
			folder: 'SuperCart/listItems',
			public_id: `${newItem._id}`,
		});
		newItem.img = result.secure_url;
		await newItem.save();
	} else {
		newItem = await ListItem.create({
			name,
			description,
			unit,
			amount,
			category,
			list,
			img: img as string,
		});
	}
	return newItem;
};

const uploadToCloudinary = (imgBuffer: Buffer, folder: string, publicId: string): Promise<string> => {
	return new Promise((resolve, reject) => {
	  const stream = cloudinary.uploader.upload_stream(
		{
		  folder: folder,
		  public_id: publicId,
		},
		(error, result) => {
		  if (error) {
			return reject(error);
		  }
		  if (!result) {
			return reject(new Error('No result from Cloudinary'));
		  }
		  resolve(result.secure_url);
		}
	  );
	  streamifier.createReadStream(imgBuffer).pipe(stream);
	});
  }

const createItem = async (
	name: string,
	description: string,
	unit: string,
	category: string,
	user: unknown,
	img: Express.Multer.File | undefined
) => {
	const item = await Item.create({
		name,
		description,
		unit,
		category,
		user: user,
	});
	if (img) {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
		console.log(img);
		item.img = await uploadToCloudinary(img.buffer, 'SuperCart/items', `${user}/${item._id}`);
		await item.save();
	}
	return item;
};

const addNewItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { name, description, unit, amount, category, saveItem } =
			req.body;
		if (!name) {
			res.status(400);
			throw new Error('Name is Required');
		}
		const { id } = req.params;
		const list = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
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
		let listItem, item;
		if (saveItem) {
			item = await createItem(
				name,
				description,
				unit,
				category,
				user._id,
				req.file
			);
			listItem = await createListItem(
				name,
				description,
				unit,
				amount,
				category,
				list._id as ObjectId,
				item.img
			);
		} else {
			listItem = await createListItem(
				name,
				description,
				unit,
				amount,
				category,
				list._id as ObjectId,
				req.file
			);
		}
		(list.items as ObjectId[]).push(listItem._id as ObjectId);
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const addExistingItem = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { amount, unit } = req.body;
		const { id, item } = req.params;
		const list = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
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
		const ItemContext = await Item.findById(item);
		if (!ItemContext) {
			res.status(404);
			throw new Error('Item Not Found');
		}
		const listItem = await ListItem.create({
			name: ItemContext.name,
			description: ItemContext.description,
			unit,
			amount,
			category: ItemContext.category,
			list: list._id,
			img: ItemContext.img,
		});
		(list.items as ObjectId[]).push(listItem._id as ObjectId);
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const checkListAndItem = async (
	listId: string,
	itemId: string,
	res: Response,
	userId: unknown
) => {
	const list = await List.findById(listId);
	if (!list) {
		res.status(404);
		throw new Error('List Not Found');
	}
	let found = false;
	list.users.forEach((listUser) => {
		if (
			(listUser as ObjectId).toString() ===
			(userId as ObjectId).toString()
		) {
			found = true;
		}
	});
	if (!found) {
		res.status(403);
		throw new Error('Not Authorized');
	}
	const listItem = await ListItem.findById(itemId);
	if (!listItem) {
		res.status(404);
		throw new Error('Item Not Found');
	}
	return { list, listItem };
};

const sendToDeleted = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, item } = req.params;
		const { list, listItem } = await checkListAndItem(
			id,
			item,
			res,
			user._id
		);
		(list.items as ObjectId[]) = (list.items as ObjectId[]).filter(
			(listItem) => (listItem as ObjectId).toString() !== item.toString()
		);
		(list.deletedItems as ObjectId[]) = [
			...(list.deletedItems as ObjectId[]),
			item as unknown as ObjectId,
		];
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const sendToBought = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, item } = req.params;
		const { list, listItem } = await checkListAndItem(
			id,
			item,
			res,
			user._id
		);
		(list.items as ObjectId[]) = (list.items as ObjectId[]).filter(
			(listItem) => (listItem as ObjectId).toString() !== item.toString()
		);
		(list.boughtItems as ObjectId[]) = [
			...(list.boughtItems as ObjectId[]),
			item as unknown as ObjectId,
		];
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const restoreFromDeleted = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, item } = req.params;
		const { list, listItem } = await checkListAndItem(
			id,
			item,
			res,
			user._id
		);
		(list.deletedItems as ObjectId[]) = (
			list.deletedItems as ObjectId[]
		).filter(
			(listItem) => (listItem as ObjectId).toString() !== item.toString()
		);
		(list.items as ObjectId[]) = [
			...(list.items as ObjectId[]),
			item as unknown as ObjectId,
		];
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const restoreFromBought = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, item } = req.params;
		const { list, listItem } = await checkListAndItem(
			id,
			item,
			res,
			user._id
		);
		(list.boughtItems as ObjectId[]) = (
			list.boughtItems as ObjectId[]
		).filter(
			(listItem) => (listItem as ObjectId).toString() !== item.toString()
		);
		(list.items as ObjectId[]) = [
			...(list.items as ObjectId[]),
			item as unknown as ObjectId,
		];
		await list.save();
		res.status(200).json({
			success: true,
			item: listItem,
		});
	}
);

const addBundleItems = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, bundle } = req.params;
		const { amounts } = req.body;
		const list = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
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
		const bundleContext = await Bundle.findById(bundle).populate('items');
		if (!bundleContext) {
			res.status(404);
			throw new Error('Bundle Not Found');
		}
		for (let i = 0; i < bundleContext.items.length; i++) {
			const item = bundleContext.items[i] as ItemDocument;
			console.log(item._id);
			const info = amounts.find(
				(a: { id: string; amount: number | undefined; unit: string }) =>
					a.id === (item._id as ObjectId).toString()
			)!;
			const listItem = await ListItem.create({
				name: item.name,
				description: item.description,
				unit: info.unit,
				amount: info.amount,
				category: item.category,
				list: list._id,
				img: item.img,
			});
			list.items = [
				...(list.items as ObjectId[]),
				listItem._id as ObjectId,
			];
		}
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const deleteForAll = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list = await List.findById(id).populate('users');
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		if (list.owner.toString() !== (user._id as ObjectId).toString()) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		list.users = [user._id as ObjectId];
		list.deleted = true;
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const deleteForMe = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// TODO: implement deleteForMe
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
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
		list.users = (list.users as ObjectId[]).filter(
			(listUser) =>
				(listUser as ObjectId).toString() !==
				(user._id as ObjectId).toString()
		);
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

export {
	getLists,
	getList,
	addList,
	addNewItem,
	addExistingItem,
	sendToDeleted,
	sendToBought,
	restoreFromDeleted,
	restoreFromBought,
	addBundleItems,
	deleteForAll,
	deleteForMe,
};
