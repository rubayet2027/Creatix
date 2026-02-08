import Section from '../components/layout/Section';
import Container from '../components/layout/Container';

const AllContests = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--bg-primary)]">
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              All Contests
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Browse through our collection of creative contests and find the perfect challenge for you.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Coming Soon
            </h2>
            <p className="text-[var(--text-secondary)] text-center max-w-md px-4">
              We&apos;re preparing an amazing collection of contests for you. Check back soon!
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default AllContests;
