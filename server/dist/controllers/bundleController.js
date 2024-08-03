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
exports.getBundle = exports.deleteBundle = exports.updateBundle = exports.addBundle = exports.getBundles = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bundleModel_1 = __importDefault(require("../models/bundleModel"));
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
    const user = req.user;
    const { id } = req.params;
    const bundle = yield bundleModel_1.default.findById(id).populate('items');
    if (!bundle) {
        res.status(404);
        throw new Error('Bundle Not Found');
    }
    if (bundle.user.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('Not Authorized');
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
    yield bundle.deleteOne();
    res.status(200).json({
        success: true
    });
}));
exports.deleteBundle = deleteBundle;
