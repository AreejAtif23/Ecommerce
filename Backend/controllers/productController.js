import Product from '../models/Product.js';
import mongoose from 'mongoose'; 

export const getProducts = async (req, res) => {
  console.log('getProducts called with query:', req.query);
  try {
    const { category, minPrice, maxPrice, size, color, search, featured, newArrival, page = 1, limit = 20 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) { query.price = {}; if (minPrice) query.price.$gte = Number(minPrice); if (maxPrice) query.price.$lte = Number(maxPrice); }
    if (featured === 'true') query.featured = true;
    if (newArrival === 'true') query.newArrival = true;
    if (search) query.$text = { $search: search };
    let products = await Product.find(query);
    if (size || color) {
      products = products.filter(product => product.variants.some(variant => {
        let match = true;
        if (size && variant.size !== size) match = false;
        if (color && variant.color !== color) match = false;
        return match;
      }));
    }
    const total = products.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);
    res.json({ success: true, products: paginatedProducts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found', success: false });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found', success: false });
    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
    res.json({ success: true, products: related });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const products = await Product.find();
    const sizes = new Set(), colors = new Set();
    products.forEach(product => product.variants.forEach(variant => { sizes.add(variant.size); colors.add(variant.color); }));
    res.json({ success: true, sizes: Array.from(sizes).sort(), colors: Array.from(colors).sort() });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, variants, featured, newArrival } = req.body;

    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, and at least one image',
      });
    }

    const allowedCategories = ['Shoes', 'Clothes', 'Watches', 'Purse/Wallet', 'Cosmetics'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed categories: ${allowedCategories.join(', ')}`,
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (!variant.size || !variant.color || variant.stock === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Each variant must have size, color, and stock',
          });
        }
        if (variant.stock < 0) {
          return res.status(400).json({
            success: false,
            message: 'Variant stock cannot be negative',
          });
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      variants: variants || [],
      featured: featured !== undefined ? featured : false,
      newArrival: newArrival !== undefined ? newArrival : true,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate SKU found. Please use unique SKU for each variant.',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Update request received for ID:', id);
    console.log('Request body:', req.body);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid product ID format', 
        success: false 
      });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        message: 'Product not found', 
        success: false 
      });
    }
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      message: error.message, 
      success: false,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Delete request received for ID:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid product ID format', 
        success: false 
      });
    }
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        message: 'Product not found', 
        success: false 
      });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};
