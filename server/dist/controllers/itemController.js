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
exports.getItem = exports.updateItem = exports.addItem = exports.deleteItem = exports.getItems = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const itemModel_1 = __importDefault(require("../models/itemModel"));
const modelsConst_1 = require("../utils/modelsConst");
const cloudinary_1 = require("cloudinary");
const upload_1 = require("../config/upload");
const functions_1 = require("../utils/functions");
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
        const categories = [...new Set(items.map((item) => item.category))];
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
    const item = yield itemModel_1.default.create({
        name,
        description,
        unit,
        category,
        user: user._id,
    });
    if (req.file) {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: 'SuperCart/items',
            public_id: `${user._id}/${item._id}`,
        });
        yield (0, upload_1.unlinkAsync)(req.file.path);
        item.img = result.secure_url;
        yield item.save();
    }
    res.status(200).json({
        success: true,
        item,
    });
}));
exports.addItem = addItem;
const getItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield itemModel_1.default.findById(id).select(modelsConst_1.itemExclude);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    if (item.user.toString() !== user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
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
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        if (item.img) {
            (0, functions_1.deleteImage)(item.img, true);
        }
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: 'SuperCart/items',
            public_id: `${user._id}/${item._id}`,
        });
        yield (0, upload_1.unlinkAsync)(req.file.path);
        item.img = result.secure_url;
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
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (item.img) {
        yield Promise.all([(0, functions_1.deleteImage)(item.img, true), item.deleteOne()]);
    }
    else {
        yield item.deleteOne();
    }
    res.status(200).json({
        success: true,
        id,
    });
}));
exports.deleteItem = deleteItem;
