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
exports.deleteReceipt = exports.addReceipt = exports.getReceipts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const receiptModel_1 = __importDefault(require("../models/receiptModel"));
const listModel_1 = __importDefault(require("../models/listModel"));
const cloud_1 = require("../config/cloud");
const uuid_1 = require("uuid");
const getReceipts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
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
    const receipts = yield receiptModel_1.default.find({ list: id });
    res.status(200).json({
        success: true,
        receipts,
    });
}));
exports.getReceipts = getReceipts;
const addReceipt = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { url } = req.body;
    const { id } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
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
    if (!req.file && !url) {
        res.status(400);
        throw new Error('No file uploaded');
    }
    if (req.file && url) {
        res.status(400);
        throw new Error('Please upload only one file');
    }
    let receipt;
    if (req.file) {
        const imageID = (0, uuid_1.v4)();
        const img = yield (0, cloud_1.uploadToCloudinary)(req.file.buffer, `${process.env.CLOUDINARY_BASE_FOLDER}/lists/${id}`, imageID);
        receipt = yield receiptModel_1.default.create({
            img,
            list: id,
        });
    }
    else {
        receipt = yield receiptModel_1.default.create({
            url,
            list: id,
        });
    }
    res.status(201).json({
        success: true,
        receipt,
    });
}));
exports.addReceipt = addReceipt;
const deleteReceipt = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id, receiptId } = req.params;
    const list = yield listModel_1.default.findById(id);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
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
    const receipt = yield receiptModel_1.default.findById(receiptId);
    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }
    if (receipt.list.toString() !== id) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    const promises = [];
    if (receipt.img) {
        promises.push((0, cloud_1.deleteFromCloudinary)(receipt.img));
    }
    promises.push(receiptModel_1.default.deleteOne({ _id: receiptId }));
    yield Promise.all(promises);
    res.status(200).json({
        success: true,
    });
}));
exports.deleteReceipt = deleteReceipt;
