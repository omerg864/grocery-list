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
exports.shareBundle = exports.getBundle = exports.deleteBundle = exports.updateBundle = exports.addBundle = exports.getBundles = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bundleModel_1 = __importDefault(require("../models/bundleModel"));
const itemModel_1 = __importDefault(require("../models/itemModel"));
const getBundles = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { limit } = req.query;
    const bundles = yield bundleModel_1.default.find({ user: user._id }).populate('items').limit(limit ? parseInt(limit) : 0);
    res.status(200).json({
        success: true,
        bundles
    });
}));
exports.getBundles = getBundles;
const getBundle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bundle = yield bundleModel_1.default.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    res.status(200).json({
        success: true,
        bundle
    });
}));
exports.getBundle = getBundle;
const addBundle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title, description, items } = req.body;
    if (!title || !items.length) {
        res.status(400);
        throw new Error('Title and Items are Required');
    }
    const bundle = yield bundleModel_1.default.create({
        title,
        description,
        items,
        user: user._id
    });
    res.status(200).json({
        success: true,
        bundle
    });
}));
exports.addBundle = addBundle;
const updateBundle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { title, description, items } = req.body;
    if (!title || !items) {
        res.status(400);
        throw new Error('Title and Items are Required');
    }
    const bundle = yield bundleModel_1.default.findById(req.params.id);
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    bundle.title = title;
    bundle.description = description;
    bundle.items = items;
    yield bundle.save();
    res.status(200).json({
        success: true,
        bundle
    });
}));
exports.updateBundle = updateBundle;
const deleteBundle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const bundle = yield bundleModel_1.default.findById(req.params.id);
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not Authorized');
    }
    yield bundleModel_1.default.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true
    });
}));
exports.deleteBundle = deleteBundle;
const createItemFromItemAndAddToList = (item, items, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newItem = yield itemModel_1.default.create({
        name: item.name,
        description: item.description,
        unit: item.unit,
        category: item.category,
        img: item.img,
        user: userId
    });
    items.push(newItem._id);
});
const shareBundle = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const bundle = yield bundleModel_1.default.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    let items = [];
    const promises = [];
    for (let i = 0; i < bundle.items.length; i++) {
        const itemContext = bundle.items[i];
        promises.push(createItemFromItemAndAddToList(itemContext, items, user._id));
    }
    yield Promise.all(promises);
    const newBundle = yield bundleModel_1.default.create({
        title: bundle.title,
        description: bundle.description,
        items,
        user: user._id
    });
    res.status(200).json({
        success: true,
        bundle: newBundle
    });
}));
exports.shareBundle = shareBundle;
