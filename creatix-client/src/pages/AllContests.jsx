import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { contestsAPI } from '../api';
import ContestCard from '../components/ContestCard';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { HiSearch, HiFilter, HiClock, HiPlay, HiCalendar, HiCheckCircle, HiTrophy } from 'react-icons/hi';

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

const TIMELINE_TABS = [
  { id: 'all', label: 'All Contests', icon: HiFilter },
  { id: 'ongoing', label: 'Ongoing', icon: HiPlay },
  { id: 'upcoming', label: 'Upcoming', icon: HiCalendar },
  { id: 'past', label: 'Past', icon: HiCheckCircle },
];

const AllContests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'All');
  const [activeTimeline, setActiveTimeline] = useState(searchParams.get('timeline') || 'all');
  const [page, setPage] = useState(1);
  const limit = 9;

  // Query for timeline sections (overview)
  const { data: timelineData, isLoading: isTimelineLoading } = useQuery({
    queryKey: ['contests-timeline'],
    queryFn: async () => {
      const response = await contestsAPI.getByTimeline();
      return response.data;
    },
    enabled: activeTimeline === 'all' && !searchParams.get('search'),
  });

  // Query for filtered contests
  const { data: filteredData, isLoading: isFilteredLoading } = useQuery({
    queryKey: ['contests', activeType, activeTimeline, searchParams.get('search'), page],
    queryFn: async () => {
      const params = {
        type: activeType === 'All' ? undefined : activeType,
        timeline: activeTimeline === 'all' ? undefined : activeTimeline,
        search: searchParams.get('search') || undefined,
        page,
        limit,
      };
      const response = await contestsAPI.getAll(params);
      return response.data;
    },
    enabled: activeTimeline !== 'all' || !!searchParams.get('search'),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = {};
    if (searchQuery.trim()) newParams.search = searchQuery;
    if (activeType !== 'All') newParams.type = activeType;
    if (activeTimeline !== 'all') newParams.timeline = activeTimeline;
    setSearchParams(newParams);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setPage(1);
    const newParams = {};
    if (searchParams.get('search')) newParams.search = searchParams.get('search');
    if (type !== 'All') newParams.type = type;
    if (activeTimeline !== 'all') newParams.timeline = activeTimeline;
    setSearchParams(newParams);
  };

  const handleTimelineChange = (timeline) => {
    setActiveTimeline(timeline);
    setPage(1);
    const newParams = {};
    if (searchParams.get('search')) newParams.search = searchParams.get('search');
    if (activeType !== 'All') newParams.type = activeType;
    if (timeline !== 'all') newParams.timeline = timeline;
    setSearchParams(newParams);
  };

  const isLoading = isTimelineLoading || isFilteredLoading;
  const showSections = activeTimeline === 'all' && !searchParams.get('search');

  // Helper to render a contest section
  const renderSection = (title, icon, contests, total, timeline, description) => {
    if (!contests || contests.length === 0) return null;
    
    const Icon = icon;
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              timeline === 'ongoing' ? 'bg-green-100 dark:bg-green-900/30' :
              timeline === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/30' :
              'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Icon className={`w-5 h-5 ${
                timeline === 'ongoing' ? 'text-green-600 dark:text-green-400' :
                timeline === 'upcoming' ? 'text-blue-600 dark:text-blue-400' :
                'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>
          </div>
          {total > 6 && (
            <button
              onClick={() => handleTimelineChange(timeline)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
            >
              View all {total}
              <span className="text-lg">→</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} showWinners={timeline === 'past'} />
          ))}
        </div>
      </div>
    );
  };

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
          {/* Timeline Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {TIMELINE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTimelineChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTimeline === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <HiFilter className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
            {CONTEST_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeType === type
                    ? 'bg-secondary-600 text-white'
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
          ) : showSections && timelineData ? (
            // Show sections overview
            <>
              {renderSection(
                'Ongoing Contests',
                HiPlay,
                timelineData.ongoing?.contests,
                timelineData.ongoing?.total,
                'ongoing',
                'Contests ending within 7 days - Submit now!'
              )}
              {renderSection(
                'Upcoming Contests',
                HiCalendar,
                timelineData.upcoming?.contests,
                timelineData.upcoming?.total,
                'upcoming',
                'Get ready for these upcoming challenges'
              )}
              {renderSection(
                'Past Contests',
                HiCheckCircle,
                timelineData.past?.contests,
                timelineData.past?.total,
                'past',
                'Completed contests with winners announced'
              )}
              {(!timelineData.ongoing?.contests?.length && 
                !timelineData.upcoming?.contests?.length && 
                !timelineData.past?.contests?.length) && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiSearch className="w-8 h-8 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Contests Found</h2>
                  <p className="text-[var(--text-secondary)]">No contests available yet. Check back soon!</p>
                </div>
              )}
            </>
          ) : filteredData?.contests?.length === 0 ? (
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
            // Show filtered list with pagination
            <>
              <p className="text-[var(--text-secondary)] mb-6">
                Showing {filteredData?.contests?.length || 0} of {filteredData?.pagination?.total || 0} contest{(filteredData?.pagination?.total || 0) !== 1 ? 's' : ''}
                {activeTimeline !== 'all' && ` (${TIMELINE_TABS.find(t => t.id === activeTimeline)?.label})`}
                {activeType !== 'All' && ` in ${activeType}`}
                {searchParams.get('search') && ` matching "${searchParams.get('search')}"`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData?.contests?.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} showWinners={activeTimeline === 'past'} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {(filteredData?.pagination?.totalPages || 1) > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[var(--text-secondary)]">
                    Page {page} of {filteredData?.pagination?.totalPages || 1}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(filteredData?.pagination?.totalPages || 1, p + 1))}
                    disabled={page === (filteredData?.pagination?.totalPages || 1)}
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
