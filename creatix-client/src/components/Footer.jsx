import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaDiscord } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const footerLinks = {
    Platform: [
      { label: 'All Contests', to: '/all-contests' },
      { label: 'Leaderboard', to: '/leaderboard' },
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'Pricing', to: '/pricing' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Press Kit', to: '/press' },
    ],
    Support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Community', to: '/community' },
    ],
    Legal: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Contest Rules', to: '/rules' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaDiscord, href: 'https://discord.com', label: 'Discord' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">Creatix</span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              The ultimate platform for creative contests. Discover exciting challenges,
              showcase your talent, and win amazing prizes.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@creatix.com"
                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <HiMail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>support@creatix.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <HiPhone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <HiLocationMarker className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[var(--text-primary)] font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[var(--text-secondary)] hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Subscribe to get notified about new contests and winners.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              &copy; {currentYear} Creatix. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] hover:bg-primary-600 text-[var(--text-secondary)] hover:text-white flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;