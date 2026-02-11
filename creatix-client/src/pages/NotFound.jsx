import { Link } from 'react-router-dom';
import { HiHome, HiArrowLeft } from 'react-icons/hi';
import Container from '../components/layout/Container';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
            <Container>
                <div className="text-center max-w-lg mx-auto">
                    {/* 404 Number */}
                    <div className="relative mb-8">
                        <span className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent leading-none">
                            404
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-700/20 blur-3xl -z-10" />
                    </div>

                    {/* Message */}
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                        >
                            <HiHome className="w-5 h-5" />
                            Go to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors font-medium border border-[var(--border-color)]"
                        >
                            <HiArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Popular pages:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link to="/all-contests" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                                All Contests
                            </Link>
                            <span className="text-[var(--border-color)]">•</span>
                            <Link to="/leaderboard" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                                Leaderboard
                            </Link>
                            <span className="text-[var(--border-color)]">•</span>
                            <Link to="/dashboard" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default NotFound;
