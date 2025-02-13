import { Navigate } from 'react-router-dom';
import { useAuth } from './auth_context';

function ProtectedRoute({ children, role }) {
    const { user, isAuthenticated, loading } = useAuth();

console.log('ProtectedRoute context:', { user, isAuthenticated, loading });

if (loading) {
    return <div>Loading...</div>; // Prevent premature redirection
}

    if (!isAuthenticated) {
        return <Navigate to="/register" />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}


export default ProtectedRoute;
