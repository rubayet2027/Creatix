import { createContext, useContext, useState, useCallback } from 'react';
import { PageTransition } from '../components/Loader';

const LoadingContext = createContext(null);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }) => {
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const startLoading = useCallback((message = '') => {
        setLoadingMessage(message);
        setIsPageLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsPageLoading(false);
        setLoadingMessage('');
    }, []);

    // For async operations with automatic loading state
    const withLoading = useCallback(async (asyncFn, message = '') => {
        startLoading(message);
        try {
            return await asyncFn();
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    const value = {
        isPageLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        withLoading,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            <PageTransition isLoading={isPageLoading} message={loadingMessage} />
        </LoadingContext.Provider>
    );
};

export default LoadingContext;
