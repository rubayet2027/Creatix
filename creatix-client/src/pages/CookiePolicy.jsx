import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Cookie Policy</h1>
                        <p className="text-[var(--text-secondary)]">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-primary-600 hover:prose-a:text-primary-500"
                    >
                        <p>
                            This Cookie Policy explains how Creatix ("Company", "we", "us", and "our") uses cookies and similar technologies
                            to recognize you when you visit our website. It explains what these technologies are and why we use them, as well
                            as your rights to control our use of them.
                        </p>

                        <h3>What are cookies?</h3>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
                            as well as to provide reporting information.
                        </p>

                        <h3>Why do we use cookies?</h3>
                        <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.</p>

                        <ul>
                            <li><strong>Essential website cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</li>
                            <li><strong>Performance and functionality cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use.</li>
                            <li><strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</li>
                        </ul>

                        <h3>How can I control cookies?</h3>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.
                            The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                        </p>

                        <h3>Where can I get further information?</h3>
                        <p>
                            If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@creatix.com">privacy@creatix.com</a> or visit our <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </motion.div>
                </Container>
            </Section>
        </div>
    );
};

export default CookiePolicy;
