// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import '../../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getAllOrders();
      console.log('Loaded orders:', data.orders); // Debug log
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      loadOrders(); // Refresh the list
    } catch (err) {
      console.error('Status update error:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-orders">
      <h2>Orders</h2>
      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id?.slice(-8) || 'N/A'}</td>
                  <td>{order.user?.name || order.shippingAddress?.name || 'N/A'}</td>
                  <td>₹{order.totalPrice?.toLocaleString() || 0}</td>
                  <td>{order.isPaid ? 'Yes' : 'No'}</td>
                  <td>{order.status || (order.isDelivered ? 'Delivered' : 'Processing')}</td>
                  <td>
                    <select 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)} 
                      defaultValue={order.status || (order.isDelivered ? 'delivered' : 'processing')}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;