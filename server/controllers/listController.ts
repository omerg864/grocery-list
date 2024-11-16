import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { RequestWithUser } from '../interface/requestInterface';
import List from '../models/listModel';
import { UserDocument } from '../interface/userInterface';
import { ListDocument } from '../interface/listInterface';
import Item from '../models/itemModel';
import ListItem from '../models/listItemModel';
import Bundle from '../models/bundleModel';
import { ItemDocument } from '../interface/itemInterface';
import { ListItemDocument } from '../interface/listItemInterface';
import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloud';
import { deleteImage } from '../utils/functions';
import Receipt from '../models/receiptModel';
import { ReceiptDocument } from '../interface/receiptInterface';
import { v4 as uuid4 } from 'uuid';

const getLists = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const lists = await List.aggregate([
			{ $match: { users: user._id } },
			{ $sort: { updatedAt: -1 } },
			{
				$project: {
					_id: 1,
					title: 1,
					updatedAt: 1,
					createdAt: 1,
					users: { $size: '$users' },
					items: { $size: '$items' },
					deletedItems: { $size: '$deletedItems' },
					boughtItems: { $size: '$boughtItems' },
					owner: {
						$eq: [{ $toString: '$owner' }, { $toString: user._id }],
					},
				},
			},
		]);
		res.status(200).json({
			success: true,
			lists,
		});
	}
);

const getList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const ObjectId = mongoose.Types.ObjectId;
		if (!ObjectId.isValid(id)) {
			res.status(404);
			throw new Error('List Not Found');
		}
		const idObject = new ObjectId(id);
		const userId = new ObjectId(user._id as string);
		const listDisplay = await List.aggregate([
			{ $match: { _id: idObject } },
			{
				$lookup: {
					from: 'users',
					localField: 'users',
					foreignField: '_id',
					as: 'users',
				},
			},
			{
				$lookup: {
					from: 'listitems',
					localField: 'items',
					foreignField: '_id',
					as: 'items',
				},
			},
			{
				$lookup: {
					from: 'listitems',
					localField: 'deletedItems',
					foreignField: '_id',
					as: 'deletedItems',
				},
			},
			{
				$lookup: {
					from: 'listitems',
					localField: 'boughtItems',
					foreignField: '_id',
					as: 'boughtItems',
				},
			},
			{
				$addFields: {
					found: {
						$in: [userId, '$users._id'],
					},
					owner: {
						$eq: ['$owner', userId],
					},
					categories: {
						$reduce: {
							input: {
								$concatArrays: [
									'$items',
									'$deletedItems',
									'$boughtItems',
								],
							},
							initialValue: [],
							in: {
								$setUnion: [
									'$$value',
									{
										$cond: {
											if: {
												$and: [
													{
														$ne: [
															'$$this.category',
															null,
														],
													},
													{
														$ne: [
															{
																$trim: {
																	input: '$$this.category',
																},
															},
															'',
														],
													},
												],
											},
											then: ['$$this.category'],
											else: [],
										},
									},
								],
							},
						},
					},
				},
			},
			{
				$match: { found: true },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					updatedAt: 1,
					owner: 1,
					users: {
						$filter: {
							input: '$users',
							as: 'listUser',
							cond: { $ne: ['$$listUser._id', userId] },
						},
					},
					items: 1,
					token: 1,
					deletedItems: 1,
					boughtItems: 1,
					categories: 1,
				},
			},
		]);
		if (!listDisplay || listDisplay.length === 0) {
			res.status(404);
			throw new Error('List Not Found');
		}
		res.status(200).json({
			success: true,
			list: listDisplay[0],
		});
	}
);

const changeListTitle = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { title } = req.body;
		const { id } = req.params;
		if (!title) {
			res.status(400);
			throw new Error('Title is Required');
		}
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
		list.title = title;
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const removeUserFromList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id, userId } = req.params;
		const list: ListDocument | null = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		if (list.owner.toString() !== (user._id as ObjectId).toString()) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		if (list.owner.toString() === userId) {
			res.status(400);
			throw new Error('Cannot Remove Owner');
		}
		list.users = (list.users as ObjectId[]).filter(
			(listUser) =>
				(listUser as ObjectId).toString() !== userId.toString()
		);
		await list.save();
		res.status(200).json({
			success: true,
		});
	}
);

const createListItemAndAddToList = async (
	itemContext: ListItemDocument,
	list: ListDocument
) => {
	const listItem = await ListItem.create({
		name: itemContext.name,
		description: itemContext.description,
		unit: itemContext.unit,
		amount: itemContext.amount,
		category: itemContext.category,
		list: list._id,
		img: itemContext.img,
	});
	(list.items as ObjectId[]).push(listItem._id as ObjectId);
};

