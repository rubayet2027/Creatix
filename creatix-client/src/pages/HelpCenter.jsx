import { motion } from 'framer-motion';
import { HiSearch, HiChat, HiBookOpen, HiLightningBolt } from 'react-icons/hi';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
    const topics = [
        { icon: HiBookOpen, title: 'Getting Started', desc: 'New to Creatix? Learn the basics here.' },
        { icon: HiLightningBolt, title: 'Contest Rules', desc: 'Everything about hosting and entering.' },
        { icon: HiChat, title: 'Account Settings', desc: 'Manage your profile and preferences.' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section className="pb-10">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            How can we <span className="text-primary-600">help</span> you?
                        </h1>

                        <div className="relative max-w-xl mx-auto mt-8">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search for articles, guides..."
                                className="w-full pl-12 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-lg"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                        {topics.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 mx-auto bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-primary-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
                                <p className="text-[var(--text-secondary)]">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center bg-gradient-to-br from-primary-600/10 to-transparent border border-primary-500/20 rounded-3xl p-10 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Still need help?</h3>
                        <p className="text-[var(--text-secondary)] mb-6">Our support team is available 24/7 to assist you with any questions.</p>
                        <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
                            Contact Support
                        </Link>
                    </div>
                </Container>
            </Section>
        </div>
    );
};

export default HelpCenter;
