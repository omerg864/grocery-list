import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import { getItem, updateItem } from '../controllers/listItemController';
import { upload } from '../config/upload';

const router = express.Router();

router.get('/:id', protectUser, getItem);
router.put('/:id', protectUser, upload.single('file'), updateItem);

export default router;
