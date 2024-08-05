"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const upload_1 = require("../config/upload");
const router = express_1.default.Router();
router.post('/login', userController_1.login);
router.post('/register', userController_1.register);
router.post('/verify/send', userController_1.resendVerificationEmail);
router.get('/verify/:id', userController_1.verify);
router.get('/', authMiddleware_1.protectUser, userController_1.getUser);
router.post('/reset-password/email', userController_1.resetPasswordEmail);
router.post('/reset-password/:token', userController_1.resetPasswordToken);
router.put('/update-password', authMiddleware_1.protectUser, userController_1.updateUserPassword);
router.put('/', authMiddleware_1.protectUser, upload_1.upload.single('file'), userController_1.updateUser);
router.put('/preferences', authMiddleware_1.protectUser, userController_1.updatePreferences);
router.post('/google', userController_1.googleAuth);
exports.default = router;
