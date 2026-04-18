import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, admin);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

export default router;