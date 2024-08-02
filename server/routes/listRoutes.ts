import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import { getLists, getList, addList, addItem } from '../controllers/listController';
import { upload } from '../config/upload';


const router = express.Router();

router.get('/', protectUser, getLists);
router.post('/', protectUser, addList);
router.get('/:id', protectUser, getList);
router.post('/:id/item', protectUser, upload.single('file'), addItem);



export default router;