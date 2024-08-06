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
exports.shareItem = exports.changeDefault = exports.getItem = exports.updateItem = exports.addItem = exports.deleteItem = exports.getItems = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const itemModel_1 = __importDefault(require("../models/itemModel"));
const modelsConst_1 = require("../utils/modelsConst");
const functions_1 = require("../utils/functions");
const cloud_1 = require("../config/cloud");
const bundleModel_1 = __importDefault(require("../models/bundleModel"));
const uuid_1 = require("uuid");
const getItems = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let { category, limit } = req.query;
    let addCategories = true;
    if (category) {
        addCategories = false;
    }
    const items = yield itemModel_1.default.find({
        user: user._id,
    })
        .select(modelsConst_1.itemExclude)
        .limit(limit ? parseInt(limit) : 0);
    if (addCategories) {
        let categories = new Set();
        items.forEach((item) => {
            if (item.category &&
                item.category.replace(/\s/g, '').length > 0) {
                categories.add(item.category);
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
}));
exports.getItems = getItems;
const addItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, description, unit, category } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Name is Required');
    }
    const imageID = (0, uuid_1.v4)();
    const item = yield itemModel_1.default.create({
        name,
        description,
        unit,
        category,
        user: user._id,
    });
    if (req.file) {
        item.img = yield (0, cloud_1.uploadToCloudinary)(req.file.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, `${imageID}`);
        yield item.save();
    }
    res.status(200).json({
        success: true,
        item,
    });
}));
exports.addItem = addItem;
const changeDefault = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    item.default = item.default ? false : true;
    yield item.save();
    res.status(200).json({
        success: true,
        default: item.default,
    });
}));
exports.changeDefault = changeDefault;
const getItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id).select(modelsConst_1.itemExclude);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    res.status(200).json({
        success: true,
        item,
    });
}));
exports.getItem = getItem;
const updateItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    if (item.user.toString() !== user._id.toString()) {
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
            yield (0, functions_1.deleteImage)(item.img, true);
        }
        const imageID = (0, uuid_1.v4)();
        item.img = yield (0, cloud_1.uploadToCloudinary)(req.file.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, `${imageID}`);
    }
    item.name = name;
    item.description = description;
    item.unit = unit;
    item.category = category;
    yield item.save();
    res.status(200).json({
        success: true,
        item,
    });
}));
exports.updateItem = updateItem;
const deleteItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    if (item.user.toString() !== user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const bundlesFound = yield bundleModel_1.default.find({ items: item._id });
    const promises = [];
    for (let bundle of bundlesFound) {
        if (bundle.items.length > 1) {
            bundle.items = bundle.items.filter((bundleItem) => bundleItem.toString() !==
                item._id.toString());
            promises.push(bundle.save());
        }
        else {
            promises.push(bundleModel_1.default.findByIdAndDelete(bundle._id));
        }
    }
    if (item.img) {
        promises.push((0, functions_1.deleteImage)(item.img, true));
    }
    promises.push(itemModel_1.default.deleteOne({ _id: id }));
    yield Promise.all(promises);
    res.status(200).json({
        success: true,
        id,
    });
}));
exports.deleteItem = deleteItem;
const shareItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    const newItem = yield itemModel_1.default.create({
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
}));
exports.shareItem = shareItem;
