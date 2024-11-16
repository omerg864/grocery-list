"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const ListScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: String,
        },
    ],
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem',
        },
    ],
    deletedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem',
        },
    ],
    boughtItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem',
        },
    ],
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deletedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    token: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.default = mongoose.model('List', ListScheme);
