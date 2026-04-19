import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';
import mongoose from 'mongoose'; 

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items', success: false });
    }
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      const variant = product.variants.find(
        v => v.size === item.variant?.size && v.color === item.variant?.color
      );
      if (!variant || variant.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} (${item.variant?.size || ''} ${item.variant?.color || ''}) is out of stock`,
          success: false
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders); 
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found', success: false });
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) return res.status(401).json({ message: 'Not authorized', success: false });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    console.log('Updating order status:', { id, orderStatus });
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID', success: false });
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }
    
    order.status = orderStatus;
    
    if (orderStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const confirmOrderPayment = async (orderId, transactionId, paymentMethod) => {
  const order = await Order.findById(orderId);
  if (!order) return null;
  order.paymentStatus = 'Paid';
  order.paymentDetails = { transactionId, paymentMethod };
  await order.save();
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
    if (variant) { variant.stock -= item.quantity; await product.save(); }
  }
  await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
  await sendOrderConfirmationEmail(order.shippingAddress.email, order);
  return order;
};
