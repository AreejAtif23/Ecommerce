import express from 'express';
import { protect } from '../middleware/auth.js';
import { initiatePayment, paymentSuccess, paymentWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect);
router.post('/initiate', initiatePayment);
router.post('/success', paymentSuccess);
router.post('/webhook', paymentWebhook);

export default router;