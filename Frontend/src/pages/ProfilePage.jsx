// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <Link to="/change-password" className="change-password-link">Change Password</Link>
        </div>

        <div className="orders-section">
          <h3>My Orders</h3>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;