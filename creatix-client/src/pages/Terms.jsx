import Container from '../components/layout/Container';

const Terms = () => {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Terms of Service</h1>
                        <p className="text-white/70">Last updated: March 1, 2026</p>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="max-w-3xl mx-auto py-12 md:py-16 space-y-8">
                    <section>
                        <h2 className="text-h3 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-body">
                            By accessing or using Creatix, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform. Creatix reserves the right to modify these terms at any time, and continued use of the platform constitutes acceptance of any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">2. Account Registration</h2>
                        <p className="text-body mb-3">
                            To participate in contests or create them, you must register for a Creatix account. You agree to:
                        </p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain the security of your password and account credentials</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                        <p className="text-body mt-3">
                            You must be at least 18 years old to create an account. Creatix reserves the right to suspend or terminate accounts that violate these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">3. Contest Participation</h2>
                        <p className="text-body mb-3">When participating in contests, you agree that:</p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>All submissions must be your original work unless otherwise specified by the contest brief</li>
                            <li>You will not submit plagiarized, stolen, or AI-generated content (unless the contest explicitly allows it)</li>
                            <li>Entry fees are non-refundable once the contest deadline has passed, unless the contest is cancelled</li>
                            <li>Contest results and winner selections by creators are final</li>
                            <li>Prize money distribution follows the contest&apos;s stated distribution percentages</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">4. Contest Creation</h2>
                        <p className="text-body mb-3">
                            Users with Creator status may create contests on Creatix. As a contest creator, you agree to:
                        </p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>Provide clear, accurate contest descriptions and judging criteria</li>
                            <li>Fund the full prize pool before the contest is published</li>
                            <li>Review all submissions fairly and declare winners within 7 days after the deadline</li>
                            <li>Not create contests for illegal, discriminatory, or harmful purposes</li>
                            <li>Respect the intellectual property rights of participants</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">5. Payments & Refunds</h2>
                        <p className="text-body mb-3">
                            All payments on Creatix are processed securely through Stripe. By making a payment, you agree to Stripe&apos;s terms of service in addition to ours.
                        </p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>Entry fees are charged at the time of registration for a contest</li>
                            <li>Prize winnings are credited to your Creatix balance upon winner declaration</li>
                            <li>Refunds for cancelled contests are processed within 5-10 business days</li>
                            <li>Creatix may charge a platform fee on contest entry fees (clearly disclosed before payment)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">6. Intellectual Property</h2>
                        <p className="text-body">
                            You retain ownership of all content you submit to contests on Creatix. By submitting content, you grant Creatix a non-exclusive, worldwide license to display your submission on the platform for contest judging and showcase purposes. Contest creators receive the rights specified in their contest brief upon declaring winners and distributing prizes. If no specific rights are mentioned, the default is a non-exclusive license for the winning submission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">7. Prohibited Conduct</h2>
                        <p className="text-body mb-3">You agree not to:</p>
                        <ul className="space-y-2 text-body list-disc list-inside">
                            <li>Use the platform for any illegal or unauthorized purpose</li>
                            <li>Submit false, misleading, or fraudulent information</li>
                            <li>Attempt to manipulate contest results through fake accounts or coordinated activity</li>
                            <li>Harass, threaten, or abuse other users</li>
                            <li>Attempt to gain unauthorized access to other accounts or platform systems</li>
                            <li>Scrape, crawl, or use automated tools to extract data from the platform</li>
                            <li>Upload viruses, malware, or other harmful code</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">8. Account Termination</h2>
                        <p className="text-body">
                            Creatix reserves the right to suspend or permanently ban accounts that violate these Terms of Service. Banned users forfeit any pending prize money. You may also delete your account at any time from your profile settings. Upon account deletion, your personal data will be removed, though submissions to completed contests may remain for record-keeping purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">9. Limitation of Liability</h2>
                        <p className="text-body">
                            Creatix is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of prize money due to technical issues, disputes between participants and creators, or unauthorized access to your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-h3 mb-4">10. Governing Law</h2>
                        <p className="text-body">
                            These Terms of Service are governed by applicable laws. Any disputes arising from these terms or your use of Creatix shall be resolved through binding arbitration, except where prohibited by law.
                        </p>
                    </section>

                    <section className="pt-4 border-t border-[var(--border-color)]">
                        <p className="text-body">
                            If you have questions about these Terms, please contact us at{' '}
                            <a href="mailto:legal@creatix.com" className="text-[var(--primary)] hover:underline">
                                legal@creatix.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
};

export default Terms;
