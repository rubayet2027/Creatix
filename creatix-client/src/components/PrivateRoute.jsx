import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

// Protected route - requires authentication
export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading, authChecked } = useAuth();
    const location = useLocation();

    // Show loading while checking auth state
    if (loading || !authChecked) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Creator route - requires creator or admin role
export const CreatorRoute = ({ children }) => {
    const { isAuthenticated, isCreator, loading, authChecked, dbUser } = useAuth();
    const location = useLocation();

    if (loading || !authChecked) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role from database user - never trust frontend cache for security
    if (!isCreator || !dbUser || (dbUser.role !== 'creator' && dbUser.role !== 'admin')) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Admin route - requires admin role
export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading, authChecked, dbUser } = useAuth();
    const location = useLocation();

    if (loading || !authChecked) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role from database user - never trust frontend cache for security
    if (!isAdmin || !dbUser || dbUser.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Public only route - redirects authenticated users
export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading, authChecked } = useAuth();
    const location = useLocation();

    if (loading || !authChecked) {
        return <PageLoader />;
    }

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    return children;
};

export default PrivateRoute;
