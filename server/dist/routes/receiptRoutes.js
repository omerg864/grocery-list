"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../config/upload");
const receiptController_1 = require("../controllers/receiptController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/:id', authMiddleware_1.protectUser, receiptController_1.getReceipts);
router.post('/:id', authMiddleware_1.protectUser, upload_1.upload.single('file'), receiptController_1.addReceipt);
router.delete('/:id/:receiptId', authMiddleware_1.protectUser, receiptController_1.deleteReceipt);
exports.default = router;
