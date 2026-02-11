import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiArrowRight } from 'react-icons/hi';
import { HiSparkles } from 'react-icons/hi2';
import { contestsAPI } from '../api';
import ContestCard from './ContestCard';
import Section from './layout/Section';
import Container from './layout/Container';

const PopularContests = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-contests'],
    queryFn: async () => {
      const response = await contestsAPI.getPopular(6);
      return response.data;
    },
  });

  const contests = data || [];

  return (
    <Section className="bg-[var(--bg-secondary)]">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
              <HiSparkles className="w-4 h-4 text-primary-500" aria-hidden="true" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Popular Contests
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              Discover the most exciting contests happening right now. Join
              thousands of creators competing for amazing prizes.
            </p>
          </div>
          <Link
            to="/all-contests"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group shrink-0"
          >
            View All Contests
            <HiArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Contests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-[var(--bg-tertiary)] rounded-xl mb-4" />
                <div className="h-6 bg-[var(--bg-tertiary)] rounded mb-2 w-3/4" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">No contests available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Link
            to="/all-contests"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold rounded-2xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
          >
            Explore More Contests
            <HiArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default PopularContests;