"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromList = exports.createShareToken = exports.getSharedList = exports.resetListShareToken = exports.shareList = exports.deleteAllListsUserDeleted = exports.deletePermanently = exports.restoreList = exports.getDeletedLists = exports.deleteForMe = exports.deleteForAll = exports.addBundleItems = exports.restoreFromBought = exports.restoreFromDeleted = exports.sendToBought = exports.sendToDeleted = exports.addExistingItem = exports.addNewItem = exports.changeListTitle = exports.addList = exports.getList = exports.getLists = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const listModel_1 = __importDefault(require("../models/listModel"));
const itemModel_1 = __importDefault(require("../models/itemModel"));
const listItemModel_1 = __importDefault(require("../models/listItemModel"));
const bundleModel_1 = __importDefault(require("../models/bundleModel"));
const cloud_1 = require("../config/cloud");
const functions_1 = require("../utils/functions");
const crypto_1 = __importDefault(require("crypto"));
const receiptModel_1 = __importDefault(require("../models/receiptModel"));
const uuid_1 = require("uuid");
const getLists = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const lists = yield listModel_1.default.aggregate([
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
}));
exports.getLists = getLists;
const getList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const ObjectId = mongoose_1.default.Types.ObjectId;
    const idObject = new ObjectId(id);
    const userId = new ObjectId(user._id);
    const listDisplay = yield listModel_1.default.aggregate([
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
}));
exports.getList = getList;
const changeListTitle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title } = req.body;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    list.title = title;
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.changeListTitle = changeListTitle;
const removeUserFromList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, userId } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    if (list.owner.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    if (list.owner.toString() === userId) {
        res.status(400);
        throw new Error('Cannot Remove Owner');
    }
    list.users = list.users.filter((listUser) => listUser.toString() !== userId.toString());
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.removeUserFromList = removeUserFromList;
const createListItemAndAddToList = (itemContext, list) => __awaiter(void 0, void 0, void 0, function* () {
    const listItem = yield listItemModel_1.default.create({
        name: itemContext.name,
        description: itemContext.description,
        unit: itemContext.unit,
        amount: itemContext.amount,
        category: itemContext.category,
        list: list._id,
        img: itemContext.img,
    });
    list.items.push(listItem._id);
});
const createListItemFromItemAndAddToList = (itemContext, list) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = itemContext.unit ? 1 : 0;
    const listItem = yield listItemModel_1.default.create({
        name: itemContext.name,
        description: itemContext.description,
        unit: itemContext.unit,
        amount,
        category: itemContext.category,
        list: list._id,
        img: itemContext.img,
    });
    list.items.push(listItem._id);
});
const addList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title, defaultItems, prevListItems } = req.body;
    if (!title) {
        res.status(400);
        throw new Error('Title is Required');
    }
    let generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    while (yield listModel_1.default.findOne({ token: generatedToken })) {
        generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    }
    const list = yield listModel_1.default.create({
        title,
        users: [user._id],
        owner: user._id,
        token: generatedToken,
    });
    const promises = [];
    if (prevListItems) {
        const prevList = yield listModel_1.default.findById(prevListItems).populate('items');
        if (prevList) {
            for (let i = 0; i < prevList.items.length; i++) {
                const item = prevList.items[i];
                promises.push(createListItemAndAddToList(item, list));
            }
        }
    }
    if (defaultItems) {
        const items = yield itemModel_1.default.find({ user: user._id, default: true });
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            promises.push(createListItemFromItemAndAddToList(item, list));
        }
    }
    if (promises.length > 0) {
        promises.push(list.save());
        yield Promise.all(promises);
    }
    res.status(200).json({
        success: true,
        list,
    });
}));
exports.addList = addList;
const createListItem = (name, description, unit, amount, category, list, img) => __awaiter(void 0, void 0, void 0, function* () {
    let newItem;
    let imageUrl;
    if (img && typeof img !== 'string') {
        const imageID = (0, uuid_1.v4)();
        [newItem, imageUrl] = yield Promise.all([
            listItemModel_1.default.create({
                name,
                description,
                unit,
                amount,
                category,
                list,
            }), (0, cloud_1.uploadToCloudinary)(img.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, `${imageID}`)
        ]);
        newItem.img = imageUrl;
        yield newItem.save();
    }
    else {
        newItem = yield listItemModel_1.default.create({
            name,
            description,
            unit,
            amount,
            category,
            list,
            img: img,
        });
    }
    return newItem;
});
const createItem = (name, description, unit, category, user, img) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield itemModel_1.default.create({
        name,
        description,
        unit,
        category,
        user: user,
    });
    if (img) {
        const imageID = (0, uuid_1.v4)();
        item.img = yield (0, cloud_1.uploadToCloudinary)(img.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, `${imageID}`);
        yield item.save();
    }
    return item;
});
const addNewItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, description, unit, amount, category, saveItem } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Name is Required');
    }
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let listItem, item;
    if (saveItem) {
        item = yield createItem(name, description, unit, category, user._id, req.file);
        listItem = yield createListItem(name, description, unit, amount, category, list._id, item.img);
    }
    else {
        listItem = yield createListItem(name, description, unit, amount, category, list._id, req.file);
    }
    list.items.push(listItem._id);
    yield list.save();
    res.status(200).json({
        success: true,
        item: item,
    });
}));
exports.addNewItem = addNewItem;
const addExistingItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { amount, unit } = req.body;
    const { id, item } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    const ItemContext = yield itemModel_1.default.findById(item);
    if (!ItemContext) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    const listItem = yield listItemModel_1.default.create({
        name: ItemContext.name,
        description: ItemContext.description,
        unit,
        amount,
        category: ItemContext.category,
        list: list._id,
        img: ItemContext.img,
    });
    list.items.push(listItem._id);
    yield list.save();
    res.status(200).json({
        success: true,
        item: listItem,
    });
}));
exports.addExistingItem = addExistingItem;
const checkListAndItem = (listId, itemId, res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield listModel_1.default.findById(listId);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            userId.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    const listItem = yield listItemModel_1.default.findById(itemId);
    if (!listItem) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    return { list, listItem };
});
const sendToDeleted = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, item } = req.params;
    const { list, listItem } = yield checkListAndItem(id, item, res, user._id);
    list.items = list.items.filter((listItem) => listItem.toString() !== item.toString());
    list.deletedItems = [
        ...list.deletedItems,
        item,
    ];
    yield list.save();
    res.status(200).json({
        success: true,
        item: listItem,
    });
}));
exports.sendToDeleted = sendToDeleted;
const sendToBought = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, item } = req.params;
    const { list, listItem } = yield checkListAndItem(id, item, res, user._id);
    list.items = list.items.filter((listItem) => listItem.toString() !== item.toString());
    list.boughtItems = [
        ...list.boughtItems,
        item,
    ];
    yield list.save();
    res.status(200).json({
        success: true,
        item: listItem,
    });
}));
exports.sendToBought = sendToBought;
const restoreFromDeleted = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, item } = req.params;
    const { list, listItem } = yield checkListAndItem(id, item, res, user._id);
    list.deletedItems = list.deletedItems.filter((listItem) => listItem.toString() !== item.toString());
    list.items = [
        ...list.items,
        item,
    ];
    yield list.save();
    res.status(200).json({
        success: true,
        item: listItem,
    });
}));
exports.restoreFromDeleted = restoreFromDeleted;
const restoreFromBought = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, item } = req.params;
    const { list, listItem } = yield checkListAndItem(id, item, res, user._id);
    list.boughtItems = list.boughtItems.filter((listItem) => listItem.toString() !== item.toString());
    list.items = [
        ...list.items,
        item,
    ];
    yield list.save();
    res.status(200).json({
        success: true,
        item: listItem,
    });
}));
exports.restoreFromBought = restoreFromBought;
const addBundleItems = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, bundle } = req.params;
    const { amounts } = req.body;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    const bundleContext = yield bundleModel_1.default.findById(bundle).populate('items');
    if (!bundleContext) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    for (let i = 0; i < bundleContext.items.length; i++) {
        const item = bundleContext.items[i];
        const info = amounts.find((a) => a.id === item._id.toString());
        const listItem = yield listItemModel_1.default.create({
            name: item.name,
            description: item.description,
            unit: info.unit,
            amount: info.amount,
            category: item.category,
            list: list._id,
            img: item.img,
        });
        list.items = [
            ...list.items,
            listItem._id,
        ];
    }
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.addBundleItems = addBundleItems;
const deleteForAll = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id).populate('users');
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    if (list.owner.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    while (yield listModel_1.default.findOne({ token: generatedToken })) {
        generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    }
    list.users = [];
    list.deletedUsers = [user._id];
    list.token = generatedToken;
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.deleteForAll = deleteForAll;
const deleteForMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let owner = false;
    if (list.owner.toString() === user._id.toString()) {
        owner = true;
    }
    if (owner) {
        if (list.users.length > 1) {
            list.owner = list.users.find((userId) => userId.toString() !== user._id.toString());
        }
    }
    list.users = list.users.filter((listUser) => listUser.toString() !==
        user._id.toString());
    list.deletedUsers = [
        ...list.deletedUsers,
        user._id,
    ];
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.deleteForMe = deleteForMe;
const getDeletedLists = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const lists = yield listModel_1.default.find({ deletedUsers: user._id });
    const listsDisplay = lists.map((list) => (Object.assign(Object.assign({}, list.toObject()), { users: list.users.length, items: list.items.length, deletedItems: list.deletedItems.length, boughtItems: list.boughtItems.length, owner: list.owner.toString() ===
            user._id.toString() })));
    res.status(200).json({
        success: true,
        lists: listsDisplay,
    });
}));
exports.getDeletedLists = getDeletedLists;
const restoreList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    if (list.deletedUsers.find((userId) => userId.toString() ===
        user._id.toString())) {
        list.deletedUsers = list.deletedUsers.filter((userId) => userId.toString() !==
            user._id.toString());
        list.users = [...list.users, user._id];
        yield list.save();
        res.status(200).json({
            success: true,
        });
    }
    else {
        res.status(403);
        throw new Error('Not Authorized');
    }
}));
exports.restoreList = restoreList;
const deleteListReceipts = (listId) => __awaiter(void 0, void 0, void 0, function* () {
    const receipts = yield receiptModel_1.default.find({ list: listId });
    const promises = [];
    for (let i = 0; i < receipts.length; i++) {
        const img = receipts[i].img;
        if (img) {
            promises.push((0, cloud_1.deleteFromCloudinary)(img));
        }
    }
    promises.push(receiptModel_1.default.deleteMany({ list: listId }));
    yield Promise.all(promises);
});
const deletePermanently = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id).populate('items deletedItems boughtItems');
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    if (!list.deletedUsers.find((userId) => userId.toString() ===
        user._id.toString())) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let owner = false;
    if (list.owner.toString() === user._id.toString()) {
        owner = true;
    }
    if (owner) {
        // full delete
        for (let i = 0; i < list.items.length; i++) {
            const item = list.items[i];
            if (item.img) {
                (0, functions_1.deleteImage)(item.img);
            }
            listItemModel_1.default.deleteOne({ _id: item._id });
        }
        for (let i = 0; i < list.deletedItems.length; i++) {
            const item = list.deletedItems[i];
            if (item.img) {
                (0, functions_1.deleteImage)(item.img);
            }
            listItemModel_1.default.deleteOne({ _id: item._id });
        }
        for (let i = 0; i < list.boughtItems.length; i++) {
            const item = list.boughtItems[i];
            if (item.img) {
                (0, functions_1.deleteImage)(item.img);
            }
            listItemModel_1.default.deleteOne({ _id: item._id });
        }
        deleteListReceipts(list._id);
        yield listModel_1.default.deleteOne({ _id: list._id });
    }
    else {
        // remove user
        list.deletedUsers = list.deletedUsers.filter((listUser) => listUser.toString() !==
            user._id.toString());
        yield list.save();
    }
    res.status(200).json({
        success: true,
    });
}));
exports.deletePermanently = deletePermanently;
const deleteAllListsUserDeleted = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const lists = yield listModel_1.default.find({ deletedUsers: user._id }).populate('items deletedItems boughtItems');
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        let owner = false;
        if (list.owner.toString() === user._id.toString()) {
            owner = true;
        }
        if (owner) {
            // full delete
            for (let i = 0; i < list.items.length; i++) {
                const item = list.items[i];
                if (item.img) {
                    (0, functions_1.deleteImage)(item.img);
                }
                listItemModel_1.default.deleteOne({ _id: item._id });
            }
            for (let i = 0; i < list.deletedItems.length; i++) {
                const item = list.deletedItems[i];
                if (item.img) {
                    (0, functions_1.deleteImage)(item.img);
                }
                listItemModel_1.default.deleteOne({ _id: item._id });
            }
            for (let i = 0; i < list.boughtItems.length; i++) {
                const item = list.boughtItems[i];
                if (item.img) {
                    (0, functions_1.deleteImage)(item.img);
                }
                listItemModel_1.default.deleteOne({ _id: item._id });
            }
            deleteListReceipts(list._id);
            yield listModel_1.default.deleteOne({ _id: list._id });
        }
        else {
            // remove user
            list.users = list.users.filter((listUser) => listUser.toString() !==
                user._id.toString());
            list.deletedUsers = [
                ...list.deletedUsers,
                user._id,
            ];
            yield list.save();
        }
    }
    res.status(200).json({
        success: true,
    });
}));
exports.deleteAllListsUserDeleted = deleteAllListsUserDeleted;
const createShareToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield listModel_1.default.find();
    for (let i = 0; i < lists.length; i++) {
        let generatedToken = crypto_1.default.randomBytes(26).toString('hex');
        while (yield listModel_1.default.findOne({ token: generatedToken })) {
            generatedToken = crypto_1.default.randomBytes(26).toString('hex');
        }
        const list = lists[i];
        list.token = generatedToken;
        yield list.save();
    }
    res.status(200).json({
        success: true,
    });
}));
exports.createShareToken = createShareToken;
const getSharedList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const list = yield listModel_1.default.findOne({ token }).populate('users');
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    const listDisplay = {
        title: list.title,
        items: list.items.length,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
        users: list.users.map((user) => ({
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
}));
exports.getSharedList = getSharedList;
const shareList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { token } = req.params;
    const list = yield listModel_1.default.findOne({ token });
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    for (let i = 0; i < list.users.length; i++) {
        if (list.users[i].toString() === user._id.toString()) {
            found = true;
            break;
        }
    }
    if (found) {
        res.status(400);
        throw new Error('Already in List');
    }
    for (let i = 0; i < list.deletedUsers.length; i++) {
        if (list.users[i].toString() === user._id.toString()) {
            found = true;
            break;
        }
    }
    if (found) {
        res.status(400);
        throw new Error('Already in List');
    }
    list.users = [...list.users, user._id];
    yield list.save();
    res.status(200).json({
        success: true,
        id: list._id,
    });
}));
exports.shareList = shareList;
const resetListShareToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    for (let i = 0; i < list.users.length; i++) {
        if (list.users[i].toString() === user._id.toString()) {
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    let generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    while (yield listModel_1.default.findOne({ token: generatedToken })) {
        generatedToken = crypto_1.default.randomBytes(26).toString('hex');
    }
    list.token = generatedToken;
    yield list.save();
    res.status(200).json({
        success: true,
        token: generatedToken,
    });
}));
exports.resetListShareToken = resetListShareToken;
