import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PopularContests from '../components/PopularContests';
import WinnerShowcase from '../components/WinnerShowcase';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularContests />
      <Stats />
      <Testimonials />
      <WinnerShowcase />
      <FAQ />
      <Newsletter />
    </>
  );
};

export default Home;
