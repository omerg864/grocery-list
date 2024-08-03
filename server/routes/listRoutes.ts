import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import { getLists, getList, addList, addNewItem, addExistingItem, sendToDeleted, sendToBought, restoreFromBought, restoreFromDeleted, addBundleItems } from '../controllers/listController';
import { upload } from '../config/upload';


const router = express.Router();

router.get('/', protectUser, getLists);
router.post('/', protectUser, addList);
router.get('/:id', protectUser, getList);
router.post('/:id/item', protectUser, upload.single('file'), addNewItem);
router.post('/:id/item/:item', protectUser, addExistingItem);
router.get('/:id/item/:item/delete', protectUser, sendToDeleted);
router.get('/:id/item/:item/restore', protectUser, restoreFromDeleted);
router.get('/:id/item/:item/shop', protectUser, restoreFromBought);
router.get('/:id/item/:item/bought', protectUser, sendToBought);
router.post('/:id/bundle/:bundle', protectUser, addBundleItems);



export default router;