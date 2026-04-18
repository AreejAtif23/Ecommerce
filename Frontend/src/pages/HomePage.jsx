// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import '../styles/HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ featured: true, limit: 6 });
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="homepage">
      <div className="container">
        <Slider />
        <section className="categories-section">
          <h2>Shop by Categories</h2>
          <div className="categories-grid">
            {['Clothes', 'Shoes', 'Purse/Wallet', 'Cosmetics', 'Watches'].map(cat => (
              <div key={cat} className="category-card">
                <div className="category-icon">✨</div>
                <h3>{cat}</h3>
              </div>
            ))}
          </div>
        </section>
        <section className="featured-section">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;