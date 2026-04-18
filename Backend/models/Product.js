import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String}
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Shoes', 'Clothes', 'Watches', 'Purse/Wallet', 'Cosmetics'] },
  images: [{ type: String, required: true }],
  variants: [variantSchema],
  featured: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});


const Product = mongoose.model('Product', productSchema);
export default Product;