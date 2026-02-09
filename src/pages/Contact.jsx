import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import toast from 'react-hot-toast';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
        setIsSubmitting(false);
    };

    const contactInfo = [
        {
            icon: HiMail,
            label: 'Email',
            value: 'support@creatix.com',
            href: 'mailto:support@creatix.com',
        },
        {
            icon: HiPhone,
            label: 'Phone',
            value: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
        },
        {
            icon: HiLocationMarker,
            label: 'Address',
            value: '123 Creative Street, San Francisco, CA',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-primary-100">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 space-y-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    Contact Information
                                </h2>
                                {contactInfo.map((item) => (
                                    <div key={item.label} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="font-medium text-[var(--text-primary)] hover:text-primary-600 transition-colors"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="font-medium text-[var(--text-primary)]">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Social Links */}
                                <div className="pt-6 border-t border-[var(--border-color)]">
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">Follow us</p>
                                    <div className="flex gap-3">
                                        {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 transition-colors"
                                            >
                                                {social[0]}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                                    Send us a Message
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Name *
                                            </label>
                                            <input
                                                {...register('name', { required: 'Name is required' })}
                                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="Your name"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address'
                                                    }
                                                })}
                                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="your@email.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            {...register('subject', { required: 'Subject is required' })}
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="How can we help?"
                                        />
                                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            {...register('message', { required: 'Message is required' })}
                                            rows={5}
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                                    >
                                        <HiPaperAirplane className="w-5 h-5" />
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </div>
    );
};

export default Contact;
