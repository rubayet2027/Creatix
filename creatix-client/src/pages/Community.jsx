import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { HiUserGroup, HiChatAlt2, HiPlay } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Community = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Welcome to the <span className="text-primary-600">Creatix Community</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Connect with fellow creators, share your work, get feedback, and level up your skills.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl text-center hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <HiUserGroup className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Discord Server</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Join 10,000+ creators in our official Discord server. Share memes, network, and find teammates.</p>
                            <button className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 w-full transition-colors">Join Discord</button>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl text-center hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <HiChatAlt2 className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Creator Forums</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Deep dive into design theory, code architecture, and software tutorials with expert creators.</p>
                            <Link to="/blog" className="block px-6 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--border-color)] w-full transition-colors">Browse Topics</Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl text-center hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <HiPlay className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Live Workshops</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Attend weekly livestreams hosted by top-ranking contest winners and industry professionals.</p>
                            <button className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 w-full transition-colors">Watch Replays</button>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white max-w-5xl mx-auto shadow-2xl shadow-primary-500/20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to be a Community Ambassador?</h2>
                        <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">We are looking for passionate creators to moderate discussions, host events, and shape the future of our platform.</p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">Apply Now</Link>
                    </motion.div>
                </Container>
            </Section>
        </div>
    );
};

export default Community;
