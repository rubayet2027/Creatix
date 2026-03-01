import { useState } from 'react';
import { HiChevronDown, HiQuestionMarkCircle } from 'react-icons/hi';
import Container from './layout/Container';

const faqs = [
    {
        question: 'How do I participate in a contest?',
        answer: 'Browse available contests on the Explore page, find one that matches your skills, pay the entry fee (if applicable), and submit your work before the deadline. Winners are selected by contest creators based on quality and creativity.',
    },
    {
        question: 'What types of contests are available?',
        answer: 'Creatix offers 18+ contest categories including Image Design, Article Writing, UI/UX Design, Logo Design, Hackathons, Photography, Video Editing, Music Production, App Development, Data Science, and AI/ML Challenges.',
    },
    {
        question: 'How do winners receive their prizes?',
        answer: 'Prize money is distributed to the top 3 winners based on the contest\'s prize distribution (default: 50%, 30%, 20%). Winnings are credited to your Creatix balance, which you can withdraw to your linked payment method.',
    },
    {
        question: 'Can I create my own contests?',
        answer: 'Yes! Apply for a Creator role from your dashboard. Once approved by an admin, you can create contests with custom rules, prizes, and deadlines. Creators fund the prize pool and select winners.',
    },
    {
        question: 'Is there an entry fee for contests?',
        answer: 'Entry fees vary by contest — some are free, while others require a small fee set by the creator. Paid contests typically offer larger prize pools. All payments are securely processed via Stripe.',
    },
    {
        question: 'How is the judging process handled?',
        answer: 'Contest creators review all submissions after the deadline and select up to 3 winners. Submissions are evaluated based on creativity, quality, adherence to the brief, and the specific criteria outlined in each contest.',
    },
    {
        question: 'What happens if a contest is cancelled?',
        answer: 'If a contest is cancelled before the deadline, all participants receive a full refund of their entry fees. Creatix ensures fair treatment for all participants in such cases.',
    },
    {
        question: 'Is my personal information secure?',
        answer: 'Absolutely. We use Firebase Authentication for secure login, encrypt all sensitive data, and follow industry-standard security practices including rate limiting, input sanitization, and HTTPS encryption.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="section-padding">
            <Container>
                <div className="section-header">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--primary-light)] text-[var(--primary)] mb-4">
                        FAQ
                    </span>
                    <h2 className="text-h2 mb-4">Frequently Asked Questions</h2>
                    <p className="text-subheading max-w-2xl mx-auto">
                        Everything you need to know about Creatix contests, payments, and participation.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="card-base overflow-hidden"
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--hover-overlay)] transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <div className="flex items-center gap-3">
                                    <HiQuestionMarkCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                                    <span className="font-semibold text-[var(--text-primary)]">
                                        {faq.question}
                                    </span>
                                </div>
                                <HiChevronDown
                                    className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-5 pb-5 pl-13 text-body leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FAQ;
