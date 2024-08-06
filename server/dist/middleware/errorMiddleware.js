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
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const statusCode = res.statusCode ? res.statusCode : 500;
    if (process.env.NODE_ENV === 'development') {
        console.log(err.stack);
    }
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack,
    });
});
exports.default = errorHandler;
