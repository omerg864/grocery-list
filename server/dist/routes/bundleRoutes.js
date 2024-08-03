"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bundleController_1 = require("../controllers/bundleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protectUser, bundleController_1.getBundles);
router.post('/', authMiddleware_1.protectUser, bundleController_1.addBundle);
router.put('/:id', authMiddleware_1.protectUser, bundleController_1.updateBundle);
router.delete('/:id', authMiddleware_1.protectUser, bundleController_1.deleteBundle);
router.get('/:id', authMiddleware_1.protectUser, bundleController_1.getBundle);
exports.default = router;
