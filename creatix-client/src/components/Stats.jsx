import { useEffect, useRef, useState, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiUsers, HiGlobeAlt, HiChartBar, HiStar } from 'react-icons/hi';
import { HiTrophy, HiBolt } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { statsAPI } from '../api';
import Section from './layout/Section';
import Container from './layout/Container';
import googleLogo from '../assets/Google.png';
import adobeLogo from '../assets/Adobe.png';
import slackLogo from '../assets/SLack.png';

// Animated counter component
const AnimatedCounter = memo(function AnimatedCounter({ value, suffix, isVisible }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    let animationFrame;

    const animate = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
});

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Build stats array from API data or fallback to defaults
  const stats = [
    {
      icon: HiBolt,
      value: 150,
      suffix: '+',
      label: 'Active Contests',
      description: 'Live competitions',
      color: 'primary',
    },
    {
      icon: HiUsers,
      value: 5000,
      suffix: '+',
      label: 'Users',
      description: 'Creative minds',
      color: 'cyan',
    },
    {
      icon: HiTrophy,
      value: 2500,
      suffix: 'K+',
      label: 'Prizes Distributed',
      description: 'In USD',
      color: 'amber',
    },
    {
      icon: HiGlobeAlt,
      value: 12000,
      suffix: '+',
      label: 'Total Contests',
      description: 'Hosted on platform',
      color: 'emerald',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-500/10',
        icon: 'text-primary-500',
        border: 'border-primary-500/20',
      },
      cyan: {
        bg: 'bg-cyan-500/10',
        icon: 'text-cyan-500',
        border: 'border-cyan-500/20',
      },
      amber: {
        bg: 'bg-amber-500/10',
        icon: 'text-amber-500',
        border: 'border-amber-500/20',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        icon: 'text-emerald-500',
        border: 'border-emerald-500/20',
      },
    };
    return colors[color] || colors.primary;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Intersection Observer for animation trigger
  useEffect(() => {
    const currentRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Section ref={sectionRef} className="bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-primary-500/10 rotate-45 rounded-3xl" />
        <div className="absolute bottom-1/4 right-10 w-24 h-24 border-2 border-cyan-500/10 rotate-12 rounded-2xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/5 rotate-45 rounded-xl" />
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-emerald-500/10 -rotate-12 rounded-2xl" />
      </div>

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <HiChartBar className="w-4 h-4 text-primary-500" aria-hidden="true" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              By the Numbers
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Our Growing Community
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Join a thriving ecosystem of creative professionals who trust
            Creatix to showcase their talents and win rewards.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 relative"
          role="list"
          aria-label="Platform statistics"
        >
          {stats.map((stat) => {
            const colors = getColorClasses(stat.color);
            const IconComponent = stat.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={stat.label}
                viewport={{ once: true }}
                className="group relative bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 overflow-hidden hover:-translate-y-1"
                role="listitem"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2 pointer-events-none`}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div
                  className={`relative w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Value */}
                <p className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                  />
                </p>

                {/* Label */}
                <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {stat.label}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {stat.description}
                </p>

                {/* Decorative Element */}
                <div
                  className={`absolute bottom-4 right-4 w-8 h-8 border-2 ${colors.border} rounded-lg rotate-45 opacity-50 group-hover:rotate-90 transition-transform duration-500 pointer-events-none`}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Badges & Trustpilot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8 lg:p-12 relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 justify-between"
        >
          {/* Trustpilot Section */}
          <div className="flex flex-col items-center lg:items-start shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <HiStar className="w-8 h-8 text-[#00b67a]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">Trustpilot</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-[#00b67a] flex items-center justify-center rounded-sm">
                  <HiStar className="w-5 h-5 text-white" />
                </div>
              ))}
            </div>
            <p className="text-[var(--text-secondary)] font-medium">
              TrustScore <span className="font-bold text-[var(--text-primary)]">4.8</span> | <span className="underline cursor-pointer hover:text-[var(--text-primary)]">147 reviews</span>
            </p>
          </div>

          <div className="w-full h-px lg:w-px lg:h-24 bg-[var(--border-color)] hidden sm:block"></div>

          {/* Companies Section */}
          <div className="flex-1 w-full">
            <div className="text-center mb-8">
              <p className="text-[var(--text-secondary)] font-medium text-lg">
                Trusted by creators from top companies
              </p>
            </div>
            <ul
              className="flex flex-wrap justify-center items-center gap-10 md:gap-14"
              aria-label="Trusted companies"
            >
              {[
                { name: 'Google', src: googleLogo, isLocal: true },
                { name: 'Adobe', src: adobeLogo, isLocal: true },
                { name: 'Spotify', icon: 'spotify', isLocal: false },
                { name: 'Airbnb', icon: 'airbnb', isLocal: false },
                { name: 'Netflix', icon: 'netflix', isLocal: false },
                { name: 'Slack', src: slackLogo, isLocal: true },
              ].map((company) => (
                <li
                  key={company.name}
                  className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.15] active:scale-95 cursor-pointer"
                  title={company.name}
                >
                  <img
                    src={company.isLocal ? company.src : `https://cdn.simpleicons.org/${company.icon}/currentColor`}
                    alt={`${company.name} logo`}
                    className={`h-10 md:h-12 lg:h-14 w-auto drop-shadow-sm ${!company.isLocal ? 'dark:invert text-[var(--text-primary)]' : ''}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Stats;