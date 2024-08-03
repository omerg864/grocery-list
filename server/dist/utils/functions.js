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
exports.uploadImageListItem = exports.deleteImage = exports.extractPublicId = exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const itemModel_1 = __importDefault(require("../models/itemModel"));
const listItemModel_1 = __importDefault(require("../models/listItemModel"));
const cloudinary_1 = require("cloudinary");
const sendEmail = (receiver, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    var transporter = (0, nodemailer_1.createTransport)({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
    let success = false;
    yield transporter.sendMail(mailOptions).then(() => {
        success = true;
    }).catch((err) => {
        console.log(err);
        success = false;
    });
    return success;
});
exports.sendEmail = sendEmail;
const extractPublicId = (url) => {
    // Remove the base URL and extract the part after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL");
    }
    const parts = url.substring(uploadIndex + 8).split('/'); // +8 to skip "/upload/"
    const publicIdWithExtension = parts.slice(1).join('/'); // Skip the version part
    // Remove the file extension
    const dotIndex = publicIdWithExtension.lastIndexOf('.');
    const publicId = dotIndex !== -1 ? publicIdWithExtension.substring(0, dotIndex) : publicIdWithExtension;
    return publicId;
};
exports.extractPublicId = extractPublicId;
const checkListItem = (listItemsWithSameImg, ItemWithTheSameImg) => {
    let deleteImage = true;
    if (listItemsWithSameImg.length > 1) {
        deleteImage = false;
    }
    if (ItemWithTheSameImg.length > 0) {
        deleteImage = false;
    }
    return deleteImage;
};
const checkItem = (listItemsWithSameImg, ItemWithTheSameImg) => {
    let deleteImage = true;
    if (listItemsWithSameImg.length > 0) {
        deleteImage = false;
    }
    if (ItemWithTheSameImg.length > 1) {
        deleteImage = false;
    }
    return deleteImage;
};
const deleteImage = (img, item) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const public_id = (0, exports.extractPublicId)(img);
    const [listItemsWithSameImg, ItemWithTheSameImg] = yield Promise.all([listItemModel_1.default.find({ img: img }), itemModel_1.default.find({ img: img })]);
    let deleteImage = item ? checkItem(listItemsWithSameImg, ItemWithTheSameImg) : checkListItem(listItemsWithSameImg, ItemWithTheSameImg);
    console.log(deleteImage, listItemsWithSameImg, ItemWithTheSameImg);
    if (deleteImage) {
        yield cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.log(error);
            }
        });
    }
});
exports.deleteImage = deleteImage;
const uploadImageListItem = (file, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.v2.uploader.upload(file.path, {
        folder: 'SuperCart/listItems',
        public_id: `${id}`,
    });
    return result.secure_url;
});
exports.uploadImageListItem = uploadImageListItem;
