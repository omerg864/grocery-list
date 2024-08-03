"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../config/upload");
const authMiddleware_1 = require("../middleware/authMiddleware");
const itemController_1 = require("../controllers/itemController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protectUser, itemController_1.getItems);
router.get('/:id', authMiddleware_1.protectUser, itemController_1.getItem);
router.post('/', authMiddleware_1.protectUser, upload_1.upload.single('file'), itemController_1.addItem);
router.put('/:id', authMiddleware_1.protectUser, upload_1.upload.single('file'), itemController_1.updateItem);
router.delete('/:id', authMiddleware_1.protectUser, itemController_1.deleteItem);
exports.default = router;
