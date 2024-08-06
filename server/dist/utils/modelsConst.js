"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateList = exports.itemExclude = exports.userExclude = void 0;
exports.userExclude = '-password -__v -createdAt -updatedAt -resetPasswordToken';
exports.itemExclude = '-__v -createdAt -updatedAt -deleted';
exports.populateList = 'items deletedItems boughtItems users';
