import { Link } from 'react-router-dom';
import { HiStar, HiUserGroup, HiGlobeAlt, HiShieldCheck } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';

export default function About() {
  const values = [
    {
      icon: HiStar,
      title: 'Excellence',
      description:
        'We strive for excellence in every contest we host, ensuring high-quality creative challenges.',
    },
    {
      icon: HiUserGroup,
      title: 'Community',
      description:
        'Building a supportive global community of creators who inspire and uplift each other.',
    },
    {
      icon: HiShieldCheck,
      title: 'Fairness',
      description:
        'Transparent judging and fair competition rules that give everyone an equal chance.',
    },
    {
      icon: HiGlobeAlt,
      title: 'Accessibility',
      description:
        'Open to creators worldwide, regardless of background or experience level.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Contests' },
    { value: '250K+', label: 'Creators' },
    { value: '$2.5M+', label: 'Prizes Awarded' },
    { value: '180+', label: 'Countries' },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <Section>
        <Container>
          {/* Header */}
          <header className="text-center max-w-3xl mx-auto mb-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-6"
              aria-hidden="true"
            >
              <HiTrophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              About Creatix
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Creatix is the ultimate platform for creative contests. We connect
              talented creators with opportunities to showcase their skills,
              earn rewards, and grow their audience through fair, curated
              competitions.
            </p>
          </header>

          {/* Mission Section */}
          <section
            className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-8 lg:p-12 mb-12"
            aria-labelledby="mission-heading"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2
                  id="mission-heading"
                  className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4"
                >
                  Our Mission
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  We believe that creative talent deserves recognition and
                  reward. Our mission is to empower creators worldwide by
                  providing a platform where they can compete, grow, and connect
                  with opportunities.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Since our founding, we&apos;ve hosted thousands of contests
                  across design, photography, writing, and more, awarding
                  millions in prizes to talented individuals from every corner
                  of the globe.
                </p>
              </div>
              <div
                className="grid grid-cols-2 gap-4"
                role="list"
                aria-label="Platform statistics"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)] text-center"
                    role="listitem"
                  >
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.value}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12" aria-labelledby="values-heading">
            <h2
              id="values-heading"
              className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-center mb-8"
            >
              Our Values
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              role="list"
              aria-label="Company values"
            >
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    role="listitem"
                  >
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 mb-4"
                      aria-hidden="true"
                    >
                      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="text-center bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12"
            aria-labelledby="cta-heading"
          >
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Ready to Join?
            </h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto">
              Start your creative journey today. Join thousands of creators
              competing in exciting challenges.
            </p>
            <Link
              to="/all-contests"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Explore Contests
            </Link>
          </section>
        </Container>
      </Section>
    </div>
  );
}