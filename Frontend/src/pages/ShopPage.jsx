// src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getFilterOptions } from '../services/api';
import '../styles/ShopPage.css';

const ShopPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'default'
  });
  const [filterOptions, setFilterOptions] = useState({ sizes: [], colors: [] });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [location]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const { data } = await getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      // sorting handled on frontend for simplicity, backend also supports but we'll do frontend
      const { data } = await getProducts(params);
      let productList = data.products;
      // Apply sorting
      if (filters.sort === 'price-asc') {
        productList.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        productList.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating-desc') {
        productList.sort((a, b) => b.rating - a.rating);
      }
      setProducts(productList);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1>Our Collection</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>

        <div className="filters-bar">
          <div className="search-filter">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="category-filter">
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="price-filter">
            <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
            <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
          </div>
          <div className="sort-filter">
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className="products-count">
          Showing {products.length} of {total} products
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;