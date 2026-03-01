import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Link } from 'react-router-dom';

const FaqsPage = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: 'How do I enter a contest?',
            a: 'Simply browse our active contests on the All Contests page, find one that matches your skills, and click the "Participate" button. You will need to create a free account to submit your entry.',
        },
        {
            q: 'When do I get paid if I win?',
            a: 'Prizes are processed within 3-5 business days after the contest creator selects the winner and approves the final deliverables. Funds are transferred directly to your connected bank account or PayPal.',
        },
        {
            q: 'Can I withdraw my submission?',
            a: 'Yes, you can withdraw or update your submission anytime before the contest deadline. Once the deadline passes, all submissions are final.',
        },
        {
            q: 'Is there a limit to how many contests I can enter?',
            a: 'No! You can participate in as many contests as you want, provided you meet the specific requirements for each contest.',
        },
        {
            q: 'How are winners selected?',
            a: 'The contest creator (brand, agency, or individual) is solely responsible for reviewing submissions and selecting the winning entry based on their criteria. Creatix ensures the prize money is held in escrow until a winner is chosen.',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section className="pb-8">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Frequently Asked <span className="text-primary-600">Questions</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Find answers to common questions about Creatix, entering contests, and getting paid.
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                                >
                                    <span className="text-lg font-semibold text-[var(--text-primary)]">{faq.q}</span>
                                    <HiChevronDown
                                        className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary-500' : ''
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-4">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-[var(--text-secondary)] mb-4">Can't find what you're looking for?</p>
                        <Link to="/contact" className="text-primary-600 font-semibold hover:text-primary-700">Contact our support team &rarr;</Link>
                    </motion.div>
                </Container>
            </Section>
        </div>
    );
};

export default FaqsPage;
