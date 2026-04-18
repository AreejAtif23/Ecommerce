import express from 'express';
import { protect } from '../middleware/auth.js';
import { registerUser, verifyEmail, loginUser, forgotPassword, resetPassword, changePassword, getUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);
router.get('/profile', protect, getUserProfile);

export default router;