import { useState } from 'react';
import { HiMail, HiSparkles, HiCheckCircle } from 'react-icons/hi';
import Container from './layout/Container';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSubmitted(true);
        setIsLoading(false);
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <section className="section-padding relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 opacity-95" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydi0ySDI2djJoOHptMCA0di0ySDI2djJoOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

            <Container className="relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
                        <HiSparkles className="w-4 h-4" />
                        Stay Updated
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Never Miss a Contest
                    </h2>
                    <p className="text-lg text-white/80 mb-8 leading-relaxed">
                        Get notified about new contests, trending categories, and exclusive opportunities
                        delivered straight to your inbox. No spam — just creative inspiration.
                    </p>

                    {isSubmitted ? (
                        <div className="flex items-center justify-center gap-3 py-4 text-white">
                            <HiCheckCircle className="w-6 h-6 text-emerald-300" />
                            <span className="text-lg font-medium">You&apos;re subscribed! Check your inbox.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <div className="relative flex-1">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-primary-700/30 border-t-primary-700 rounded-full animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    'Subscribe'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-sm text-white/50 mt-4">
                        Join 2,000+ creators. Unsubscribe anytime.
                    </p>
                </div>
            </Container>
        </section>
    );
};

export default Newsletter;
