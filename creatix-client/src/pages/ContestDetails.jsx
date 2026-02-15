import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { contestsAPI, paymentsAPI, submissionsAPI } from '../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    HiCalendar,
    HiCash,
    HiUserGroup,
    HiClock,
    HiStar,
    HiCheckCircle,
    HiLockClosed,
    HiArrowLeft,
    HiX,
    HiChevronLeft,
    HiChevronRight,
    HiBadgeCheck
} from 'react-icons/hi';
import Container from '../components/layout/Container';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

// Payment Form Component
const PaymentForm = ({ contest, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError('');

        try {
            // Create payment intent
            const intentResponse = await paymentsAPI.createIntent(contest._id);
            const { clientSecret, testMode } = intentResponse.data;

            if (testMode) {
                // Test mode - skip actual payment
                await paymentsAPI.confirm({ contestId: contest._id, testMode: true });
                onSuccess();
                return;
            }

            // Process actual payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                await paymentsAPI.confirm({ contestId: contest._id, paymentIntentId: paymentIntent.id });
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : `Pay $${contest.price}`}
                </button>
            </div>
        </form>
    );
};

const ContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, dbUser } = useAuth();
    const queryClient = useQueryClient();
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isContestEnded, setIsContestEnded] = useState(false);
    const [isContestUpcoming, setIsContestUpcoming] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [taskSubmission, setTaskSubmission] = useState('');
    const [leaderboardPage, setLeaderboardPage] = useState(1);

    const { data: contest, isLoading } = useQuery({
        queryKey: ['contest', id],
        queryFn: async () => {
            const response = await contestsAPI.getById(id);
            return response.data;
        },
    });

    // Fetch leaderboard with pagination
    const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
        queryKey: ['contest-leaderboard', id, leaderboardPage],
        queryFn: async () => {
            const response = await contestsAPI.getLeaderboard(id, { page: leaderboardPage, limit: 10 });
            return response.data;
        },
        enabled: !!id,
    });

    // Countdown timer
    useEffect(() => {
        if (!contest) return;

        const calculateCountdown = () => {
            const now = Date.now();
            const startDate = contest.startDate ? new Date(contest.startDate).getTime() : null;
            const deadline = new Date(contest.deadline).getTime();

            // Check if contest hasn't started yet
            if (startDate && startDate > now) {
                setIsContestUpcoming(true);
                setIsContestEnded(false);
                const difference = startDate - now;
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
                return;
            }

            setIsContestUpcoming(false);
            const difference = deadline - now;

            if (difference <= 0) {
                setIsContestEnded(true);
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setIsContestEnded(false);
            setCountdown({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);
        return () => clearInterval(interval);
    }, [contest]);

    const isParticipant = contest?.participants?.some(p => p._id === dbUser?._id);

    // Handle successful payment
    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        queryClient.invalidateQueries(['contest', id]);
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'You have successfully joined the contest. Good luck!',
            confirmButtonColor: '#6366f1',
        });
    };

    // Handle register click with SweetAlert confirmation
    const handleRegister = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/contest/${id}` } } });
            return;
        }

        const result = await Swal.fire({
            title: 'Join Contest?',
            html: `
                <div style="text-align: left; padding: 10px 0;">
                    <p style="margin-bottom: 10px;"><strong>Contest:</strong> ${contest.name}</p>
                    <p style="margin-bottom: 10px;"><strong>Entry Fee:</strong> $${contest.price}</p>
                    <p style="margin-bottom: 10px;"><strong>Prize Money:</strong> $${contest.prizeMoney?.toLocaleString()}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">You will be redirected to the payment page after confirmation.</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Register!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            setShowPaymentModal(true);
        }
    };

    // Submit task mutation
    const submitMutation = useMutation({
        mutationFn: () => submissionsAPI.submit({ contestId: id, taskSubmission }),
        onSuccess: () => {
            setShowSubmitModal(false);
            setTaskSubmission('');
            toast.success('Task submitted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Submission failed');
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!contest) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Contest Not Found</h2>
                    <Link to="/all-contests" className="text-primary-500 hover:text-primary-600">
                        Browse All Contests
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8">
            <Container>
                {/* Back Button */}
                <Link
                    to="/all-contests"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Contests
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="relative rounded-2xl overflow-hidden">
                            <img
                                src={contest.image}
                                alt={contest.name}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full mb-3">
                                    {contest.contestType}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{contest.name}</h1>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Description</h2>
                            <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{contest.description}</p>
                        </div>

                        {/* Task Instructions */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Task Instructions</h2>
                            <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{contest.taskInstruction}</p>
                        </div>

                        {/* Leaderboard / Participants */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                    <HiUserGroup className="w-5 h-5 text-purple-500" />
                                    Participants
                                </h2>
                                {leaderboardData?.pagination && (
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        {leaderboardData.pagination.total} total
                                    </span>
                                )}
                            </div>

                            {leaderboardLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                </div>
                            ) : leaderboardData?.participants?.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {leaderboardData.participants.map((participant, index) => (
                                            <div
                                                key={participant._id}
                                                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                                                    participant.isWinner
                                                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                                                        : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg">
                                                        {(leaderboardPage - 1) * 10 + index + 1}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                                        {participant.photo ? (
                                                            <img src={participant.photo} alt={participant.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            participant.name?.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-[var(--text-primary)]">{participant.name}</span>
                                                            {participant.isWinner && (
                                                                <span className="px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full flex items-center gap-1">
                                                                    <HiStar className="w-3 h-3" /> Winner
                                                                </span>
                                                            )}
                                                        </div>
                                                        {participant.submissionDate && (
                                                            <span className="text-xs text-[var(--text-secondary)]">
                                                                Submitted {new Date(participant.submissionDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* Only show submission status for ongoing/ended contests, not upcoming */}
                                                    {!isContestUpcoming && (
                                                        participant.hasSubmitted ? (
                                                            <span className="flex items-center gap-1 text-emerald-500 text-sm">
                                                                <HiBadgeCheck className="w-5 h-5" />
                                                                <span className="hidden sm:inline">Submitted</span>
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[var(--text-secondary)] text-sm">
                                                                <HiClock className="w-4 h-4" />
                                                                <span className="hidden sm:inline">Pending</span>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {leaderboardData.pagination?.pages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
                                            <button
                                                onClick={() => setLeaderboardPage(p => Math.max(1, p - 1))}
                                                disabled={leaderboardPage === 1}
                                                className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-primary)] transition-colors"
                                            >
                                                <HiChevronLeft className="w-5 h-5" />
                                            </button>
                                            <span className="text-sm text-[var(--text-secondary)] px-3">
                                                Page {leaderboardPage} of {leaderboardData.pagination.pages}
                                            </span>
                                            <button
                                                onClick={() => setLeaderboardPage(p => Math.min(leaderboardData.pagination.pages, p + 1))}
                                                disabled={leaderboardPage === leaderboardData.pagination.pages}
                                                className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-primary)] transition-colors"
                                            >
                                                <HiChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <HiUserGroup className="w-12 h-12 mx-auto text-[var(--text-secondary)] opacity-50 mb-2" />
                                    <p className="text-[var(--text-secondary)]">No participants yet</p>
                                    <p className="text-sm text-[var(--text-secondary)] opacity-75">Be the first to join!</p>
                                </div>
                            )}
                        </div>

                        {/* Winner Section */}
                        {contest.winnerDeclared && contest.winner && (
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                                        {contest.winner.photo ? (
                                            <img src={contest.winner.photo} alt={contest.winner.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <HiStar className="w-8 h-8" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-amber-100 text-sm">Winner 🏆</p>
                                        <p className="text-2xl font-bold">{contest.winner.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Countdown / Status */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                            {isContestEnded ? (
                                <div className="text-center">
                                    <HiLockClosed className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-xl font-bold text-[var(--text-primary)]">Contest Ended</p>
                                    <p className="text-[var(--text-secondary)] text-sm">Registration is closed</p>
                                </div>
                            ) : (
                                <>
                                    <p className={`text-sm mb-3 flex items-center gap-2 ${isContestUpcoming ? 'text-blue-500' : 'text-[var(--text-secondary)]'}`}>
                                        <HiClock className="w-4 h-4" />
                                        {isContestUpcoming ? 'Starts In' : 'Time Remaining'}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {[
                                            { value: countdown.days, label: 'Days' },
                                            { value: countdown.hours, label: 'Hours' },
                                            { value: countdown.minutes, label: 'Mins' },
                                            { value: countdown.seconds, label: 'Secs' },
                                        ].map((item) => (
                                            <div key={item.label} className={`rounded-lg p-3 ${isContestUpcoming ? 'bg-blue-500/10' : 'bg-[var(--bg-tertiary)]'}`}>
                                                <p className={`text-2xl font-bold ${isContestUpcoming ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-primary)]'}`}>{item.value}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Contest Info */}
                        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                    <HiCash className="w-5 h-5 text-emerald-500" />
                                    Prize Money
                                </span>
                                <span className="text-xl font-bold text-emerald-500">${contest.prizeMoney?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                    <HiCash className="w-5 h-5 text-blue-500" />
                                    Entry Fee
                                </span>
                                <span className="text-xl font-bold text-[var(--text-primary)]">${contest.price?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                    <HiUserGroup className="w-5 h-5 text-purple-500" />
                                    Participants
                                </span>
                                <span className="text-xl font-bold text-[var(--text-primary)]">{contest.participantsCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                    <HiCalendar className="w-5 h-5" />
                                    Deadline
                                </span>
                                <span className="text-sm text-[var(--text-primary)]">
                                    {new Date(contest.deadline).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {isParticipant ? (
                                <>
                                    <div className="flex items-center gap-2 text-emerald-500 justify-center p-3 bg-emerald-500/10 rounded-xl">
                                        <HiCheckCircle className="w-5 h-5" />
                                        <span className="font-medium">You're registered!</span>
                                    </div>
                                    {!isContestEnded && !isContestUpcoming && (
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                                        >
                                            Submit Your Task
                                        </button>
                                    )}
                                    {isContestUpcoming && (
                                        <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                                            <p className="text-blue-600 dark:text-blue-400 text-sm">Contest hasn't started yet</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    disabled={isContestEnded}
                                    className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {`Register Now - $${contest.price}`}
                                </button>
                            )}
                        </div>

                        {/* Creator Info */}
                        {contest.creator && (
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                                <p className="text-sm text-[var(--text-secondary)] mb-3">Contest Creator</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                        {contest.creator.photo ? (
                                            <img src={contest.creator.photo} alt={contest.creator.name} className="w-full h-full object-cover" />
                                        ) : (
                                            contest.creator.name?.charAt(0)
                                        )}
                                    </div>
                                    <span className="font-medium text-[var(--text-primary)]">{contest.creator.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Submit Your Task</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Provide links to your work or any required submission details below.
                        </p>
                        <textarea
                            value={taskSubmission}
                            onChange={(e) => setTaskSubmission(e.target.value)}
                            rows={5}
                            placeholder="Enter your submission links or details here..."
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="px-6 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => submitMutation.mutate()}
                                disabled={!taskSubmission.trim() || submitMutation.isPending}
                                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Complete Payment</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)]"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-[var(--text-secondary)]">Contest</span>
                                <span className="text-[var(--text-primary)] font-medium">{contest.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Entry Fee</span>
                                <span className="text-lg font-bold text-primary-500">${contest.price}</span>
                            </div>
                        </div>
                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                contest={contest}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setShowPaymentModal(false)}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestDetails;
