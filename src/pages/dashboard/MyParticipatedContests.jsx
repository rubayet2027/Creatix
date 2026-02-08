import { useQuery } from '@tanstack/react-query';
import { paymentsAPI } from '../../api';
import { HiClock, HiCash, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const MyParticipatedContests = () => {
    const { data: contests = [], isLoading } = useQuery({
        queryKey: ['participated-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getParticipated();
            return response.data;
        },
    });

    // Sort by deadline (upcoming first)
    const sortedContests = [...contests].sort((a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    );

    const isContestEnded = (deadline) => new Date(deadline) < new Date();

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
                <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg text-sm font-medium">
                    {contests.length} Contest{contests.length !== 1 ? 's' : ''}
                </span>
            </div>

            {sortedContests.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedContests.map((contest) => (
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
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${isContestEnded(contest.deadline) ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                                                {new Date(contest.deadline).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isContestEnded(contest.deadline) ? (
                                                contest.winner ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 text-sm rounded-full">
                                                        <HiCheckCircle className="w-4 h-4" />
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                                                        <HiXCircle className="w-4 h-4" />
                                                        Ended
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-sm rounded-full">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyParticipatedContests;
