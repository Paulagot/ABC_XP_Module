// protected_route.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth_context';

function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;