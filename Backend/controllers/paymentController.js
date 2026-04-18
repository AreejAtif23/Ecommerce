import { confirmOrderPayment } from './orderController.js';
import crypto from 'crypto';

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const transactionId = crypto.randomBytes(16).toString('hex');
    const paymentUrl = `${process.env.CLIENT_URL}/process-payment?orderId=${orderId}&transactionId=${transactionId}&amount=${amount}`;
    res.json({ success: true, paymentUrl, transactionId, message: 'Redirect to payment gateway' });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod } = req.body;
    const order = await confirmOrderPayment(orderId, transactionId, paymentMethod || 'Easypaisa');
    if (!order) return res.status(404).json({ message: 'Order not found', success: false });
    res.json({ success: true, message: 'Payment successful', order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const paymentWebhook = async (req, res) => {
  res.json({ success: true });
};