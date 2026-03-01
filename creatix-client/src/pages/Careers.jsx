import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { HiArrowRight, HiLocationMarker, HiClock } from 'react-icons/hi';

const Careers = () => {
    const jobs = [
        { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'San Francisco, CA (Hybrid)', type: 'Full-time' },
        { title: 'Product Designer', department: 'Design', location: 'Remote (US)', type: 'Full-time' },
        { title: 'Community Manager', department: 'Marketing', location: 'London, UK', type: 'Full-time' },
        { title: 'Backend Developer Intern', department: 'Engineering', location: 'Remote (Global)', type: 'Internship' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Join the <span className="text-primary-600">Creatix</span> Team
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Help us build the ultimate platform for creative professionals. We are looking for passionate people to join our mission.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 md:p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-primary-500/50 rounded-2xl transition-all hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                                            {job.department}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)] text-sm">
                                        <div className="flex items-center gap-1"><HiLocationMarker /> {job.location}</div>
                                        <div className="flex items-center gap-1"><HiClock /> {job.type}</div>
                                    </div>
                                </div>
                                <div className="relative z-10 md:text-right">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-tertiary)] group-hover:bg-primary-600 group-hover:text-white text-[var(--text-primary)] rounded-xl transition-all font-medium">
                                        Apply Now <HiArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>
        </div>
    );
};

export default Careers;
