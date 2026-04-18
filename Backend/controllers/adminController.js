import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([{ $match: { paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    const products = await Product.find();
    const lowStockProducts = products.filter(product => product.variants.some(variant => variant.stock < 5));
    res.json({ success: true, stats: { totalProducts, totalOrders, totalSales: totalSales[0]?.total || 0, lowStockCount: lowStockProducts.length }, lowStockProducts: lowStockProducts.map(p => ({ id: p._id, name: p.name, variants: p.variants.filter(v => v.stock < 5) })) });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};