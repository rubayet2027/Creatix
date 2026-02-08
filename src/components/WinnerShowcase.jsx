import { Link } from 'react-router-dom';
import { HiTrophy, HiArrowRight, HiStar, HiSparkles, HiCurrencyDollar } from 'react-icons/hi';

const WinnerShowcase = () => {
  const winners = [
    {
      id: 1,
      name: 'Emily Rodriguez',
      title: 'Creative Director',
      avatar: null,
      contestName: 'Brand Identity Challenge',
      prize: '$3,500',
      quote: 'Creatix gave me the platform to showcase my talent and connect with amazing opportunities.',
      rank: 1,
    },
    {
      id: 2,
      name: 'Marcus Chen',
      title: 'UX Designer',
      avatar: null,
      contestName: 'App Design Sprint',
      prize: '$2,800',
      quote: 'The competition pushed me to deliver my best work. The community here is incredibly supportive.',
      rank: 1,
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      title: 'Photographer',
      avatar: null,
      contestName: 'Wildlife Photography',
      prize: '$2,200',
      quote: 'Winning this contest opened doors I never knew existed. Thank you Creatix!',
      rank: 1,
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900/20 to-secondary-900" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <HiTrophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Recent Winners
          </h2>
          <p className="text-lg text-secondary-300">
            Meet the talented creators who conquered our challenges. Your name could be next on this list.
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {winners.map((winner, index) => (
            <div
              key={winner.id}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-primary-500/30 transition-all duration-300"
            >
              {/* Trophy Icon */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <HiTrophy className="w-6 h-6 text-white" />
              </div>

              {/* Winner Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl text-white font-bold">
                    {winner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">#1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{winner.name}</h3>
                  <p className="text-sm text-secondary-400">{winner.title}</p>
                </div>
              </div>

              {/* Contest & Prize */}
              <div className="flex items-center justify-between mb-6 py-4 border-y border-white/10">
                <div>
                  <p className="text-xs text-secondary-400 mb-1">Contest Won</p>
                  <p className="text-sm font-medium text-white">{winner.contestName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary-400 mb-1">Prize Won</p>
                  <p className="text-xl font-bold text-emerald-400">{winner.prize}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <HiSparkles className="absolute -top-2 -left-2 w-6 h-6 text-primary-400/30" />
                <p className="text-secondary-300 text-sm italic leading-relaxed">
                  &ldquo;{winner.quote}&rdquo;
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-transparent transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Stats Highlight */}
        <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 rounded-3xl border border-primary-500/20 p-8 lg:p-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HiCurrencyDollar, value: '$2.5M+', label: 'Total Prizes Awarded' },
              { icon: HiTrophy, value: '5,000+', label: 'Winners Crowned' },
              { icon: HiStar, value: '98%', label: 'Winner Satisfaction' },
              { icon: HiSparkles, value: '150+', label: 'Countries Represented' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/20 mb-4">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-secondary-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-secondary-300 mb-6">
            Ready to join our growing list of champions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/all-contests"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25"
            >
              Start Competing
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all"
            >
              <HiTrophy className="w-5 h-5" />
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinnerShowcase;
