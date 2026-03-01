import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';

const ContestRules = () => {
    const rules = [
        { title: "Originality Requirement", text: "All submitted work must be 100% original and created entirely by the participant. Submitting plagiarized, stolen, or improperly licensed third-party assets will result in immediate disqualification and a permanent account ban." },
        { title: "AI Generation Policy", text: "Unless explicitly stated otherwise in the contest brief, AI-generated content (including but not limited to Midjourney, ChatGPT, or GitHub Copilot outputs) must be fully disclosed upon submission. Some contests strictly prohibit AI assets." },
        { title: "Submission Deadlines", text: "Submissions must be finalized before the exact date and time specified on the contest page. The system will automatically reject late entries. We recommend submitting at least 2 hours prior to the deadline." },
        { title: "Prize Distribution", text: "Upon winning, funds will be released to the winner's wallet. Creators must successfully complete any requested handover of source files (e.g. PSD, Figma, Source Code) within 48 hours for the prize to clear escrow." },
        { title: "Multiple Entries", text: "Participants may submit multiple unique entries to a single contest unless the contest specifically limits submissions to 1 per user. Do not submit slight variations of the same design as multiple entries." },
        { title: "Respectful Conduct", text: "Harassment, spamming, or attempting to artificially manipulate votes (where applicable) will lead to disqualification. Maintain professionalism in the comments and respect the contest creator's final decision." }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Global <span className="text-amber-500">Contest Rules</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            To ensure a fair and competitive environment, all participants must adhere to these policies.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {rules.map((rule, index) => (
                            <motion.div
                                key={rule.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 md:p-8 bg-[var(--bg-secondary)] border border-amber-500/20 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors"
                                style={{ counterIncrement: "rule-counter" }}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-amber-500 pointer-events-none transition-opacity group-hover:opacity-20">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 relative z-10">{rule.title}</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed relative z-10">{rule.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 text-center text-[var(--text-muted)] text-sm max-w-2xl mx-auto">
                        Note: Individual contest creators may add additional rules in their contest brief. The specific brief rules take precedence over these global rules where conflicts arise.
                    </motion.div>
                </Container>
            </Section>
        </div>
    );
};

export default ContestRules;
