import { Link } from 'react-router-dom';
import { HiCalendar, HiArrowRight, HiStar, HiTag } from 'react-icons/hi';
import Container from '../components/layout/Container';

const blogPosts = [
    {
        id: 1,
        title: '10 Tips to Win Your First Design Contest',
        excerpt: 'Landing your first contest win can feel daunting. Here are proven strategies from top Creatix winners to help you stand out and impress judges.',
        category: 'Tips & Tricks',
        date: 'Feb 28, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
        featured: true,
    },
    {
        id: 2,
        title: 'How Creatix Creators Are Earning $5K+ Monthly',
        excerpt: 'Meet three contest creators who turned their expertise into a thriving business on Creatix, hosting contests that attract hundreds of participants.',
        category: 'Success Stories',
        date: 'Feb 25, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        featured: false,
    },
    {
        id: 3,
        title: 'The Rise of AI/ML Challenges in Creative Platforms',
        excerpt: 'Artificial intelligence contests are the fastest growing category on Creatix. Learn why companies are investing in crowdsourced AI solutions.',
        category: 'Industry Trends',
        date: 'Feb 20, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
        featured: false,
    },
    {
        id: 4,
        title: 'Building a Winning Portfolio Through Contests',
        excerpt: 'Contest submissions can become your best portfolio pieces. Here\'s how to document, present, and leverage your contest work for career growth.',
        category: 'Career Growth',
        date: 'Feb 15, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',
        featured: false,
    },
    {
        id: 5,
        title: 'Photography Contest Judging: What Experts Look For',
        excerpt: 'Professional photographers share their judging criteria — from composition and lighting to storytelling and technical execution.',
        category: 'Behind the Scenes',
        date: 'Feb 10, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop',
        featured: false,
    },
    {
        id: 6,
        title: 'From Participant to Creator: A Complete Guide',
        excerpt: 'Ready to host your own contest? This step-by-step guide covers everything from setting prizes to selecting winners fairly.',
        category: 'Guides',
        date: 'Feb 5, 2026',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
        featured: false,
    },
];

const Blog = () => {
    const featured = blogPosts.find((p) => p.featured);
    const posts = blogPosts.filter((p) => !p.featured);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Creatix Blog</h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Insights, tips, and stories from the creative contest community. Level up your skills and stay inspired.
                        </p>
                    </div>
                </Container>
            </div>

            <Container>
                {/* Featured Post */}
                {featured && (
                    <div className="relative -mt-12 mb-16">
                        <div className="card-base overflow-hidden grid md:grid-cols-2 gap-0">
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="w-full h-64 md:h-full object-cover"
                                loading="lazy"
                            />
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="badge-base bg-[var(--primary-light)] text-[var(--primary)]">
                                        <HiStar className="w-3 h-3" /> Featured
                                    </span>
                                    <span className="badge-base">
                                        <HiTag className="w-3 h-3" /> {featured.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
                                    {featured.title}
                                </h2>
                                <p className="text-body mb-6">{featured.excerpt}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-caption">
                                        <HiCalendar className="w-4 h-4" />
                                        {featured.date} · {featured.readTime}
                                    </div>
                                    <Link
                                        to="#"
                                        className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all"
                                    >
                                        Read More <HiArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="pb-20">
                    <h2 className="text-h3 mb-8">Latest Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article key={post.id} className="card-base card-hover flex flex-col">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="badge-base text-xs">
                                            <HiTag className="w-3 h-3" /> {post.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-body text-sm flex-1 mb-4 line-clamp-3">{post.excerpt}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                                        <span className="text-caption flex items-center gap-1">
                                            <HiCalendar className="w-3.5 h-3.5" /> {post.date}
                                        </span>
                                        <span className="text-caption">{post.readTime}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Blog;
