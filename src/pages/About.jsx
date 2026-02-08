import { HiStar, HiUserGroup, HiGlobeAlt, HiShieldCheck } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';

export default function About() {
  const values = [
    {
      icon: HiStar,
      title: 'Excellence',
      description: 'We strive for excellence in every contest we host, ensuring high-quality creative challenges.',
    },
    {
      icon: HiUserGroup,
      title: 'Community',
      description: 'Building a supportive global community of creators who inspire and uplift each other.',
    },
    {
      icon: HiShieldCheck,
      title: 'Fairness',
      description: 'Transparent judging and fair competition rules that give everyone an equal chance.',
    },
    {
      icon: HiGlobeAlt,
      title: 'Accessibility',
      description: 'Open to creators worldwide, regardless of background or experience level.',
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 mb-6">
            <HiTrophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-(--text-primary) mb-6">
            About Creatix
          </h1>
          <p className="text-lg text-(--text-secondary)">
            Creatix is the ultimate platform for creative contests. We connect talented 
            creators with opportunities to showcase their skills, earn rewards, and grow 
            their audience through fair, curated competitions.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-(--bg-secondary) rounded-3xl border border-(--border-color) p-8 lg:p-12 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-4">
                Our Mission
              </h2>
              <p className="text-(--text-secondary) leading-relaxed mb-4">
                We believe that creative talent deserves recognition and reward. Our mission 
                is to empower creators worldwide by providing a platform where they can 
                compete, grow, and connect with opportunities.
              </p>
              <p className="text-(--text-secondary) leading-relaxed">
                Since our founding, we&apos;ve hosted thousands of contests across design, 
                photography, writing, and more, awarding millions in prizes to talented 
                individuals from every corner of the globe.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-(--bg-primary) rounded-2xl p-6 border border-(--border-color) text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">500+</p>
                <p className="text-sm text-(--text-secondary)">Active Contests</p>
              </div>
              <div className="bg-(--bg-primary) rounded-2xl p-6 border border-(--border-color) text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">250K+</p>
                <p className="text-sm text-(--text-secondary)">Creators</p>
              </div>
              <div className="bg-(--bg-primary) rounded-2xl p-6 border border-(--border-color) text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">$2.5M+</p>
                <p className="text-sm text-(--text-secondary)">Prizes Awarded</p>
              </div>
              <div className="bg-(--bg-primary) rounded-2xl p-6 border border-(--border-color) text-center">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">180+</p>
                <p className="text-sm text-(--text-secondary)">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-(--text-primary) text-center mb-8">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-(--bg-secondary) rounded-2xl border border-(--border-color) p-6 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-4">
                  <value.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-(--text-primary) mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-linear-to-br from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-primary-100 mb-6 max-w-lg mx-auto">
            Start your creative journey today. Join thousands of creators competing 
            in exciting challenges.
          </p>
          <a
            href="/all-contests"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 transition-colors"
          >
            Explore Contests
          </a>
        </div>
      </div>
    </div>
  );
}
