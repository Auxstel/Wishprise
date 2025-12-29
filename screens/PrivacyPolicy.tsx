import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-300 font-sans">
            <Seo title="Privacy Policy" description="Read our privacy policy to understand how we handle your data." />
            {/* Header */}
            <header className="border-b border-white/10 p-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <Logo size="sm" />
                    </Link>
                    <Link to="/" className="text-magical-400 hover:text-magical-300 transition-colors text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif text-white mb-8">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: December 24, 2025</p>

                <section className="space-y-8 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Wishprise ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
                            transparency about how we handle your data. This Privacy Policy explains what information we collect,
                            how we use it, and your rights regarding your data.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-4">When you use Wishprise, we may collect the following types of information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Content You Create:</strong> Messages, images, and audio files you upload to create birthday surprises.</li>
                            <li><strong>Usage Data:</strong> Anonymous analytics about how you interact with our service (e.g., pages visited, features used).</li>
                            <li><strong>Device Information:</strong> Browser type, device type, and IP address for security and optimization purposes.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide and maintain our birthday surprise creation service.</li>
                            <li>Store and deliver your created surprises to recipients.</li>
                            <li>Improve our service through anonymous analytics.</li>
                            <li>Display relevant advertisements through Google AdSense.</li>
                            <li>Prevent fraud and ensure the security of our platform.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage & Retention</h2>
                        <p>
                            Your birthday surprises are stored on our secure servers powered by Supabase. Surprise content
                            (images, audio, messages) may be automatically deleted after being viewed by the recipient,
                            depending on the settings you choose during creation. We do not retain personal data longer than
                            necessary to provide our services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
                        <p className="mb-4">We use the following third-party services:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Supabase:</strong> For secure database and file storage.</li>
                            <li><strong>Vercel:</strong> For hosting our web application.</li>
                            <li><strong>Google AdSense:</strong> To display advertisements. Google may use cookies to serve ads based on your browsing history.</li>
                            <li><strong>Google Analytics:</strong> To understand how users interact with our service.</li>
                        </ul>
                        <p className="mt-4">
                            You can learn more about Google's data practices at{' '}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-magical-400 hover:underline">
                                https://policies.google.com/privacy
                            </a>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Request access to the personal data we hold about you.</li>
                            <li>Request correction or deletion of your data.</li>
                            <li>Opt out of personalized advertising.</li>
                            <li>Withdraw consent at any time.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
                        <p>
                            Wishprise is not intended for children under 13 years of age. We do not knowingly collect
                            personal information from children under 13. If you believe we have collected such information,
                            please contact us immediately.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:support@wishprise.online" className="text-magical-400 hover:underline">
                                support@wishprise.online
                            </a>
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 p-6 text-center text-gray-600 text-sm">
                <p>Wishprise © 2025. All rights reserved.</p>
                <div className="mt-2 space-x-4">
                    <Link to="/terms" className="text-magical-400 hover:underline">Terms of Service</Link>
                    <Link to="/privacy" className="text-magical-400 hover:underline">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
};
