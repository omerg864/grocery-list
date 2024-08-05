import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import { getItem, updateItem, shareItem, getSharedItem } from '../controllers/listItemController';
import { upload } from '../config/upload';

const router = express.Router();

router.get('/:id', protectUser, getItem);
router.put('/:id', protectUser, upload.single('file'), updateItem);
router.post('/:id/share', protectUser, shareItem);
router.get('/:id/share', protectUser, getSharedItem);


export default router;