const createListItemFromItemAndAddToList = async (
	itemContext: ItemDocument,
	list: ListDocument
) => {
	const amount = itemContext.unit ? 1 : 0;
	const listItem = await ListItem.create({
		name: itemContext.name,
		description: itemContext.description,
		unit: itemContext.unit,
		amount,
		category: itemContext.category,
		list: list._id,
		img: itemContext.img,
	});
	(list.items as ObjectId[]).push(listItem._id as ObjectId);
};

const createListItemFromItemAndDataAndAddToList = async (
	itemContext: ItemDocument,
	list: ListDocument,
	unit: string,
	amount: number
) => {
	const listItem = await ListItem.create({
		name: itemContext.name,
		description: itemContext.description,
		unit,
		amount,
		category: itemContext.category,
		list: list._id,
		img: itemContext.img,
	});
	(list.items as ObjectId[]).push(listItem._id as ObjectId);
};

const addList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { title, defaultItems, prevListItems } = req.body;
		if (!title) {
			res.status(400);
			throw new Error('Title is Required');
		}
		let generatedToken = uuid4();
		const list: ListDocument = await List.create({
			title,
			users: [user._id],
			owner: user._id,
			token: generatedToken,
		});
		const promises = [];
		if (prevListItems) {
			const prevList = await List.findById(prevListItems).populate(
				'items'
			);
			if (prevList) {
				for (let i = 0; i < prevList.items.length; i++) {
					const item = prevList.items[i] as ListItemDocument;
					promises.push(createListItemAndAddToList(item, list));
				}
			}
		}
		if (defaultItems) {
			const items = await Item.find({ user: user._id, default: true });
			for (let i = 0; i < items.length; i++) {
				const item = items[i] as ItemDocument;
				promises.push(createListItemFromItemAndAddToList(item, list));
			}
		}
		if (promises.length > 0) {
			await Promise.all(promises);
		}
		await list.save();
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
	let newItem: ListItemDocument;
	let imageUrl: string;
	if (img && typeof img !== 'string') {
		const imageID = uuid4();
		[newItem, imageUrl] = await Promise.all([
			ListItem.create({
				name,
				description,
				unit,
				amount,
				category,
				list,
			}),
			uploadToCloudinary(
				img.buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/items`,
				`${imageID}`
			),
		]);
		newItem.img = imageUrl;
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
	const item: ItemDocument = await Item.create({
		name,
		description,
		unit,
		category,
		user: user,
	});
	if (img) {
		const imageID = uuid4();
		item.img = await uploadToCloudinary(
			img.buffer,
			`${process.env.CLOUDINARY_BASE_FOLDER}/items`,
			`${imageID}`
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

const checkList = async (
	id: string,
	res: Response,
	userId: unknown
): Promise<ListDocument> => {
	const list: ListDocument | null = await List.findById(id);
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
	return list;
};

const checkListItem = async (
	id: string,
	res: Response
): Promise<ListItemDocument> => {
	const listItem: ListItemDocument | null = await ListItem.findById(id);
	if (!listItem) {
		res.status(404);
		throw new Error('Item Not Found');
	}
	return listItem;
};

const checkListAndItem = async (
	listId: string,
	itemId: string,
	res: Response,
	userId: unknown
): Promise<{ list: ListDocument; listItem: ListItemDocument }> => {
	const [list, listItem] = await Promise.all([
		checkList(listId, res, userId),
		checkListItem(itemId, res),
	]);
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
		(list.deletedItems as ObjectId[]).push(item as unknown as ObjectId);
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
		(list.boughtItems as ObjectId[]).push(item as unknown as ObjectId);
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
		(list.items as ObjectId[]).push(item as unknown as ObjectId);
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
		(list.items as ObjectId[]).push(item as unknown as ObjectId);
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
		const promises = [];
		for (let i = 0; i < bundleContext.items.length; i++) {
			const item = bundleContext.items[i] as ItemDocument;
			const info = amounts.find(
				(a: { id: string; amount: number | undefined; unit: string }) =>
					a.id === (item._id as ObjectId).toString()
			)!;
			if (!info) {
				continue;
			}
			promises.push(
				createListItemFromItemAndDataAndAddToList(
					item,
					list,
					info.unit,
					info.amount
				)
			);
		}
		await Promise.all(promises);
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
		const list: ListDocument | null = await List.findById(id).populate(
			'users'
		);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		if (list.owner.toString() !== (user._id as ObjectId).toString()) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		let generatedToken = uuid4();
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
		(list.deletedUsers as ObjectId[]).push(user._id as ObjectId);
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
			(list.users as ObjectId[]).push(user._id as ObjectId);
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

const deleteListReceipts = async (listId: unknown) => {
	const receipts: ReceiptDocument[] = await Receipt.find({ list: listId });
	const promises = [];
	for (let i = 0; i < receipts.length; i++) {
		const img: string | undefined = receipts[i].img;
		if (img) {
			promises.push(deleteFromCloudinary(img));
		}
	}
	promises.push(Receipt.deleteMany({ list: listId }));
	await Promise.all(promises);
};

const deleteList = async (
	list: ListDocument,
	owner: boolean,
	userId: unknown
) => {
	const promises = [];
	if (owner) {
		// full delete
		for (let i = 0; i < list.items.length; i++) {
			const item = list.items[i] as ListItemDocument;
			if (item.img) {
				promises.push(deleteImage(item.img));
			}
			promises.push(ListItem.deleteOne({ _id: item._id }));
		}
		for (let i = 0; i < list.deletedItems.length; i++) {
			const item = list.deletedItems[i] as ListItemDocument;
			if (item.img) {
				promises.push(deleteImage(item.img));
			}
			promises.push(ListItem.deleteOne({ _id: item._id }));
		}
		for (let i = 0; i < list.boughtItems.length; i++) {
			const item = list.boughtItems[i] as ListItemDocument;
			if (item.img) {
				promises.push(deleteImage(item.img));
			}
			promises.push(ListItem.deleteOne({ _id: item._id }));
		}
		promises.push(deleteListReceipts(list._id));
		promises.push(List.deleteOne({ _id: list._id }));
		await Promise.all(promises);
	} else {
		// delete user
		list.deletedUsers = (list.deletedUsers as ObjectId[]).filter(
			(listUser) =>
				(listUser as ObjectId).toString() !==
				(userId as ObjectId).toString()
		);
		await list.save();
	}
};

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
		await deleteList(list, owner, user._id);
		res.status(200).json({
			success: true,
		});
	}
);

const deleteAllListsUserDeleted = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const lists = await List.find({ deletedUsers: user._id }).populate(
			'items deletedItems boughtItems'
		);
		const promises = [];
		for (let i = 0; i < lists.length; i++) {
			const list: ListDocument = lists[i];
			let owner = false;
			if (list.owner.toString() === (user._id as ObjectId).toString()) {
				owner = true;
			}
			promises.push(deleteList(list, owner, user._id));
		}
		await Promise.all(promises);
		res.status(200).json({
			success: true,
		});
	}
);

const createShareToken = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const lists = await List.find();
		for (let i = 0; i < lists.length; i++) {
			let generatedToken = uuid4();
			const list = lists[i];
			list.token = generatedToken;
			await list.save();
		}
		res.status(200).json({
			success: true,
		});
	}
);

const getSharedList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
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
				avatar: user.avatar,
			})),
		};
		res.status(200).json({
			success: true,
			list: listDisplay,
		});
	}
);

const shareList = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { token } = req.params;
		const list: ListDocument | null = await List.findOne({ token });
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		let found = false;
		for (let i = 0; i < list.users.length; i++) {
			if (
				list.users[i].toString() === (user._id as ObjectId).toString()
			) {
				found = true;
				break;
			}
		}
		if (found) {
			res.status(400);
			throw new Error('Already in List');
		}
		for (let i = 0; i < list.deletedUsers.length; i++) {
			if (
				list.users[i].toString() === (user._id as ObjectId).toString()
			) {
				found = true;
				break;
			}
		}
		if (found) {
			res.status(400);
			throw new Error('Already in List');
		}
		(list.users as ObjectId[]).push(user._id as ObjectId);
		await list.save();
		res.status(200).json({
			success: true,
			id: list._id,
		});
	}
);

const resetListShareToken = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = (req as RequestWithUser).user;
		const { id } = req.params;
		const list = await List.findById(id);
		if (!list) {
			res.status(404);
			throw new Error('List Not Found');
		}
		let found = false;
		for (let i = 0; i < list.users.length; i++) {
			if (
				list.users[i].toString() === (user._id as ObjectId).toString()
			) {
				found = true;
				break;
			}
		}
		if (!found) {
			res.status(403);
			throw new Error('Not Authorized');
		}
		let generatedToken = uuid4();
		list.token = generatedToken;
		await list.save();
		res.status(200).json({
			success: true,
			token: generatedToken,
		});
	}
);

export {
	getLists,
	getList,
	addList,
	changeListTitle,
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
	createShareToken,
	removeUserFromList,
};
