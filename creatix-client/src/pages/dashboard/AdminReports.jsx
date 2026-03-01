import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '../../api';
import { HiChartBar, HiUsers, HiCollection, HiCurrencyDollar, HiTrendingUp, HiCalendar } from 'react-icons/hi';

const AdminReports = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await statsAPI.getAdmin();
            return response.data;
        },
    });

    const { data: platformStats } = useQuery({
        queryKey: ['platform-stats'],
        queryFn: async () => {
            const response = await statsAPI.getPlatform();
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports & Analytics</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton h-32 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    const reportCards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers || platformStats?.totalUsers || 0,
            icon: HiUsers,
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            label: 'Total Contests',
            value: stats?.totalContests || platformStats?.totalContests || 0,
            icon: HiCollection,
            color: 'bg-purple-500',
            change: '+8%',
        },
        {
            label: 'Active Contests',
            value: stats?.activeContests || platformStats?.activeContests || 0,
            icon: HiCalendar,
            color: 'bg-emerald-500',
            change: '+5%',
        },
        {
            label: 'Total Revenue',
            value: `$${(stats?.totalRevenue || platformStats?.totalPrizeMoney || 0).toLocaleString()}`,
            icon: HiCurrencyDollar,
            color: 'bg-amber-500',
            change: '+15%',
        },
        {
            label: 'Total Participants',
            value: stats?.totalParticipants || platformStats?.totalParticipants || 0,
            icon: HiTrendingUp,
            color: 'bg-rose-500',
            change: '+20%',
        },
        {
            label: 'Avg. Participation',
            value: stats?.totalContests > 0
                ? Math.round((stats?.totalParticipants || 0) / stats.totalContests)
                : 0,
            icon: HiChartBar,
            color: 'bg-indigo-500',
            change: '+3%',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Reports & Analytics</h1>
                <p className="text-[var(--text-secondary)]">Platform-wide performance metrics and insights</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                {card.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Contest Types Breakdown */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Contest Performance Overview</h2>
                <div className="overflow-x-auto">
                    <table className="table-base">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Current</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-medium">Completed Contests</td>
                                <td>{stats?.completedContests || 0}</td>
                                <td><span className="badge-success px-2 py-0.5 rounded-full text-xs">Active</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Pending Review</td>
                                <td>{stats?.pendingContests || 0}</td>
                                <td><span className="badge-warning px-2 py-0.5 rounded-full text-xs">Pending</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Total Submissions</td>
                                <td>{stats?.totalSubmissions || 0}</td>
                                <td><span className="badge-info px-2 py-0.5 rounded-full text-xs">Growing</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Creator Requests</td>
                                <td>{stats?.pendingCreatorRequests || 0}</td>
                                <td><span className="badge-warning px-2 py-0.5 rounded-full text-xs">Review Needed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
