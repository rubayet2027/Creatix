import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { contestsAPI } from '../api';
import ContestCard from '../components/ContestCard';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { HiSearch, HiFilter } from 'react-icons/hi';

const CONTEST_TYPES = [
  'All',
  'Image Design',
  'Article Writing',
  'Marketing Strategy',
  'Digital Advertisement',
  'Gaming Review',
  'Book Review',
  'Business Idea',
  'Movie Review',
];

const AllContests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'All');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['contests', activeType, searchParams.get('search'), page],
    queryFn: async () => {
      const params = {
        type: activeType === 'All' ? undefined : activeType,
        search: searchParams.get('search') || undefined,
        page,
        limit,
      };
      const response = await contestsAPI.getAll(params);
      return response.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery, type: activeType !== 'All' ? activeType : '' });
    } else {
      setSearchParams({ type: activeType !== 'All' ? activeType : '' });
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setPage(1);
    const search = searchParams.get('search');
    if (type === 'All') {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams(search ? { search, type } : { type });
    }
  };

  const contests = data?.contests || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalContests = data?.pagination?.total || contests.length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore All Contests
            </h1>
            <p className="text-secondary-300 mb-8">
              Discover creative challenges and showcase your talent. Find the perfect contest for your skills.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contests by name or type..."
                className="w-full pl-12 pr-28 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </Container>
      </div>

      <Section>
        <Container>
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <HiFilter className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
            {CONTEST_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiSearch className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Contests Found</h2>
              <p className="text-[var(--text-secondary)]">
                {searchParams.get('search')
                  ? `No results for "${searchParams.get('search')}". Try a different search term.`
                  : 'No contests available in this category yet.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[var(--text-secondary)] mb-6">
                Showing {contests.length} of {totalContests} contest{totalContests !== 1 ? 's' : ''}
                {activeType !== 'All' && ` in ${activeType}`}
                {searchParams.get('search') && ` matching "${searchParams.get('search')}"`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[var(--text-secondary)]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </div>
  );
};

export default AllContests;
