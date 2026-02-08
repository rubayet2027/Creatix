import { HiSearch, HiPencilAlt, HiArrowRight } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';

const HowItWorks = () => {
  const steps = [
    {
      icon: HiSearch,
      title: 'Explore Contests',
      description: 'Browse through hundreds of creative contests across design, photography, writing, and more categories.',
      color: 'primary',
      number: '01',
    },
    {
      icon: HiPencilAlt,
      title: 'Join & Submit',
      description: 'Register for free, choose your favorite contest, and submit your best creative work to compete.',
      color: 'cyan',
      number: '02',
    },
    {
      icon: HiTrophy,
      title: 'Win Rewards',
      description: 'Get recognized by the community, earn points, climb the leaderboard, and win amazing cash prizes.',
      color: 'emerald',
      number: '03',
    },
  ];

  const getGradient = (color) => {
    switch (color) {
      case 'primary':
        return 'from-primary-500 to-primary-700';
      case 'cyan':
        return 'from-accent-cyan to-primary-500';
      case 'emerald':
        return 'from-accent-emerald to-accent-cyan';
      default:
        return 'from-primary-500 to-primary-700';
    }
  };

  const getBgLight = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 dark:bg-primary-900/20';
      case 'cyan':
        return 'bg-cyan-50 dark:bg-cyan-900/20';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-900/20';
      default:
        return 'bg-primary-50 dark:bg-primary-900/20';
    }
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-(--bg-primary)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-primary) mb-6">
            How Creatix Works
          </h2>
          <p className="text-lg text-(--text-secondary)">
            Getting started is easy. Follow these three simple steps to begin your creative journey 
            and compete with talented individuals worldwide.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-(--border-color) to-transparent z-0">
                  <HiArrowRight className="absolute right-0 -top-2 w-5 h-5 text-(--border-color)" />
                </div>
              )}

              {/* Card */}
              <div className="relative bg-(--bg-secondary) rounded-3xl p-8 border border-(--border-color) hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-500/5 group-hover:-translate-y-1">
                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-(--bg-primary) border border-(--border-color) flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${getBgLight(step.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${getGradient(step.color)} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-(--text-primary) mb-3">
                  {step.title}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute bottom-4 right-4 w-16 h-16 rounded-full bg-linear-to-br ${getGradient(step.color)} opacity-10`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/all-contests"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 group"
          >
            Start Competing Now
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
