import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { HiDownload } from 'react-icons/hi';

const PressKit = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Press kit & <span className="text-primary-600">Media</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Everything you need to cover Creatix in your publication.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Brand Guidelines</h3>
                                <p className="text-[var(--text-secondary)] mb-8">Download our comprehensive brand guidelines, including logo usage, typography, color palette, and clear space rules.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-lg">
                                <HiDownload className="w-5 h-5" /> Download Guidelines (PDF)
                            </button>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Logo Pack</h3>
                                <p className="text-[var(--text-secondary)] mb-8">Get all variations of the Creatix logo in PNG and SVG formats. Includes primary, negative, and monochrome versions.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-lg">
                                <HiDownload className="w-5 h-5" /> Download Assets (ZIP)
                            </button>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 text-center max-w-2xl mx-auto text-[var(--text-secondary)]">
                        <p>For press inquiries, interview requests, or further information, please contact our PR team at <a href="mailto:press@creatix.com" className="text-primary-600 hover:text-primary-500 font-medium">press@creatix.com</a>.</p>
                    </motion.div>
                </Container>
            </Section>
        </div>
    );
};

export default PressKit;
