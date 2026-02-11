import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

// Home route - shows home for guests, redirects to dashboard for authenticated users
export const HomeRoute = ({ children }) => {
    const { isAuthenticated, loading, authChecked } = useAuth();

    // Show loading while checking auth state
    if (loading || !authChecked) {
        return <PageLoader />;
    }

    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default HomeRoute;
