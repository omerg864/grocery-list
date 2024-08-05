import express from 'express';
import { upload } from '../config/upload';
import { protectUser } from '../middleware/authMiddleware';
import {
	getItems,
	addItem,
	updateItem,
	deleteItem,
	getItem,
	changeDefault,
	shareItem
} from '../controllers/itemController';

const router = express.Router();

router.get('/', protectUser, getItems);
router.get('/:id', protectUser, getItem);
router.post('/', protectUser, upload.single('file'), addItem);
router.put('/:id', protectUser, upload.single('file'), updateItem);
router.delete('/:id', protectUser, deleteItem);
router.put('/:id/default', protectUser, changeDefault);
router.post('/:id/share', protectUser, shareItem);

export default router;
