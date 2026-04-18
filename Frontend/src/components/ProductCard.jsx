// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

const handleAddToCart = async (e) => {
  e.preventDefault();
  if (!user) {
    alert('Please login first');
    return;
  }
  if (!product.variants || product.variants.length === 0) {
    alert('This product has no available variant');
    return;
  }
  const variantId = product.variants[0]._id;
  try {
    await addToCart(product, variantId, 1, product.variants[0].size, product.variants[0].color);
    alert('Added to cart');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add');
  }
};

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="card-link">
        <div className="card-image">
          <img src={product.images[0]} alt={product.name} />
          <div className="card-overlay">
            <button className="quick-view">Quick View</button>
          </div>
        </div>
        <div className="card-content">
          <h3>{product.name}</h3>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(product.rating || 4) ? 'star filled' : 'star'} />
            ))}
            <span>({product.rating || 4})</span>
          </div>
          <div className="price">₹{product.price.toLocaleString()}</div>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <FaShoppingCart /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;