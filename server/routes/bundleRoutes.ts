import express from 'express';
import { getBundles, addBundle, updateBundle, deleteBundle, getBundle, shareBundle } from '../controllers/bundleController';
import { protectUser } from '../middleware/authMiddleware';


const router = express.Router();

router.get('/', protectUser, getBundles);
router.post('/', protectUser, addBundle);
router.put('/:id', protectUser, updateBundle);
router.delete('/:id', protectUser, deleteBundle);
router.get('/:id', protectUser, getBundle);
router.post('/:id/share', protectUser, shareBundle);


export default router;