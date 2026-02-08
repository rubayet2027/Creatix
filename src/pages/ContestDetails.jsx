import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { contestsAPI, paymentsAPI, submissionsAPI } from '../api';
import {
    HiCalendar,
    HiCash,
    HiUserGroup,
    HiClock,
    HiTrophy,
    HiCheckCircle,
    HiLockClosed,
    HiArrowLeft
} from 'react-icons/hi';
import Container from '../components/layout/Container';
import toast from 'react-hot-toast';

const ContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, dbUser } = useAuth();
    const queryClient = useQueryClient();
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isContestEnded, setIsContestEnded] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [taskSubmission, setTaskSubmission] = useState('');

    const { data: contest, isLoading } = useQuery({
        queryKey: ['contest', id],
        queryFn: async () => {
            const response = await contestsAPI.getById(id);
            return response.data;
        },
    });

    // Countdown timer
    useEffect(() => {
        if (!contest) return;

        const calculateCountdown = () => {
            const deadline = new Date(contest.deadline).getTime();
            const now = Date.now();
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

    // Register/Pay mutation
    const registerMutation = useMutation({
        mutationFn: async () => {
            // Create payment intent
            const intentResponse = await paymentsAPI.createIntent(id);
            const { testMode } = intentResponse.data;

            // For test mode, directly confirm
            if (testMode) {
                return await paymentsAPI.confirm({ contestId: id, testMode: true });
            }

            // For real payments, would integrate Stripe Elements here
            return await paymentsAPI.confirm({ contestId: id, testMode: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['contest', id]);
            toast.success('Successfully registered for contest!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });

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

    const handleRegister = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/contest/${id}` } } });
            return;
        }
        registerMutation.mutate();
    };

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

                        {/* Winner Section */}
                        {contest.winnerDeclared && contest.winner && (
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                                        {contest.winner.photo ? (
                                            <img src={contest.winner.photo} alt={contest.winner.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <HiTrophy className="w-8 h-8" />
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
                                    <p className="text-sm text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <HiClock className="w-4 h-4" />
                                        Time Remaining
                                    </p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {[
                                            { value: countdown.days, label: 'Days' },
                                            { value: countdown.hours, label: 'Hours' },
                                            { value: countdown.minutes, label: 'Mins' },
                                            { value: countdown.seconds, label: 'Secs' },
                                        ].map((item) => (
                                            <div key={item.label} className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                                                <p className="text-2xl font-bold text-[var(--text-primary)]">{item.value}</p>
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
                                    <div className="flex items-center gap-2 text-emerald-500 justify-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                        <HiCheckCircle className="w-5 h-5" />
                                        <span className="font-medium">You're registered!</span>
                                    </div>
                                    {!isContestEnded && (
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                                        >
                                            Submit Your Task
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    disabled={isContestEnded || registerMutation.isPending}
                                    className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {registerMutation.isPending ? 'Processing...' : `Register Now - $${contest.price}`}
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
        </div>
    );
};

export default ContestDetails;
