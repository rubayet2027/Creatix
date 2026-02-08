import { HiTrophy, HiStar, HiSparkles } from 'react-icons/hi2';

const Leaderboard = () => {
  // Static leaderboard data (UI only)
  const leaders = [
    { rank: 1, name: 'Alex Thompson', points: 15420, wins: 12, avatar: null },
    { rank: 2, name: 'Sarah Chen', points: 14850, wins: 10, avatar: null },
    { rank: 3, name: 'Mike Rodriguez', points: 13200, wins: 9, avatar: null },
    { rank: 4, name: 'Emma Wilson', points: 11800, wins: 8, avatar: null },
    { rank: 5, name: 'James Park', points: 10500, wins: 7, avatar: null },
    { rank: 6, name: 'Lisa Anderson', points: 9800, wins: 6, avatar: null },
    { rank: 7, name: 'David Kim', points: 8900, wins: 5, avatar: null },
    { rank: 8, name: 'Anna Martinez', points: 8200, wins: 5, avatar: null },
    { rank: 9, name: 'Chris Brown', points: 7600, wins: 4, avatar: null },
    { rank: 10, name: 'Sophie Taylor', points: 7100, wins: 4, avatar: null },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return <HiTrophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <HiStar className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <HiSparkles className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-[var(--text-secondary)]">#{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300/10 to-gray-400/10 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/10 to-orange-500/10 border-amber-600/30';
    return 'bg-[var(--bg-secondary)] border-[var(--border-color)]';
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-6">
            <HiTrophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Leaderboard
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Top performers who have conquered the most challenges and earned their place at the top.
          </p>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${getRankStyle(leader.rank)} transition-transform hover:scale-[1.02]`}
            >
              {/* Rank */}
              <div className="w-12 h-12 flex items-center justify-center">
                {getRankBadge(leader.rank)}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                {leader.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{leader.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{leader.wins} contest wins</p>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {leader.points.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
