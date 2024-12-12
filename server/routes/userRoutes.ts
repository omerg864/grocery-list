import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import {
	login,
	register,
	verify,
	getUser,
	resetPasswordEmail,
	resetPasswordToken,
	updateUserPassword,
	updateUser,
	resendVerificationEmail,
	updatePreferences,
	googleAuth,
	createSharingToken,
	getUserDataByToken,
	shareWithUser,
	deleteSharedUser
} from '../controllers/userController';
import { upload } from '../config/cloud';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify/send', resendVerificationEmail);
router.get('/verify/:id', verify);
router.get('/', protectUser, getUser);
router.post('/reset-password/email', resetPasswordEmail);
router.post('/reset-password/:token', resetPasswordToken);
router.put('/update-password', protectUser, updateUserPassword);
router.put('/', protectUser, upload.single('file'), updateUser);
router.put('/preferences', protectUser, updatePreferences);
router.post('/google', googleAuth);
router.get('/sharing-token', protectUser, createSharingToken);
router.get('/sharing-token/:token', protectUser, getUserDataByToken);
router.post('/share/:token', protectUser, shareWithUser);
router.delete('/share/:id', protectUser, deleteSharedUser);

export default router;
