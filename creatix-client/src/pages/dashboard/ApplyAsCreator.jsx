import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiLightBulb, HiChartBar, HiCurrencyDollar, HiUserGroup, HiCheckCircle, HiClock, HiXCircle, HiPencil, HiCollection, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ApplyAsCreator = () => {
    const { dbUser, requestCreatorRole, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const benefits = [
        {
            icon: HiPencil,
            title: 'Create Contests',
            description: 'Design and host your own creative contests with custom rules and prizes.',
        },
        {
            icon: HiUserGroup,
            title: 'Build Community',
            description: 'Attract participants and build a following of talented creative individuals.',
        },
        {
            icon: HiCurrencyDollar,
            title: 'Set Prize Money',
            description: 'Define your own prize pools and registration fees for your contests.',
        },
        {
            icon: HiChartBar,
            title: 'Track Performance',
            description: 'Access detailed analytics on participation, submissions, and engagement.',
        },
        {
            icon: HiCollection,
            title: 'Manage Submissions',
            description: 'Review and evaluate submissions with our intuitive management tools.',
        },
        {
            icon: HiStar,
            title: 'Declare Winners',
            description: 'Select and announce winners with just a few clicks.',
        },
    ];

    const handleApply = async () => {
        if (!dbUser) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            await requestCreatorRole();
            await refreshUser();
            toast.success('Your creator application has been submitted!');
        } catch (error) {
            // Error toast is handled in AuthContext
            console.error('Failed to apply:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Check creator status
    const isCreator = dbUser?.role === 'creator' || dbUser?.role === 'admin';
    const isPending = dbUser?.creatorStatus === 'pending';
    const isRejected = dbUser?.creatorStatus === 'rejected';

    const renderStatus = () => {
        if (isCreator) {
            return (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        You're Already a Creator!
                    </h2>
                    <p className="text-emerald-600 dark:text-emerald-300 mb-6">
                        You have full access to create and manage contests on Creatix.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/add-contest')}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Create a Contest
                    </button>
                </div>
            );
        }

        if (isPending) {
            return (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiClock className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                        Application Pending
                    </h2>
                    <p className="text-amber-600 dark:text-amber-300 mb-2">
                        Your creator application is currently under review.
                    </p>
                    <p className="text-sm text-amber-500 dark:text-amber-400">
                        This usually takes 1-2 business days. We'll notify you once a decision is made.
                    </p>
                </div>
            );
        }

        if (isRejected) {
            return (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                        Application Not Approved
                    </h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">
                        Unfortunately, your previous application was not approved.
                    </p>
                    <button
                        onClick={handleApply}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Apply Again'}
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiLightBulb className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Ready to Create?
                </h2>
                <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                    Apply to become a contest creator and start hosting your own creative challenges on Creatix.
                </p>
                <button
                    onClick={handleApply}
                    disabled={isLoading}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        <>
                            <HiPencil className="w-5 h-5" />
                            Apply as Creator
                        </>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Become a Creator
                </h1>
                <p className="text-primary-100">
                    Host contests, engage with participants, and build your creative community.
                </p>
            </div>

            {/* Status Card */}
            {renderStatus()}

            {/* Benefits Section */}
            {!isCreator && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 md:p-8">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                        Creator Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="flex gap-4 p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <benefit.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                                        {benefit.title}
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            {!isCreator && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 md:p-8">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                How long does approval take?
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Most applications are reviewed within 1-2 business days. You'll receive a notification once your application is processed.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                What are the requirements?
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                                You need a verified account in good standing. We review applications based on account activity and community guidelines compliance.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                Can I still participate in contests?
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Absolutely! Becoming a creator doesn't restrict you from participating in other contests on the platform.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyAsCreator;
