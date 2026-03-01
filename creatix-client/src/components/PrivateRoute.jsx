import { Navigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
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

// Route wrapper that blocks demo accounts from performing real actions
export const NonDemoRoute = ({ children }) => {
    const { isAuthenticated, loading, authChecked, dbUser } = useAuth();
    const location = useLocation();

    if (loading || !authChecked) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const isDemoUser = dbUser?.email?.startsWith('demo_');
    if (isDemoUser) {
        Swal.fire({
            icon: 'warning',
            title: 'Action Restricted',
            text: 'Demo users cannot access this feature. Please sign up for a full account to continue.',
            confirmButtonText: 'Sign Up',
            confirmButtonColor: '#0ea5e9'
        });
        return <Navigate to="/register" replace />;
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
