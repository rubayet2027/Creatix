import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiPlay, HiStar } from 'react-icons/hi';
import { HiSparkles, HiBolt } from 'react-icons/hi2';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-secondary-900 via-secondary-800 to-primary-900">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary-600/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-secondary-950 to-transparent" />
        
        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-2/3 h-full">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon 
              fill="rgba(139, 92, 246, 0.05)" 
              points="30,0 100,0 100,100 0,100"
            />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-primary-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent-cyan rounded-full opacity-40 animate-pulse delay-300" />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-accent-emerald rounded-full opacity-50 animate-pulse delay-700" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <HiSparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">New contests added weekly</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover.{' '}
              <span className="bg-linear-to-r from-primary-400 via-purple-400 to-accent-cyan bg-clip-text text-transparent">
                Compete.
              </span>{' '}
              Win.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-secondary-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Join the ultimate platform for creative minds. Participate in exciting contests, 
              showcase your talent, and win amazing prizes from around the world.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto lg:mx-0 mb-8">
              <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="relative flex-1">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contests..."
                    className="w-full pl-12 pr-4 sm:pr-28 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <button className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-6 py-3 sm:py-2 bg-linear-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all">
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link
                to="/all-contests"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                <HiBolt className="w-5 h-5" />
                Explore Contests
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all">
                <HiPlay className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-primary-600 border-2 border-secondary-900 flex items-center justify-center text-xs text-white font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-secondary-300">
                  <span className="text-white font-semibold">50K+</span> active creators
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <HiStar key={i} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-sm text-secondary-300 ml-1">
                  <span className="text-white font-semibold">4.9</span> rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="hidden lg:block relative">
            <div className="relative z-10">
              {/* Main Dashboard Card */}
              <div className="bg-linear-to-br from-secondary-800/80 to-secondary-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Contest Dashboard</p>
                      <p className="text-xs text-secondary-400">Real-time updates</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Active', value: '24', color: 'primary' },
                    { label: 'Entries', value: '1.2K', color: 'emerald' },
                    { label: 'Prize Pool', value: '$50K', color: 'amber' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className={`text-lg font-bold ${
                        stat.color === 'primary' ? 'text-primary-400' :
                        stat.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-secondary-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-end justify-between h-24 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-linear-to-t from-primary-600 to-primary-400 rounded-t-md"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-secondary-400 mt-2">Weekly Participation</p>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  {[
                    { name: 'Sarah won Logo Design', time: '2m ago' },
                    { name: 'New Photo Contest live', time: '15m ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
                      <span className="text-sm text-secondary-200">{activity.name}</span>
                      <span className="text-xs text-secondary-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Contest Card */}
              <div className="absolute -bottom-8 -left-8 bg-linear-to-br from-secondary-800 to-secondary-900 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent-cyan to-primary-500 flex items-center justify-center">
                    <HiSparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">New Contest!</p>
                    <p className="text-sm text-emerald-400">$5,000 Prize</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -top-4 -right-4 bg-linear-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-xs text-primary-200">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-(--bg-primary)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
