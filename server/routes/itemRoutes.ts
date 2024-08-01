import express from 'express';
import { upload } from '../config/upload';
import { protectUser } from '../middleware/authMiddleware';
import {
	getItems,
	addItem,
	updateItem,
	deleteItem,
} from '../controllers/itemController';

const router = express.Router();

router.get('/', protectUser, getItems);
router.post('/', protectUser, upload.single('file'), addItem);
router.put('/:id', protectUser, upload.single('file'), updateItem);
router.delete('/:id', protectUser, deleteItem);

export default router;
