import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';

export const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-300 font-sans">
            <Seo title="Terms of Service" description="Read our terms of service." />
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
                <h1 className="text-4xl font-serif text-white mb-8">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: December 24, 2025</p>

                <section className="space-y-8 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Wishprise ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service. We reserve the right to modify
                            these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>
                            Wishprise is a free online platform that allows users to create interactive, personalized birthday
                            surprise experiences. Users can upload images, record audio messages, write personalized text, and
                            share a unique link with their intended recipient. The service includes features such as 3D cake
                            animations, scratch-to-reveal cards, and one-time view functionality.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                        <p className="mb-4">When using Wishprise, you agree to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Use the service only for lawful purposes.</li>
                            <li>Not upload any content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
                            <li>Not upload content that infringes on intellectual property rights of others.</li>
                            <li>Not attempt to interfere with or disrupt the service or servers.</li>
                            <li>Not use the service to send spam or unsolicited messages.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Content Ownership</h2>
                        <p>
                            You retain ownership of any content you upload to Wishprise (images, audio, text). By uploading
                            content, you grant us a limited, non-exclusive license to store, display, and transmit that content
                            solely for the purpose of providing the Service. We do not claim ownership of your content and will
                            not use it for any purpose other than delivering your birthday surprise.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Content Moderation</h2>
                        <p>
                            We reserve the right to remove any content that violates these terms or that we deem inappropriate,
                            without prior notice. We are not responsible for monitoring all user-generated content but may do so
                            at our discretion.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. One-Time View Feature</h2>
                        <p>
                            Wishprise offers a "one-time view" feature where uploaded media may be automatically deleted after
                            the recipient views it. By using this feature, you understand and agree that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li>Content may be permanently deleted after viewing.</li>
                            <li>We cannot guarantee recovery of deleted content.</li>
                            <li>You should keep your own backup of important files.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Advertisements</h2>
                        <p>
                            Wishprise is a free service supported by advertisements. By using the Service, you agree to the
                            display of ads provided by Google AdSense and other advertising partners. These ads may be
                            personalized based on your browsing activity. You can opt out of personalized ads through your
                            browser settings or Google's ad preferences.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided "as is" without warranties of any kind, either express or implied. We do not
                            guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for
                            any loss of data or content.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Wishprise shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages arising out of or related to your use of the Service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at:{' '}
                            <a href="mailto:octaacebusiness@gmail.com" className="text-magical-400 hover:underline">
                                octaacebusiness@gmail.com
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
