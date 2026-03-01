import { useState, useEffect } from 'react';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Container from './layout/Container';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'UI Designer',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=7c3aed&color=fff&size=200',
    rating: 5,
    quote: 'Creatix transformed how I showcase my design skills. Won my first contest within a week and earned $500. The community feedback is incredibly valuable.',
  },
  {
    name: 'Marcus Thompson',
    role: 'Content Writer',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Thompson&background=059669&color=fff&size=200',
    rating: 5,
    quote: 'As a freelance writer, Creatix gives me consistent opportunities to earn while building my portfolio. The contest variety keeps things exciting.',
  },
  {
    name: 'Aisha Patel',
    role: 'Graphic Designer',
    avatar: 'https://ui-avatars.com/api/?name=Aisha+Patel&background=dc2626&color=fff&size=200',
    rating: 5,
    quote: 'The platform is beautifully designed and intuitive. I love how creators can set up contests with clear briefs. It makes the submission process seamless.',
  },
  {
    name: 'James Rodriguez',
    role: 'Full-Stack Developer',
    avatar: 'https://ui-avatars.com/api/?name=James+Rodriguez&background=2563eb&color=fff&size=200',
    rating: 4,
    quote: 'Hackathon contests on Creatix are top-notch. Fair judging, great prizes, and a supportive community. Already participated in 12 contests.',
  },
  {
    name: 'Emily Nakamura',
    role: 'Marketing Strategist',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Nakamura&background=d97706&color=fff&size=200',
    rating: 5,
    quote: 'Creatix helped me transition from corporate to freelance marketing. The contest format is perfect for proving your skills to potential clients.',
  },
  {
    name: 'David Okonkwo',
    role: 'Photographer',
    avatar: 'https://ui-avatars.com/api/?name=David+Okonkwo&background=7c3aed&color=fff&size=200',
    rating: 5,
    quote: 'Photography contests here have real prize money and real exposure. My winning photo was featured by three major brands. Game changer!',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, maxIndex]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="section-padding bg-[var(--bg-secondary)]">
      <Container>
        <div className="section-header">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--primary-light)] text-[var(--primary)] mb-4">
            Testimonials
          </span>
          <h2 className="text-h2 mb-4">Loved by Creators Worldwide</h2>
          <p className="text-subheading max-w-2xl mx-auto">
            See what our community members have to say about their contest experience on Creatix.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] shadow-md flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <HiChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] shadow-md flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <HiChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden px-2">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${current * (100 / itemsPerView)}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)]"
                >
                  <div className="card-base p-6 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <HiStar
                          key={s}
                          className={`w-5 h-5 ${s < t.rating ? 'text-amber-400' : 'text-[var(--text-muted)] opacity-30'}`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-body flex-1 mb-6 italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-[var(--primary)] w-8'
                    : 'bg-[var(--text-muted)] opacity-30 hover:opacity-60'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
