
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/" replace />;
};

export default RoleRedirect;
