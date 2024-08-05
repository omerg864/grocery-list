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
import Bundle from '../models/bundleModel';
import { ItemDocument } from '../interface/itemInterface';
import { ListItemDocument } from '../interface/listItemInterface';
import { uploadToCloudinary } from '../config/upload';
import { deleteImage } from '../utils/functions';
import crypto from 'crypto';

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
			categories: Array.from(categories)
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
		const { title, defaultItems, prevListItems } = req.body;
		if (!title) {
			res.status(400);
			throw new Error('Title is Required');
		}
		let generatedToken = crypto.randomBytes(26).toString('hex');
		while (await List.findOne({ token: generatedToken })) {
			generatedToken = crypto.randomBytes(26).toString('hex');
		}
		const list = await List.create({
			title,
			users: [user._id],
			owner: user._id,
			token: generatedToken
		});
		if (prevListItems) {
			const prevList = await List.findById(prevListItems).populate(
				'items'
			);
			if (prevList) {
				for (let i = 0; i < prevList.items.length; i++) {
					const item = prevList.items[i] as ListItemDocument;
					const listItem = await ListItem.create({
						name: item.name,
						description: item.description,
						unit: item.unit,
						amount: item.amount,
						category: item.category,
						list: list._id,
						img: item.img,
					});
					list.items = [
						...(list.items as ObjectId[]),
						listItem._id as ObjectId,
					];
				}
				list.save();
			}
		}
		if (defaultItems) {
			const items = await Item.find({ user: user._id, default: true });
			for (let i = 0; i < items.length; i++) {
				const item = items[i] as ItemDocument;
				const amount = item.unit ? 1 : 0;
				const listItem = await ListItem.create({
					name: item.name,
					description: item.description,
					unit: item.unit,
					category: item.category,
					amount,
					list: list._id,
					img: item.img,
				});
				list.items = [
					...(list.items as ObjectId[]),
					listItem._id as ObjectId,
				];
			}
			list.save();
		}
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
		newItem.img = await uploadToCloudinary(
			img.buffer,
			'SuperCart/listItems',
			`${newItem._id}`
		);
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
		item.img = await uploadToCloudinary(
			img.buffer,
			'SuperCart/items',
			`${user}/${item._id}`
		);
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
			item: item,
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
	const list: ListDocument | null = await List.findById(listId);
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
	const listItem: ListItemDocument | null = await ListItem.findById(itemId);
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
		const list: ListDocument | null = await List.findById(id);
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
		let generatedToken = crypto.randomBytes(26).toString('hex');
		while (await List.findOne({ token: generatedToken })) {
			generatedToken = crypto.randomBytes(26).toString('hex');
		}
		list.users = [];
		list.deletedUsers = [user._id as ObjectId];
		list.token = generatedToken;
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const deleteForMe = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
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
		let owner = false;
		if (list.owner.toString() === (user._id as ObjectId).toString()) {
			owner = true;
		}
		if (owner) {
			if (list.users.length > 1) {
				list.owner = list.users.find(
					(userId) =>
						userId.toString() !== (user._id as ObjectId).toString()
				) as ObjectId;
			}
		}
		list.users = (list.users as ObjectId[]).filter(
			(listUser) =>
				(listUser as ObjectId).toString() !==
				(user._id as ObjectId).toString()
		);
		list.deletedUsers = [
			...(list.deletedUsers as ObjectId[]),
			user._id as ObjectId,
		];
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const getDeletedLists = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const lists = await List.find({ deletedUsers: user._id });
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

const restoreList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list: ListDocument | null = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		if (
			(list.deletedUsers as ObjectId[]).find(
				(userId) =>
					(userId as ObjectId).toString() ===
					(user._id as ObjectId).toString()
			)
		) {
			list.deletedUsers = (list.deletedUsers as ObjectId[]).filter(
				(userId) =>
					(userId as ObjectId).toString() !==
					(user._id as ObjectId).toString()
			);
			list.users = [...(list.users as ObjectId[]), user._id as ObjectId];
			await list.save();
			res.status(200).json({
				success: true,
			});
		} else {
			res.status(403);
			throw new Error('Not Authorized');
		}
	}
);

const deletePermanently = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list: ListDocument | null = await List.findById(id).populate(
			'items deletedItems boughtItems'
		);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		if (
			!(list.deletedUsers as ObjectId[]).find(
				(userId) =>
					(userId as ObjectId).toString() ===
					(user._id as ObjectId).toString()
			)
		) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		let owner = false;
		if (list.owner.toString() === (user._id as ObjectId).toString()) {
			owner = true;
		}
		if (owner) {
			// full delete
			for (let i = 0; i < list.items.length; i++) {
				const item = list.items[i] as ListItemDocument;
				if (item.img) {
					deleteImage(item.img);
				}
				ListItem.deleteOne({ _id: item._id });
			}
			for (let i = 0; i < list.deletedItems.length; i++) {
				const item = list.deletedItems[i] as ListItemDocument;
				if (item.img) {
					deleteImage(item.img);
				}
				ListItem.deleteOne({ _id: item._id });
			}
			for (let i = 0; i < list.boughtItems.length; i++) {
				const item = list.boughtItems[i] as ListItemDocument;
				if (item.img) {
					deleteImage(item.img);
				}
				ListItem.deleteOne({ _id: item._id });
			}
			await List.deleteOne({ _id: list._id });
		} else {
			// remove user
			list.users = (list.users as ObjectId[]).filter(
				(listUser) =>
					(listUser as ObjectId).toString() !==
					(user._id as ObjectId).toString()
			);
			list.deletedUsers = [
				...(list.deletedUsers as ObjectId[]),
				user._id as ObjectId,
			];
			await list.save();
		}
		res.status(200).json({
			success: true,
		});
	}
);

const deleteAllListsUserDeleted = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const lists = await List.find({ deletedUsers: user._id });
		for (let i = 0; i < lists.length; i++) {
			const list: ListDocument = lists[i];
			let owner = false;
			if (list.owner.toString() === (user._id as ObjectId).toString()) {
				owner = true;
			}
			if (owner) {
				// full delete
				for (let i = 0; i < list.items.length; i++) {
					const item = list.items[i] as ListItemDocument;
					if (item.img) {
						deleteImage(item.img);
					}
					ListItem.deleteOne({ _id: item._id });
				}
				for (let i = 0; i < list.deletedItems.length; i++) {
					const item = list.deletedItems[i] as ListItemDocument;
					if (item.img) {
						deleteImage(item.img);
					}
					ListItem.deleteOne({ _id: item._id });
				}
				for (let i = 0; i < list.boughtItems.length; i++) {
					const item = list.boughtItems[i] as ListItemDocument;
					if (item.img) {
						deleteImage(item.img);
					}
					ListItem.deleteOne({ _id: item._id });
				}
				await List.deleteOne({ _id: list._id });
			} else {
				// remove user
				list.users = (list.users as ObjectId[]).filter(
					(listUser) =>
						(listUser as ObjectId).toString() !==
						(user._id as ObjectId).toString()
				);
				list.deletedUsers = [
					...(list.deletedUsers as ObjectId[]),
					user._id as ObjectId,
				];
				await list.save();
			}
		}
		res.status(200).json({
			success: true,
		});
	}
);

const createShareToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const lists = await List.find();
	for (let i = 0; i < lists.length; i++) {
		let generatedToken = crypto.randomBytes(26).toString('hex');
		while (await List.findOne({ token: generatedToken })) {
			generatedToken = crypto.randomBytes(26).toString('hex');
		}
		const list = lists[i];
		list.token = generatedToken;
		await list.save();
	}
	res.status(200).json({
		success: true
	});
});

const getSharedList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.params;
	const list = await List.findOne({ token }).populate('users');
	if (!list) {
		res.status(404);
		throw new Error('List Not Found');
	}
	const listDisplay = {
		title: list.title,
		items: list.items.length,
		createdAt: (list as any).createdAt,
		updatedAt: (list as any).updatedAt,
		users: (list.users as UserDocument[]).map((user: UserDocument) => ({
			_id: user._id,
			f_name: user.f_name,
			l_name: user.l_name,
			avatar: user.avatar
		}))
	};
	res.status(200).json({
		success: true,
		list: listDisplay
	});
});

const shareList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { token } = req.params;
    const list: ListDocument | null = await List.findOne({ token });
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
	let found = false;
	for (let i = 0; i < list.users.length; i++) {
		if (list.users[i].toString() === (user._id as ObjectId).toString()) {
			found = true;
			break;
		}
	}
	if (found) {
		res.status(400);
		throw new Error('Already in List');
	}
	for (let i = 0; i < list.deletedUsers.length; i++) {
		if (list.users[i].toString() === (user._id as ObjectId).toString()) {
			found = true;
			break;
		}
	}
	if (found) {
		res.status(400);
		throw new Error('Already in List');
	}
    list.users = [...(list.users as ObjectId[]), user._id as ObjectId];
    await list.save();
    res.status(200).json({
        success: true,
        id: list._id
    });
});

const resetListShareToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    for (let i = 0; i < list.users.length; i++) {
        if (list.users[i].toString() === (user._id as ObjectId).toString()) {
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let generatedToken = crypto.randomBytes(26).toString('hex');
    while (await List.findOne({ token: generatedToken })) {
        generatedToken = crypto.randomBytes(26).toString('hex');
    }
    list.token = generatedToken;
	await list.save();
    res.status(200).json({
        success: true,
        token: generatedToken
    });
});

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
	getDeletedLists,
	restoreList,
	deletePermanently,
	deleteAllListsUserDeleted,
	shareList,
	resetListShareToken,
	getSharedList,
	createShareToken
};
