import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';
import mongoose from 'mongoose'; 


// export const createOrder = async (req, res) => {
//   try {
//     const { shippingAddress } = req.body;
//     const cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
//     if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty', success: false });
//     for (const item of cart.items) {
//       const product = await Product.findById(item.productId._id);
//       const variant = product.variants.id(item.variantId);
//       if (!variant || variant.stock < item.quantity) return res.status(400).json({ message: `${product.name} (${variant?.size || ''} ${variant?.color || ''}) is out of stock`, success: false });
//     }
//     const orderItems = cart.items.map(item => ({ productId: item.productId._id, productName: item.productId.name, price: item.price, quantity: item.quantity, size: item.size, color: item.color }));
//     const totalAmount = cart.totalPrice;
//     const order = await Order.create({ user: req.user.id, items: orderItems, totalAmount, shippingAddress: { fullName: shippingAddress.fullName, phone: shippingAddress.phone, email: shippingAddress.email, address: shippingAddress.address, city: shippingAddress.city }, paymentStatus: 'Pending' });
//     res.json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };



export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items', success: false });
    }

    // Stock validation
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

// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };



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

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found', success: false });
//     order.orderStatus = orderStatus;
//     await order.save();
//     res.json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };


// controllers/orderController.js
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
    
    // Update status
    order.status = orderStatus;
    
    // Update delivered flag if status is delivered
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