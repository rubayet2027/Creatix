import { motion } from 'framer-motion';
import { HiCheck, HiStar } from 'react-icons/hi';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';

const Pricing = () => {
    const plans = [
        {
            name: 'Creator Basic',
            price: 'Free',
            description: 'Perfect for new creators getting started.',
            features: ['Participate in free contests', 'Basic community access', 'Standard profile view', 'Email support'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro Creator',
            price: '$12',
            period: '/month',
            description: 'For serious creators looking to maximize earnings.',
            features: ['Priority support', 'Early access to premium contests', 'Featured profile badge', 'Zero withdrawal fees', 'Advanced analytics'],
            cta: 'Upgrade to Pro',
            popular: true,
        },
        {
            name: 'Agency / Brand',
            price: '$99',
            period: '/month',
            description: 'Host your own contests and find top talent.',
            features: ['Host unlimited contests', 'Custom contest branding', 'Dedicated account manager', 'API access', 'Whitelabel emails'],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
            <Section>
                <Container>
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                            Simple, Transparent <span className="text-primary-600">Pricing</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Choose the perfect plan to fuel your creative journey.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular
                                        ? 'border-primary-500 bg-[var(--bg-secondary)] shadow-xl shadow-primary-500/10'
                                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full">
                                        <HiStar className="w-4 h-4" /> Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                                <p className="text-[var(--text-secondary)] mb-6 min-h-[48px]">{plan.description}</p>

                                <div className="mb-8">
                                    <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                                    {plan.period && <span className="text-[var(--text-secondary)]">{plan.period}</span>}
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                                            <HiCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg shadow-primary-500/25 hover:-translate-y-1'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
                                    }`}>
                                    {plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>
        </div>
    );
};

export default Pricing;
