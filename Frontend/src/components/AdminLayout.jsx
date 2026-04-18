// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start open on desktop

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Hamburger button for mobile/tablet */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          <Link to="/admin/users" onClick={() => setSidebarOpen(false)}>Users</Link>
          <Link to="/admin/products" onClick={() => setSidebarOpen(false)}>Products</Link>
          <Link to="/admin/orders" onClick={() => setSidebarOpen(false)}>Orders</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`admin-content ${sidebarOpen ? 'shifted' : 'full'}`}>
        <header className="admin-header">
          <span>Welcome, {user?.name}</span>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;