import { Link } from 'react-router-dom';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import ContestCard from './ContestCard';

const PopularContests = () => {
  // Static contest data (UI only)
  const contests = [
    {
      id: 1,
      title: 'Modern Brand Identity Design',
      description: 'Create a complete brand identity including logo, color palette, and typography for a tech startup revolutionizing remote work.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      category: 'Design',
      participants: 342,
      deadline: '5 days left',
      prize: '$2,500',
      featured: true,
    },
    {
      id: 2,
      title: 'Urban Street Photography',
      description: 'Capture the essence of city life through compelling street photography that tells stories of urban culture and daily moments.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop',
      category: 'Photography',
      participants: 518,
      deadline: '12 days left',
      prize: '$1,800',
      featured: false,
    },
    {
      id: 3,
      title: 'Short Story Writing Competition',
      description: 'Write a compelling short story under 3000 words exploring themes of human connection in the digital age.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
      category: 'Writing',
      participants: 276,
      deadline: '8 days left',
      prize: '$1,500',
      featured: false,
    },
    {
      id: 4,
      title: 'Digital Art Masterpiece',
      description: 'Create stunning digital artwork that pushes the boundaries of imagination. Any digital medium accepted.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      category: 'Art',
      participants: 423,
      deadline: '3 days left',
      prize: '$3,000',
      featured: true,
    },
    {
      id: 5,
      title: 'Product Video Showcase',
      description: 'Create an engaging 60-second video that showcases a product in a creative and memorable way.',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop',
      category: 'Video',
      participants: 189,
      deadline: '15 days left',
      prize: '$2,000',
      featured: false,
    },
    {
      id: 6,
      title: 'Mobile App UI Design',
      description: 'Design a beautiful and intuitive user interface for a fitness tracking mobile application.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
      category: 'Design',
      participants: 367,
      deadline: '7 days left',
      prize: '$2,200',
      featured: false,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
              <HiSparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Popular Contests
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              Discover the most exciting contests happening right now. Join thousands of creators competing for amazing prizes.
            </p>
          </div>
          <Link
            to="/all-contests"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
          >
            View All Contests
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Contests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Link
            to="/all-contests"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold rounded-2xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
          >
            Explore More Contests
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularContests;
