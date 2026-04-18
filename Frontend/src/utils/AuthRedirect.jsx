// src/utils/AuthRedirect.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If already logged in, redirect to home page (or any protected page)
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRedirect;