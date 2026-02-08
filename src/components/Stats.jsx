import { useEffect, useRef, useState } from 'react';
import { HiTrophy, HiUsers, HiLightningBolt, HiGlobeAlt, HiChartBar, HiStar } from 'react-icons/hi';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: HiLightningBolt,
      value: 500,
      suffix: '+',
      label: 'Active Contests',
      description: 'Live competitions',
      color: 'primary',
    },
    {
      icon: HiUsers,
      value: 250,
      suffix: 'K+',
      label: 'Participants',
      description: 'Creative minds',
      color: 'cyan',
    },
    {
      icon: HiTrophy,
      value: 15,
      suffix: 'K+',
      label: 'Winners',
      description: 'Success stories',
      color: 'amber',
    },
    {
      icon: HiGlobeAlt,
      value: 180,
      suffix: '+',
      label: 'Countries',
      description: 'Global reach',
      color: 'emerald',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-500/10',
        icon: 'text-primary-500',
        border: 'border-primary-500/20',
        gradient: 'from-primary-500 to-primary-600',
      },
      cyan: {
        bg: 'bg-cyan-500/10',
        icon: 'text-cyan-500',
        border: 'border-cyan-500/20',
        gradient: 'from-cyan-500 to-cyan-600',
      },
      amber: {
        bg: 'bg-amber-500/10',
        icon: 'text-amber-500',
        border: 'border-amber-500/20',
        gradient: 'from-amber-500 to-amber-600',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        icon: 'text-emerald-500',
        border: 'border-emerald-500/20',
        gradient: 'from-emerald-500 to-emerald-600',
      },
    };
    return colors[color];
  };

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counter component
  const AnimatedCounter = ({ value, suffix }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexagon Pattern */}
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-primary-500/10 rotate-45 rounded-3xl" />
        <div className="absolute bottom-1/4 right-10 w-24 h-24 border-2 border-cyan-500/10 rotate-12 rounded-2xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/5 rotate-45 rounded-xl" />
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-emerald-500/10 -rotate-12 rounded-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
            <HiChartBar className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">By the Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Our Growing Community
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Join a thriving ecosystem of creative professionals who trust Creatix to showcase their talents and win rewards.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {stats.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            return (
              <div
                key={stat.label}
                className={`group relative bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8 hover:border-${stat.color}-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-${stat.color}-500/5 overflow-hidden`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Value */}
                <p className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>

                {/* Label */}
                <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {stat.label}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {stat.description}
                </p>

                {/* Decorative Element */}
                <div className={`absolute bottom-4 right-4 w-8 h-8 border-2 ${colors.border} rounded-lg rotate-45 opacity-50 group-hover:rotate-90 transition-transform duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8 lg:p-12">
          <div className="text-center mb-8">
            <p className="text-[var(--text-secondary)]">Trusted by creators from top companies</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-60">
            {['Google', 'Adobe', 'Spotify', 'Airbnb', 'Netflix', 'Slack'].map((company) => (
              <div key={company} className="flex items-center gap-2 text-[var(--text-primary)]">
                <HiStar className="w-5 h-5 text-primary-500" />
                <span className="text-lg font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
