import { Link } from 'react-router-dom';
import { HiViewGrid, HiTrophy, HiPlus, HiCog, HiUser, HiLogout } from 'react-icons/hi';

const Dashboard = () => {
  // Simulated user data (UI only)
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinedContests: 8,
    wins: 3,
    points: 4580,
  };

  const recentContests = [
    { id: 1, name: 'Logo Design Challenge', status: 'active', position: 2 },
    { id: 2, name: 'Photography Contest', status: 'completed', position: 1 },
    { id: 3, name: 'UI/UX Design Sprint', status: 'completed', position: 5 },
  ];

  const sidebarLinks = [
    { icon: HiViewGrid, label: 'Overview', active: true },
    { icon: HiTrophy, label: 'My Contests', active: false },
    { icon: HiPlus, label: 'Join Contest', active: false },
    { icon: HiUser, label: 'Profile', active: false },
    { icon: HiCog, label: 'Settings', active: false },
  ];

  return (
    <div className="pt-20 min-h-screen bg-[var(--bg-secondary)]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-5rem)] bg-[var(--bg-primary)] border-r border-[var(--border-color)] p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[var(--border-color)]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  link.active
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-8">
            <HiLogout className="w-5 h-5" />
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-[var(--text-secondary)]">
                Here&apos;s an overview of your contest activity
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Total Points</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {user.points.toLocaleString()}
                </p>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Contests Joined</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">{user.joinedContests}</p>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Total Wins</p>
                <p className="text-3xl font-bold text-accent-emerald">{user.wins}</p>
              </div>
            </div>

            {/* Recent Contests */}
            <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
              <div className="p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Contests</h2>
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {recentContests.map((contest) => (
                  <div key={contest.id} className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">{contest.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Position: #{contest.position}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contest.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
                      }`}
                    >
                      {contest.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--border-color)]">
                <Link
                  to="/all-contests"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Contests →
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
