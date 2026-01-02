import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';

export const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-300 font-sans">
            <Seo title="Contact Us" description="Get in touch with the Wishprise team." />

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
            <main className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif text-white mb-8">Contact Us</h1>
                <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                    We'd love to hear from you. Whether you have a question about creating a surprise,
                    feedback on our features, or just want to say hello, we're here to help.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 hover:border-magical-500/30 transition-colors">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📧</span> Email Us
                        </h3>
                        <p className="text-gray-400 mb-4">For general inquiries and support:</p>
                        <a href="mailto:octaacebusiness@gmail.com" className="text-magical-400 hover:text-white transition-colors text-lg font-medium">
                            octaacebusiness@gmail.com
                        </a>
                    </div>

                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 hover:border-magical-500/30 transition-colors">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🤝</span> Partnerships
                        </h3>
                        <p className="text-gray-400 mb-4">For business and advertising opportunities:</p>
                        <a href="mailto:octaacebusiness@gmail.com" className="text-magical-400 hover:text-white transition-colors text-lg font-medium">
                            octaacebusiness@gmail.com
                        </a>
                    </div>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-serif text-white">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <details className="group bg-slate-900/30 rounded-xl border border-white/5 open:bg-slate-900/50 open:border-white/10 transition-all">
                            <summary className="p-6 cursor-pointer font-medium text-white flex justify-between items-center list-none">
                                <span>I found a bug, how do I report it?</span>
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                                Please email us with a description of the issue, the device you are using, and screenshots if possible. We appreciate your help in making Wishprise better!
                            </div>
                        </details>

                        <details className="group bg-slate-900/30 rounded-xl border border-white/5 open:bg-slate-900/50 open:border-white/10 transition-all">
                            <summary className="p-6 cursor-pointer font-medium text-white flex justify-between items-center list-none">
                                <span>How can I delete my data?</span>
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                                Wishprise automatically deletes surprise content after it is viewed (if it's a private link). If you need manual deletion, please email support with the surprise link.
                            </div>
                        </details>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 p-6 text-center text-gray-600 text-sm">
                <p>Wishprise © 2026. All rights reserved.</p>
                <div className="mt-4 space-x-6">
                    <Link to="/terms" className="hover:text-magical-400 transition-colors">Terms</Link>
                    <Link to="/privacy" className="hover:text-magical-400 transition-colors">Privacy</Link>
                    <Link to="/contact" className="hover:text-magical-400 transition-colors">Contact</Link>
                </div>
            </footer>
        </div>
    );
};
