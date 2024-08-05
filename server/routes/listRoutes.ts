import express from 'express';
import { protectUser } from '../middleware/authMiddleware';
import { getLists, getList, addList, addNewItem, addExistingItem, sendToDeleted, sendToBought, restoreFromBought, restoreFromDeleted, addBundleItems, deleteForAll, deleteForMe, getDeletedLists, restoreList, deletePermanently, deleteAllListsUserDeleted, shareList, resetListShareToken, getSharedList, createShareToken } from '../controllers/listController';
import { upload } from '../config/upload';


const router = express.Router();

//router.get('/sharing', createShareToken);
router.get('/', protectUser, getLists);
router.post('/', protectUser, addList);
router.get('/deleted', protectUser, getDeletedLists);
router.get('/:id', protectUser, getList);
router.post('/:id/item', protectUser, upload.single('file'), addNewItem);
router.post('/:id/item/:item', protectUser, addExistingItem);
router.get('/:id/item/:item/delete', protectUser, sendToDeleted);
router.get('/:id/item/:item/restore', protectUser, restoreFromDeleted);
router.get('/:id/item/:item/shop', protectUser, restoreFromBought);
router.get('/:id/item/:item/bought', protectUser, sendToBought);
router.post('/:id/bundle/:bundle', protectUser, addBundleItems);
router.delete('/deleteAll', protectUser, deleteAllListsUserDeleted);
router.delete('/:id/me', protectUser, deleteForMe);
router.delete('/:id/all', protectUser, deleteForAll);
router.get('/:id/restore', protectUser, restoreList);
router.delete('/:id/permanently', protectUser, deletePermanently);
router.get('/:token/shared', protectUser, getSharedList);
router.post('/:token/share', protectUser, shareList);
router.put('/:id/share', protectUser, resetListShareToken);




export default router;