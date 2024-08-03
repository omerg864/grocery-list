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
exports.updateUser = exports.resetPasswordEmail = exports.resetPasswordToken = exports.updateUserPassword = exports.getUser = exports.register = exports.verify = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const regex_1 = require("../utils/regex");
const userModel_1 = __importDefault(require("../models/userModel"));
const modelsConst_1 = require("../utils/modelsConst");
const functions_1 = require("../utils/functions");
const cloudinary_1 = require("cloudinary");
const upload_1 = require("../config/upload");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!regex_1.email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if (!regex_1.password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    var user = yield userModel_1.default.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
    });
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    if (!user.isVerified) {
        res.status(400);
        throw new Error('Please verify your email');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id);
    const userEx = yield userModel_1.default.findById(user._id).select(modelsConst_1.userExclude);
    res.status(200).json({
        success: true,
        user: userEx,
        token,
    });
}));
exports.login = login;
const register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { f_name, l_name, email, password } = req.body;
    if (!f_name || !l_name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if (!regex_1.email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if (!regex_1.password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const userExists = yield userModel_1.default.findOne({
        email: { $regex: new RegExp(email, 'i') },
    });
    if (userExists) {
        res.status(400);
        throw new Error('User with that email already exists');
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = yield userModel_1.default.create({
        f_name,
        l_name,
        email: email,
        password: hashedPassword,
    });
    let success;
    try {
        success = yield (0, functions_1.sendEmail)(user.email, 'Verify your email', `Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`);
    }
    catch (err) {
        console.log(err);
        user.isVerified = true;
        yield user.save();
    }
    if (!success) {
        user.isVerified = true;
        yield user.save();
    }
    res.status(201).json({
        success: true,
    });
}));
exports.register = register;
const getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userReq = req.user;
    const user = yield userModel_1.default.findById(userReq._id).select(modelsConst_1.userExclude);
    res.status(200).json({
        success: true,
        user,
    });
}));
exports.getUser = getUser;
const updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { f_name, l_name, email } = req.body;
    if (!f_name || !l_name || !email) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if (!regex_1.email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if (req.file && !req.file.mimetype.startsWith('image')) {
        res.status(400);
        throw new Error('Please upload an image file');
    }
    const userExists = yield userModel_1.default.findOne({
        email: { $regex: new RegExp(email, 'i') },
    });
    if (userExists &&
        userExists._id.toString() !==
            req.user._id.toString()) {
        res.status(400);
        throw new Error('User with that email already exists');
    }
    const userReq = req.user;
    if (req.file) {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        if (userReq.avatar) {
            const public_id = `SuperCart/users/${userReq._id}/avatar`;
            yield cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
                if (error) {
                    console.log(error);
                }
            });
        }
        userReq.avatar = yield (0, upload_1.uploadToCloudinary)(req.file.buffer, 'SuperCart/users', `${userReq._id}/avatar`);
    }
    userReq.f_name = f_name;
    userReq.l_name = l_name;
    userReq.email = email;
    yield userReq.save();
    const userEx = yield userModel_1.default.findById(userReq._id).select(modelsConst_1.userExclude);
    res.status(200).json({
        success: true,
        user: userEx,
    });
}));
exports.updateUser = updateUser;
const updateUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const userReq = req.user;
    if (!password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if (!regex_1.password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    userReq.password = hashedPassword;
    yield userReq.save();
    res.status(200).json({
        success: true,
    });
}));
exports.updateUserPassword = updateUserPassword;
const resetPasswordToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const user = yield userModel_1.default.findOne({
        resetPasswordToken: { $regex: new RegExp(`^${token}$`, 'i') },
    });
    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }
    if (!password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if (!regex_1.password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    yield user.save();
    res.status(200).json({
        success: true,
    });
}));
exports.resetPasswordToken = resetPasswordToken;
const resetPasswordEmail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!regex_1.email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    const user = yield userModel_1.default.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
    });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    user.resetPasswordToken = token;
    yield user.save();
    let success;
    try {
        success = yield (0, functions_1.sendEmail)(user.email, 'Reset your password', `Please reset your password by clicking on the link: ${process.env.HOST_ADDRESS}/reset-password/${token}`);
    }
    catch (err) {
        console.log('email error: ' + err);
        user.resetPasswordToken = undefined;
        yield user.save();
        success = false;
    }
    res.status(200).json({
        success,
    });
}));
exports.resetPasswordEmail = resetPasswordEmail;
const verify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.default.findById(id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.isVerified = true;
    yield user.save();
    res.status(200).json({
        success: true,
    });
}));
exports.verify = verify;
