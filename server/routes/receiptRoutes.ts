import express from 'express';
import { upload } from '../config/upload';
import { addReceipt, getReceipts, deleteReceipt } from '../controllers/receiptController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();


router.get('/:id', protectUser, getReceipts);
router.post('/:id', protectUser, upload.single('file'), addReceipt);
router.delete('/:id/:receiptId', protectUser, deleteReceipt);


export default router;