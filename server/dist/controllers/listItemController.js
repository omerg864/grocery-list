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
exports.updateItem = exports.getItem = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const listItemModel_1 = __importDefault(require("../models/listItemModel"));
const cloudinary_1 = require("cloudinary");
const functions_1 = require("../utils/functions");
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
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        if (item.img) {
            const [_, image_url] = yield Promise.all([
                (0, functions_1.deleteImage)(item.img),
                (0, functions_1.uploadImageListItem)(req.file, id),
            ]);
            item.img = image_url;
        }
        else {
            item.img = yield (0, functions_1.uploadImageListItem)(req.file, id);
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
