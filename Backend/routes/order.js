import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);
router.post('/create', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.get('/admin/all', admin, getAllOrders);
router.put('/admin/:id/status', admin, updateOrderStatus);

export default router;