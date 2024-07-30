import express from 'express';
import { protectUser } from '../middleware/authMiddleware.js';
import { login, register, verify, getUser, resetPasswordEmail, resetPasswordToken, updateUserPassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify/:id', verify);
router.get('/', protectUser, getUser);
router.post('/reset-password/email', resetPasswordEmail);
router.post('/reset-password/:token', resetPasswordToken);
router.put('/update-password', protectUser, updateUserPassword);




export default router;