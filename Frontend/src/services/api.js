// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if backend runs on different port
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getProfile = () => API.get('/auth/profile');
export const changePassword = (passwords) => API.put('/auth/change-password', passwords);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

// Product endpoints
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getRelatedProducts = (id) => API.get(`/products/${id}/related`);
export const getFilterOptions = () => API.get('/products/filters');

// Cart endpoints (protected)
export const getCart = () => API.get('/cart');
export const addToCart = (item) => API.post('/cart/add', item);
export const updateCartItem = (itemId, quantity) => API.put('/cart/update', { itemId, quantity });
export const removeCartItem = (itemId) => API.delete(`/cart/remove/${itemId}`);
export const clearCart = () => API.delete('/cart/clear');

// Order endpoints (protected)
export const createOrder = (orderData) => API.post('/orders/create', orderData);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);


// Admin endpoints
export const getDashboardStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');


// Product admin endpoints
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
// Order admin endpoints
export const getAllOrders = () => API.get('/orders/admin/all');
export const updateOrderStatus = (orderId, status) => 
  API.put(`/orders/admin/${orderId}/status`, { orderStatus: status });

export default API;