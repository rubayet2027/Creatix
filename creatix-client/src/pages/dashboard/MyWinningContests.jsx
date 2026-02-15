import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsAPI } from '../../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { HiStar, HiCash, HiCalendar, HiCreditCard, HiCurrencyDollar, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Withdraw Form Component with Stripe CardElement
const WithdrawForm = ({ amount, balance, onSuccess, onCancel }) => {
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
            // First, verify card by creating a payment method
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (stripeError) {
                setError(stripeError.message);
                setIsProcessing(false);
                return;
            }

            // Process withdrawal with verified card
            const response = await paymentsAPI.withdraw(amount, 'stripe', {
                paymentMethodId: paymentMethod.id,
            });
            
            onSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Withdrawal failed');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                    <span className="text-[var(--text-secondary)]">Withdrawal Amount</span>
                    <span className="text-lg font-bold text-primary-500">${amount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Remaining Balance</span>
                    <span className="text-[var(--text-primary)] font-medium">${(balance - amount).toLocaleString()}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Card Details (for verification)
                </label>
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
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Your card is used for identity verification. Funds will be transferred via Stripe.
                </p>
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
                    {isProcessing ? 'Processing...' : `Withdraw $${amount}`}
                </button>
            </div>
        </form>
    );
};

const MyWinningContests = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showStripeForm, setShowStripeForm] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['winning-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getWinnings();
            return response.data;
        },
    });

    const winnings = data?.winnings || [];
    const summary = data?.summary || { totalWinnings: 0, balance: 0, totalEarnings: 0, contestsWon: 0 };

    const handleWithdrawClick = async () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount < 10) {
            toast.error('Minimum withdrawal is $10');
            return;
        }
        if (amount > summary.balance) {
            toast.error('Insufficient balance');
            return;
        }

        const result = await Swal.fire({
            title: 'Withdraw Funds?',
            html: `
                <div style="text-align: left; padding: 10px 0;">
                    <p style="margin-bottom: 10px;"><strong>Amount:</strong> $${amount.toLocaleString()}</p>
                    <p style="margin-bottom: 10px;"><strong>Available Balance:</strong> $${summary.balance.toLocaleString()}</p>
                    <p style="margin-bottom: 10px;"><strong>After Withdrawal:</strong> $${(summary.balance - amount).toLocaleString()}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">You will be redirected to enter card details for verification.</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Continue to Verification',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            setShowStripeForm(true);
        }
    };

    const handleWithdrawSuccess = (data) => {
        setShowWithdrawModal(false);
        setShowStripeForm(false);
        const amount = withdrawAmount;
        setWithdrawAmount('');
        queryClient.invalidateQueries(['winning-contests']);
        
        Swal.fire({
            icon: 'success',
            title: 'Withdrawal Successful!',
            html: `<p>Your withdrawal of <strong>$${amount}</strong> has been processed.</p><p class="text-sm text-gray-500 mt-2">New balance: $${data.newBalance}</p>`,
            confirmButtonColor: '#6366f1',
        });
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return { icon: '🥇', text: '1st Place', color: 'bg-amber-500' };
        if (rank === 2) return { icon: '🥈', text: '2nd Place', color: 'bg-gray-400' };
        if (rank === 3) return { icon: '🥉', text: '3rd Place', color: 'bg-orange-500' };
        return { icon: '🏆', text: 'Winner', color: 'bg-amber-500' };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Winnings</h1>
                <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg text-sm font-medium flex items-center gap-2">
                    <HiStar className="w-4 h-4" />
                    {summary.contestsWon} Win{summary.contestsWon !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <HiCash className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">Total Earnings</p>
                            <p className="text-3xl font-bold">${summary.totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <HiCurrencyDollar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-amber-100 text-sm font-medium">Available Balance</p>
                            <p className="text-3xl font-bold">${summary.balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col justify-center">
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        disabled={summary.balance < 10}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiCreditCard className="w-5 h-5" />
                        Withdraw Funds
                    </button>
                    <p className="text-xs text-[var(--text-secondary)] text-center mt-2">
                        Minimum withdrawal: $10
                    </p>
                </div>
            </div>

            {winnings.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiStar className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Wins Yet</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Keep participating and your first victory is just around the corner!</p>
                    <Link
                        to="/all-contests"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Find Contests
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {winnings.map((winning) => {
                        const rankBadge = getRankBadge(winning.rank);
                        const contest = winning.contest;
                        
                        return (
                            <div
                                key={winning._id}
                                className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden"
                            >
                                <div className="relative h-40">
                                    <img
                                        src={contest?.image || 'https://via.placeholder.com/400x200'}
                                        alt={contest?.name || 'Contest'}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 ${rankBadge.color} text-white text-sm font-medium rounded-full mb-2`}>
                                            <span>{rankBadge.icon}</span>
                                            {rankBadge.text}
                                        </span>
                                        <h3 className="text-white font-semibold text-lg">{contest?.name || 'Contest'}</h3>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                            <HiCalendar className="w-4 h-4" />
                                            <span className="text-sm">
                                                {new Date(winning.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)]">{contest?.contestType}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                        <div>
                                            <p className="text-sm text-[var(--text-secondary)]">Prize Won</p>
                                            <p className="text-2xl font-bold text-emerald-500">${winning.prizeAmount?.toLocaleString() || 0}</p>
                                        </div>
                                        {contest && (
                                            <Link
                                                to={`/contest/${contest._id}`}
                                                className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                {showStripeForm ? 'Complete Withdrawal' : 'Withdraw Funds'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowWithdrawModal(false);
                                    setShowStripeForm(false);
                                    setWithdrawAmount('');
                                }}
                                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                            >
                                <HiX className="w-5 h-5 text-[var(--text-secondary)]" />
                            </button>
                        </div>
                        
                        {!showStripeForm ? (
                            <div className="space-y-4">
                                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                                    <p className="text-sm text-[var(--text-secondary)] mb-1">Available Balance</p>
                                    <p className="text-3xl font-bold text-emerald-500">${summary.balance.toLocaleString()}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Withdrawal Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                                        <input
                                            type="number"
                                            min="10"
                                            max={summary.balance}
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full pl-8 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-[var(--text-primary)]"
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Minimum: $10</p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="flex-1 px-4 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleWithdrawClick}
                                        disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10}
                                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Elements stripe={stripePromise}>
                                <WithdrawForm
                                    amount={parseFloat(withdrawAmount)}
                                    balance={summary.balance}
                                    onSuccess={handleWithdrawSuccess}
                                    onCancel={() => setShowStripeForm(false)}
                                />
                            </Elements>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyWinningContests;
