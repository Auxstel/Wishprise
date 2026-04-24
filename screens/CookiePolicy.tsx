import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import { Footer } from '../components/Footer';

export const CookiePolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-300 font-sans flex flex-col">
            <Seo
                title="Cookie Policy - Wishprise"
                description="How Wishprise uses cookies and similar technologies, what Google AdSense and Google Analytics place on your device, and how you can control them."
                path="/cookies"
            />

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

            <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif text-white mb-4">Cookie Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: April 24, 2026</p>

                <section className="space-y-8 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They let the site remember
                            your actions and preferences (such as whether you have dismissed our cookie banner) and help third-party
                            services measure traffic or serve relevant advertising. This page explains which cookies and similar
                            technologies Wishprise uses, why we use them, and how you can control them.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Cookies We Set Directly</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong>wishprise_cookie_consent</strong> — stored in your browser's <code>localStorage</code>
                                (not a traditional cookie) the moment you dismiss or accept our banner. We use it only to
                                avoid showing the banner again. It contains no personal information.
                            </li>
                            <li>
                                <strong>Session state</strong> — while you are creating a surprise we keep a short-lived
                                identifier in memory so the /create, /share and /view flows can reference the same draft.
                                It is cleared when you close the tab.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Cookies</h2>
                        <p className="mb-4">We use the following third-party services, each of which may set its own cookies:</p>
                        <ul className="list-disc list-inside space-y-3 ml-4">
                            <li>
                                <strong>Google AdSense</strong> — ad serving, frequency capping and measurement. AdSense may
                                use cookies and the IAB Transparency &amp; Consent Framework to personalise ads based on your
                                interests. Our publisher ID is <code>ca-pub-4046935924897443</code>.
                            </li>
                            <li>
                                <strong>Google Analytics (GA4 — G-5NWLEH3DRG)</strong> — aggregated usage analytics so we can
                                understand which pages and features are used. IP addresses are anonymised by Google before storage.
                            </li>
                            <li>
                                <strong>Supabase</strong> — when you create a surprise we set a session token to identify your
                                draft. We do not use this token for advertising or analytics.
                            </li>
                            <li>
                                <strong>Vercel</strong> — our hosting provider may set operational cookies required to route
                                traffic and protect the site from abuse.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. How We Categorise Cookies</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Strictly necessary:</strong> required for the site to function (session state, Vercel routing).</li>
                            <li><strong>Preference:</strong> remember choices you have made (cookie banner dismissal).</li>
                            <li><strong>Analytics:</strong> help us measure and improve the service (Google Analytics).</li>
                            <li><strong>Advertising:</strong> used by Google AdSense to display and measure ads.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. How to Control Cookies</h2>
                        <p className="mb-4">You have several ways to manage cookies and tracking:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                Adjust your ad preferences in Google's{' '}
                                <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-magical-400 hover:underline">
                                    Ads Settings
                                </a>
                                {' '}or opt out of personalised advertising through the{' '}
                                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-magical-400 hover:underline">
                                    Digital Advertising Alliance
                                </a>
                                {' '}and{' '}
                                <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-magical-400 hover:underline">
                                    Your Online Choices
                                </a>.
                            </li>
                            <li>
                                Block or delete cookies in your browser settings — every modern browser has controls under
                                Privacy or Security. Disabling cookies may affect site functionality.
                            </li>
                            <li>
                                Use browser-level privacy features such as Safari Intelligent Tracking Prevention or
                                Firefox Enhanced Tracking Protection.
                            </li>
                            <li>
                                Clear the <code>wishprise_cookie_consent</code> entry from your browser's site storage to
                                see our banner again.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Do Not Track</h2>
                        <p>
                            Wishprise does not currently respond to browser Do Not Track (DNT) signals because there is no
                            common industry standard for how DNT should behave. We instead rely on the controls described above
                            and on consent signals forwarded to Google.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
                        <p>
                            We may update this Cookie Policy as our services evolve or as regulations change. Material changes
                            will be reflected in the "Last updated" date at the top of this page. Continued use of Wishprise
                            after an update constitutes acceptance of the revised policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
                        <p>
                            Questions about cookies or this policy? Email us at{' '}
                            <a href="mailto:octaacebusiness@gmail.com" className="text-magical-400 hover:underline">
                                octaacebusiness@gmail.com
                            </a>
                            . You can also review our{' '}
                            <Link to="/privacy" className="text-magical-400 hover:underline">Privacy Policy</Link>
                            {' '}and{' '}
                            <Link to="/terms" className="text-magical-400 hover:underline">Terms of Service</Link>.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
