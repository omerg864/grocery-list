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
exports.getSharedItem = exports.shareItem = exports.updateItem = exports.getItem = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const listItemModel_1 = __importDefault(require("../models/listItemModel"));
const functions_1 = require("../utils/functions");
const cloud_1 = require("../config/cloud");
const itemModel_1 = __importDefault(require("../models/itemModel"));
const uuid_1 = require("uuid");
const getItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield listItemModel_1.default.findById(id).populate('list');
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    let found = false;
    for (let i = 0; i < item.list.users.length; i++) {
        if (item.list.users[i].toString() ===
            user._id.toString()) {
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
}));
exports.getItem = getItem;
const updateItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const { name, description, unit, category, amount } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Name is Required');
    }
    const item = yield listItemModel_1.default.findById(id).populate('list');
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    let found = false;
    for (let i = 0; i < item.list.users.length; i++) {
        if (item.list.users[i].toString() ===
            user._id.toString()) {
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    if (req.file) {
        const imageID = (0, uuid_1.v4)();
        if (item.img) {
            const [_, image_url] = yield Promise.all([
                (0, functions_1.deleteImage)(item.img),
                (0, cloud_1.uploadToCloudinary)(req.file.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, imageID),
            ]);
            item.img = image_url;
        }
        else {
            item.img = yield (0, cloud_1.uploadToCloudinary)(req.file.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/items`, imageID);
        }
    }
    item.name = name;
    item.description = description;
    item.unit = unit;
    item.category = category;
    item.amount = amount;
    yield item.save();
    res.status(200).json({
        success: true,
        item,
    });
}));
exports.updateItem = updateItem;
const shareItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const item = yield listItemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
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
const getSharedItem = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield listItemModel_1.default.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item Not Found');
    }
    const itemDisplay = {
        name: item.name,
        description: item.description,
        unit: item.unit,
        category: item.category,
        img: item.img,
    };
    res.status(200).json({
        success: true,
        item: itemDisplay,
    });
}));
exports.getSharedItem = getSharedItem;
