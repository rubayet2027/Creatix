import { useState, useEffect } from 'react';

// Main page loader with animated logo
export const PageLoader = ({ fullScreen = true }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'absolute inset-0'
                } bg-[var(--bg-primary)] flex flex-col items-center justify-center`}
        >
            {/* Animated Logo */}
            <div className="relative mb-8">
                {/* Outer ring */}
                <div className="w-24 h-24 rounded-full border-4 border-primary-200 dark:border-primary-900/50 animate-pulse" />

                {/* Spinning ring */}
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />

                {/* Logo center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-bounce-slow">
                        <span className="text-white font-bold text-2xl">C</span>
                    </div>
                </div>
            </div>

            {/* Brand name with loading text */}
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
                    Creatix
                </h2>
                <p className="text-[var(--text-secondary)] text-sm min-w-[100px]">
                    Loading{dots}
                </p>
            </div>

            {/* Progress bar */}
            <div className="mt-8 w-48 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full animate-loading-bar" />
            </div>
        </div>
    );
};

// Small inline spinner
export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
        xl: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`}
        />
    );
};

// Skeleton loader for content
export const Skeleton = ({ className = '', variant = 'text' }) => {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-8 rounded',
        avatar: 'w-12 h-12 rounded-full',
        card: 'h-48 rounded-xl',
        image: 'aspect-video rounded-xl',
    };

    return (
        <div
            className={`bg-[var(--bg-tertiary)] animate-pulse ${variants[variant]} ${className}`}
        />
    );
};

// Content loader with multiple skeletons
export const ContentLoader = ({ lines = 3, showAvatar = false, showImage = false }) => {
    return (
        <div className="space-y-4">
            {showImage && <Skeleton variant="image" />}
            <div className="flex items-start gap-4">
                {showAvatar && <Skeleton variant="avatar" />}
                <div className="flex-1 space-y-3">
                    <Skeleton variant="title" className="w-3/4" />
                    {Array.from({ length: lines }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className={i === lines - 1 ? 'w-1/2' : 'w-full'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Card skeleton loader
export const CardSkeleton = () => {
    return (
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-4 space-y-4">
            <Skeleton variant="image" />
            <div className="space-y-3">
                <Skeleton variant="title" className="w-3/4" />
                <Skeleton className="w-full" />
                <Skeleton className="w-2/3" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
        </div>
    );
};

// Page transition overlay
export const PageTransition = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9998] bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900/50" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
