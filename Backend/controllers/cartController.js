import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, size, color, quantity } = req.body;

    // Validation
    if (!productId || !variantId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields: productId, variantId, quantity', success: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    // Find the variant by _id (safe way)
    const variant = product.variants.find(v => v._id.toString() === variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found', success: false });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${variant.stock} left.`, success: false });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if same product + variant already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variantId.toString() === variantId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (variant.stock < newQuantity) {
        return res.status(400).json({ message: `Cannot add ${quantity}. Only ${variant.stock} available in total.`, success: false });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        variantId,
        size: size || variant.size,
        color: color || variant.color,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found', success: false });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found', success: false });

    const product = await Product.findById(item.productId);
    const variant = product.variants.id(item.variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found', success: false });

    if (variant.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock', success: false });
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found', success: false });

    const item = cart.items.id(itemId);
    if (item) item.deleteOne();

    await cart.save();
    await cart.populate('items.productId');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};