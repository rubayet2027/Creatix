import { useQuery } from '@tanstack/react-query';
import { paymentsAPI } from '../../api';
import { HiClock, HiCash, HiCheckCircle, HiTrendingUp, HiStar, HiChartBar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const MyParticipatedContests = () => {
    const { data: contests = [], isLoading } = useQuery({
        queryKey: ['participated-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getParticipated();
            return response.data;
        },
    });

    // Calculate stats
    const totalContests = contests.length;
    const completedContests = contests.filter(c => c.status === 'completed' || new Date(c.deadline) < new Date()).length;
    const wins = contests.filter(c => c.userSubmission?.isWinner).length;
    const winRate = completedContests > 0 ? ((wins / completedContests) * 100).toFixed(1) : 0;
    const totalPrizeWon = contests.reduce((sum, c) => sum + (c.userSubmission?.prizeAmount || 0), 0);

    // Sort by deadline (most recent first)
    const sortedContests = [...contests].sort((a, b) =>
        new Date(b.deadline) - new Date(a.deadline)
    );

    const isContestEnded = (contest) => contest.status === 'completed' || new Date(contest.deadline) < new Date();

    const getRankBadge = (submission) => {
        if (!submission) return null;
        if (submission.rank === 1) return { icon: '🥇', text: '1st Place', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
        if (submission.rank === 2) return { icon: '🥈', text: '2nd Place', color: 'bg-gray-500/10 text-gray-500 dark:text-gray-400' };
        if (submission.rank === 3) return { icon: '🥉', text: '3rd Place', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
        return null;
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
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Participated Contests</h1>
                <span className="px-4 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium">
                    {contests.length} Contest{contests.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <HiChartBar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{totalContests}</p>
                            <p className="text-xs text-[var(--text-secondary)]">Total Contests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <HiStar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{wins}</p>
                            <p className="text-xs text-[var(--text-secondary)]">Contests Won</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <HiTrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{winRate}%</p>
                            <p className="text-xs text-[var(--text-secondary)]">Win Rate</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <HiCash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">${totalPrizeWon.toLocaleString()}</p>
                            <p className="text-xs text-[var(--text-secondary)]">Total Won</p>
                        </div>
                    </div>
                </div>
            </div>

            {sortedContests.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiClock className="w-8 h-8 text-primary-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Contests Yet</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Start your creative journey by joining a contest!</p>
                    <Link
                        to="/all-contests"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Browse Contests
                    </Link>
                </div>
            ) : (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Contest</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Prize</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Deadline</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Rank</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedContests.map((contest) => {
                                    const rankBadge = getRankBadge(contest.userSubmission);
                                    const ended = isContestEnded(contest);
                                    
                                    return (
                                        <tr key={contest._id} className="border-b border-[var(--border-color)] last:border-0">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={contest.image}
                                                        alt={contest.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-[var(--text-primary)]">{contest.name}</p>
                                                        <p className="text-sm text-[var(--text-secondary)]">{contest.contestType}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                                                    <HiCash className="w-4 h-4 text-emerald-500" />
                                                    ${contest.prizeMoney?.toLocaleString()}
                                                </div>
                                                {contest.userSubmission?.prizeAmount > 0 && (
                                                    <p className="text-xs text-emerald-500 font-medium mt-1">
                                                        Won: ${contest.userSubmission.prizeAmount.toLocaleString()}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm ${ended ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                                                    {new Date(contest.deadline).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ended && rankBadge ? (
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 ${rankBadge.color} text-sm rounded-full font-medium`}>
                                                        <span>{rankBadge.icon}</span>
                                                        {rankBadge.text}
                                                    </span>
                                                ) : ended ? (
                                                    <span className="text-sm text-[var(--text-secondary)]">Participated</span>
                                                ) : (
                                                    <span className="text-sm text-[var(--text-secondary)]">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {ended ? (
                                                    contest.status === 'completed' || contest.winners?.length > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-full">
                                                            <HiCheckCircle className="w-4 h-4" />
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm rounded-full">
                                                            <HiClock className="w-4 h-4" />
                                                            Judging
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                                                        <HiClock className="w-4 h-4" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/contest/${contest._id}`}
                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyParticipatedContests;
