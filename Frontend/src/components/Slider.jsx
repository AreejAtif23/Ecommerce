// src/components/Slider.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Slider.css';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    title: 'Summer Sale Extravaganza',
    subtitle: 'Up to 70% off on selected items'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
    title: 'New Electronics Arrival',
    subtitle: 'Latest gadgets at best prices'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1445205170230-048b8a2f2e29?w=1200',
    title: 'Fashion Week Deals',
    subtitle: 'Trendy styles for everyone'
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide">
            <img src={slide.image} alt={slide.title} />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
              <button className="shop-now-btn">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
      <button className="slider-btn prev" onClick={prevSlide}><FaChevronLeft /></button>
      <button className="slider-btn next" onClick={nextSlide}><FaChevronRight /></button>
      <div className="dots">
        {slides.map((_, idx) => (
          <span key={idx} className={`dot ${idx === current ? 'active' : ''}`} onClick={() => setCurrent(idx)}></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;