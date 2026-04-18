import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true, min: 1 },
  price: Number
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});


cartSchema.pre('save', function() {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.updatedAt = Date.now();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;