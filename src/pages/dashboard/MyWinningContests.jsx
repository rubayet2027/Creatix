import { useQuery } from '@tanstack/react-query';
import { paymentsAPI } from '../../api';
import { HiTrophy, HiCash, HiCalendar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const MyWinningContests = () => {
    const { data: contests = [], isLoading } = useQuery({
        queryKey: ['winning-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getWinnings();
            return response.data;
        },
    });

    const totalPrize = contests.reduce((sum, c) => sum + (c.prizeMoney || 0), 0);

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
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Winning Contests</h1>
                <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg text-sm font-medium flex items-center gap-2">
                    <HiTrophy className="w-4 h-4" />
                    {contests.length} Win{contests.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <HiCash className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-amber-100 text-sm font-medium">Total Prize Money Won</p>
                        <p className="text-4xl font-bold">${totalPrize.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {contests.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiTrophy className="w-8 h-8 text-amber-500" />
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
                    {contests.map((contest) => (
                        <div
                            key={contest._id}
                            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden"
                        >
                            <div className="relative h-40">
                                <img
                                    src={contest.image}
                                    alt={contest.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-2">
                                        <HiTrophy className="w-4 h-4" />
                                        Winner
                                    </span>
                                    <h3 className="text-white font-semibold text-lg">{contest.name}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                        <HiCalendar className="w-4 h-4" />
                                        <span className="text-sm">
                                            {new Date(contest.deadline).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">{contest.contestType}</span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)]">Prize Won</p>
                                        <p className="text-2xl font-bold text-emerald-500">${contest.prizeMoney?.toLocaleString()}</p>
                                    </div>
                                    <Link
                                        to={`/contest/${contest._id}`}
                                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWinningContests;
