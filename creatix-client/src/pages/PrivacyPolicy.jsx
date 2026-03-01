import Container from '../components/layout/Container';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Privacy Policy</h1>
                        <p className="text-white/70">Last updated: March 1, 2026</p>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="max-w-3xl mx-auto py-12 md:py-16 space-y-8">
                    <section>
                        <h2 className="text-h3 mb-4">1. Information We Collect</h2>
                        <p className="text-body mb-3">
                            When you create an account on Creatix, we collect information you provide directly, including your name, email address, profile photo, and any biographical information you choose to share. If you register using Google Sign-In, we receive your Google profile information.
                        </p>
                        <p className="text-body">
                            We also collect information automatically when you use the platform, including your IP address, browser type, device information, pages visited, and actions taken (such as contests viewed, submissions made, and payments processed).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">2. How We Use Your Information</h2>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>To create and manage your Creatix account</li>
                            <li>To process contest entries, submissions, and payments via Stripe</li>
                            <li>To display leaderboards and public contest results</li>
                            <li>To send you notifications about contest updates, winners, and platform news</li>
                            <li>To improve our platform, features, and user experience</li>
                            <li>To prevent fraud, abuse, and enforce our Terms of Service</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">3. Payment Information</h2>
                        <p className="text-body">
                            Payment processing on Creatix is handled entirely by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your full credit card number, CVV, or bank account details on our servers. Stripe processes your payment information securely, and we only receive confirmation of transaction success or failure along with a transaction reference ID.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">4. Data Sharing</h2>
                        <p className="text-body mb-3">
                            We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information with:
                        </p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li><strong>Service providers:</strong> Firebase (authentication), Stripe (payments), MongoDB Atlas (data storage), and Vercel (hosting)</li>
                            <li><strong>Contest creators:</strong> Your submission content and display name are visible to contest creators for judging purposes</li>
                            <li><strong>Public profiles:</strong> Your name, photo, and contest statistics may be displayed on leaderboards and winner announcements</li>
                            <li><strong>Legal requirements:</strong> When required by law, court order, or governmental regulation</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">5. Data Security</h2>
                        <p className="text-body">
                            We implement industry-standard security measures to protect your data, including Firebase Authentication for secure login, HTTPS encryption for all data in transit, input sanitization against XSS and NoSQL injection attacks, rate limiting to prevent abuse, and Helmet.js for HTTP security headers. While no system is completely impervious, we continuously monitor and improve our security practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">6. Your Rights</h2>
                        <p className="text-body mb-3">You have the right to:</p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>Access and download your personal data</li>
                            <li>Update or correct your profile information</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt out of non-essential communications</li>
                            <li>Request information about how your data is used</li>
                        </ul>
                        <p className="text-body mt-3">
                            To exercise any of these rights, please contact us through our contact form or email us at privacy@creatix.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">7. Cookies & Local Storage</h2>
                        <p className="text-body">
                            Creatix uses browser local storage to save your theme preference (light/dark mode) and authentication tokens. We do not use tracking cookies for advertising. Firebase may set essential cookies for authentication functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">8. Changes to This Policy</h2>
                        <p className="text-body">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Your continued use of Creatix after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="pt-4 border-t border-[var(--border-color)]">
                        <p className="text-body">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@creatix.com" className="text-[var(--primary)] hover:underline">
                                privacy@creatix.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
};

export default PrivacyPolicy;
