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
exports.deleteForMe = exports.deleteForAll = exports.addBundleItems = exports.restoreFromBought = exports.restoreFromDeleted = exports.sendToBought = exports.sendToDeleted = exports.addExistingItem = exports.addNewItem = exports.addList = exports.getList = exports.getLists = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const listModel_1 = __importDefault(require("../models/listModel"));
const modelsConst_1 = require("../utils/modelsConst");
const itemModel_1 = __importDefault(require("../models/itemModel"));
const listItemModel_1 = __importDefault(require("../models/listItemModel"));
const upload_1 = require("../config/upload");
const cloudinary_1 = require("cloudinary");
const bundleModel_1 = __importDefault(require("../models/bundleModel"));
const getLists = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const lists = yield listModel_1.default.find({ users: user._id });
    const listsDisplay = lists.map((list) => (Object.assign(Object.assign({}, list.toObject()), { users: list.users.length, items: list.items.length, deletedItems: list.deletedItems.length, boughtItems: list.boughtItems.length, owner: list.owner.toString() ===
            user._id.toString() })));
    res.status(200).json({
        success: true,
        lists: listsDisplay,
    });
}));
exports.getLists = getLists;
const getList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id).populate(modelsConst_1.populateList);
    if (!list) {
        res.status(404);
        throw new Error('List Not Found');
    }
    let found = false;
    list.users.forEach((listUser) => {
        if (listUser._id.toString() ===
            user._id.toString()) {
            found = true;
        }
    });
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    const categories = new Set();
    list.items.forEach((item) => {
        if (item.category) {
            categories.add(item.category);
        }
    });
    list.deletedItems.forEach((item) => {
        if (item.category) {
            categories.add(item.category);
        }
    });
    list.boughtItems.forEach((item) => {
        if (item.category) {
            categories.add(item.category);
        }
    });
    const listDisplay = Object.assign(Object.assign({}, list.toObject()), { owner: list.owner.toString() ===
            user._id.toString(), users: list.users.filter((listUser) => listUser._id.toString() !==
            user._id.toString()), categories: Array.from(categories) });
    res.status(200).json({
        success: true,
        list: listDisplay,
    });
}));
exports.getList = getList;
const addList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title, defaultItems, previousList } = req.body;
    if (!title) {
        res.status(400);
        throw new Error('Title is Required');
    }
    const list = yield listModel_1.default.create({
        title,
        users: [user._id],
        owner: user._id,
    });
    res.status(200).json({
        success: true,
        list,
    });
}));
exports.addList = addList;
const createListItem = (name, description, unit, amount, category, list, img) => __awaiter(void 0, void 0, void 0, function* () {
    let newItem;
    if (img && typeof img !== 'string') {
        newItem = yield listItemModel_1.default.create({
            name,
            description,
            unit,
            amount,
            category,
            list,
        });
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const result = yield cloudinary_1.v2.uploader.upload(img.path, {
            folder: 'SuperCart/listItems',
            public_id: `${newItem._id}`,
        });
        yield (0, upload_1.unlinkAsync)(img.path);
        newItem.img = result.secure_url;
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
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const result = yield cloudinary_1.v2.uploader.upload(img.path, {
            folder: 'SuperCart/items',
            public_id: `${user}/${item._id}`,
        });
        yield (0, upload_1.unlinkAsync)(img.path);
        item.img = result.secure_url;
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
        item: listItem,
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
        console.log(item._id);
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
    list.users = [user._id];
    list.deleted = true;
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.deleteForAll = deleteForAll;
const deleteForMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: implement deleteForMe
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
    list.users = list.users.filter((listUser) => listUser.toString() !==
        user._id.toString());
    yield list.save();
    res.status(200).json({
        success: true,
    });
}));
exports.deleteForMe = deleteForMe;
