// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductById, getRelatedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProductById(id);
      setProduct(data.product);
      setMainImage(data.product.images[0]);
      // Select first variant if exists
      if (data.product.variants && data.product.variants.length > 0) {
        setSelectedVariant(data.product.variants[0]);
      }
      // Load related
      const relatedRes = await getRelatedProducts(id);
      setRelated(relatedRes.data.products);
    } catch (err) {
      console.error(err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    if (!selectedVariant) {
      alert('Please select a size/color variant');
      return;
    }
    try {
      await addToCart(product, selectedVariant._id, quantity, selectedVariant.size, selectedVariant.color);
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error || !product) return <div className="container">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="detail-grid">
          <div className="image-gallery">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb ${idx}`}
                  className={mainImage === img ? 'active-thumb' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="rating-detail">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating || 4) ? 'star filled' : 'star'} />
              ))}
              <span>{product.rating || 4} / 5</span>
            </div>
            <div className="price-detail">₹{product.price.toLocaleString()}</div>
            <p className="description">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="variant-selector">
                <h4>Select Variant:</h4>
                <div className="variants">
                  {product.variants.map(v => (
                    <button
                      key={v._id}
                      className={`variant-btn ${selectedVariant?._id === v._id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size} / {v.color} (Stock: {v.stock})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-selector">
              <label>Quantity:</label>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-detail" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="wishlist-btn"><FaHeart /> Wishlist</button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="products-grid">
              {related.map(rel => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;