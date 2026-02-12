import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiTrophy, HiStar, HiSparkles } from 'react-icons/hi2';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import { leaderboardAPI } from '../api';

const Leaderboard = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', page],
    queryFn: async () => {
      const response = await leaderboardAPI.getAll({ page, limit });
      return response.data;
    },
  });

  const leaders = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const getRankBadge = (rank) => {
    if (rank === 1) return <HiTrophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <HiStar className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <HiSparkles className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-[var(--text-secondary)]">#{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-linear-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
    if (rank === 2) return 'bg-linear-to-r from-gray-300/10 to-gray-400/10 border-gray-400/30';
    if (rank === 3) return 'bg-linear-to-r from-amber-600/10 to-orange-500/10 border-amber-600/30';
    return 'bg-[var(--bg-secondary)] border-[var(--border-color)]';
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--bg-primary)]">
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
          {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 mb-4 sm:mb-6">
            <HiTrophy className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Leaderboard
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Top performers who have conquered the most challenges and earned their place at the top.
          </p>
        </div>

        {/* Leaderboard List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiTrophy className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Winners Yet</h2>
            <p className="text-[var(--text-secondary)]">Be the first to win a contest!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {leaders.map((leader) => (
                <div
                  key={leader._id || leader.rank}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${getRankStyle(leader.rank)} transition-transform hover:scale-[1.01] sm:hover:scale-[1.02]`}
                >
                  {/* Rank */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                    {getRankBadge(leader.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm sm:text-lg shrink-0 overflow-hidden">
                    {leader.photo ? (
                      <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      leader.name?.split(' ').map(n => n[0]).join('') || 'U'
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base truncate">{leader.name}</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{leader.contestsWon} contest win{leader.contestsWon !== 1 ? 's' : ''}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                      {leader.points || 0} pts
                    </p>
                    <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">{leader.contestsParticipated} participated</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)]">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} users)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Leaderboard;
