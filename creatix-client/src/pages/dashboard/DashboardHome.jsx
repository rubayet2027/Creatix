import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { paymentsAPI } from '../../api';
import { HiStar, HiCollection, HiCash, HiClock } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { dbUser } = useAuth();

    // Fetch participated contests
    const { data: participatedContests = [] } = useQuery({
        queryKey: ['participated-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getParticipated();
            return response.data;
        },
    });

    // Fetch winning contests
    const { data: winningContests = [] } = useQuery({
        queryKey: ['winning-contests'],
        queryFn: async () => {
            const response = await paymentsAPI.getWinnings();
            return response.data;
        },
    });

    const stats = [
        {
            label: 'Contests Participated',
            value: participatedContests.length || dbUser?.contestsParticipated || 0,
            icon: HiCollection,
            color: 'bg-blue-500',
        },
        {
            label: 'Contests Won',
            value: winningContests.length || dbUser?.contestsWon || 0,
            icon: HiStar,
            color: 'bg-amber-500',
        },
        {
            label: 'Total Prize Won',
            value: `$${winningContests.reduce((sum, c) => sum + (c.prizeMoney || 0), 0).toLocaleString()}`,
            icon: HiCash,
            color: 'bg-emerald-500',
        },
        {
            label: 'Win Rate',
            value: participatedContests.length > 0
                ? `${Math.round((winningContests.length / participatedContests.length) * 100)}%`
                : '0%',
            icon: HiClock,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {dbUser?.name || 'User'}! 👋
                </h1>
                <p className="text-primary-100">
                    Here's an overview of your contest journey on Creatix.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6"
                    >
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Recent Contests</h2>

                {participatedContests.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiCollection className="w-8 h-8 text-primary-500" />
                        </div>
                        <p className="text-[var(--text-secondary)] mb-4">You haven't participated in any contests yet.</p>
                        <Link
                            to="/all-contests"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            Explore Contests
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {participatedContests.slice(0, 5).map((contest) => (
                            <div
                                key={contest._id}
                                className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <img
                                    src={contest.image}
                                    alt={contest.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-[var(--text-primary)] truncate">{contest.name}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Prize: ${contest.prizeMoney?.toLocaleString()}
                                    </p>
                                </div>
                                {contest.winner && contest.winner._id === dbUser?._id && (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-sm font-medium rounded-full">
                                        Winner 🏆
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
