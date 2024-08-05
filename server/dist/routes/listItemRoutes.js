"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const listItemController_1 = require("../controllers/listItemController");
const upload_1 = require("../config/upload");
const router = express_1.default.Router();
router.get('/:id', authMiddleware_1.protectUser, listItemController_1.getItem);
router.put('/:id', authMiddleware_1.protectUser, upload_1.upload.single('file'), listItemController_1.updateItem);
router.post('/:id/share', authMiddleware_1.protectUser, listItemController_1.shareItem);
router.get('/:id/share', authMiddleware_1.protectUser, listItemController_1.getSharedItem);
exports.default = router;
