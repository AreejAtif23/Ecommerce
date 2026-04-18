// src/pages/AboutPage.jsx
import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About ShopWave</h1>
        <div className="about-content">
          <p>Founded in 2026, ShopWave is your premier destination for online shopping. We bring you the latest trends in electronics, fashion, home decor, and more at unbeatable prices.</p>
          <h3>Our Mission</h3>
          <p>To provide a seamless, secure, and enjoyable shopping experience with exceptional customer service and fast delivery.</p>
          <h3>Why Choose Us?</h3>
          <ul>
            <li>✓ 100% Authentic Products</li>
            <li>✓ Fast & Free Shipping</li>
            <li>✓ 30-Day Return Policy</li>
            <li>✓ 24/7 Customer Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;