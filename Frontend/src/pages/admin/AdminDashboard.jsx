// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    lowStockCount: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data.stats);
      setLowStockProducts(data.lowStockProducts);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales (₹)</h3>
            <p>₹{stats.totalSales.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Low Stock Items</h3>
            <p>{stats.lowStockCount}</p>
          </div>
        </div>

        <div className="admin-links">
          <Link to="/admin/users" className="admin-link">Manage Users</Link>
          <Link to="/admin/products" className="admin-link">Manage Products (coming soon)</Link>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="low-stock-section">
            <h2>Low Stock Alerts</h2>
            <table className="low-stock-table">
              <thead>
                <tr><th>Product</th><th>Variant</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  product.variants.map((variant, idx) => (
                    <tr key={`${product.id}-${idx}`}>
                      <td>{product.name}</td>
                      <td>{variant.size} / {variant.color}</td>
                      <td className="low-stock">{variant.stock}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;