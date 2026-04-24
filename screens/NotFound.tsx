import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import { Footer } from '../components/Footer';

export const NotFound: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <div className="min-h-screen bg-slate-950 text-gray-300 font-sans flex flex-col">
            <Seo
                title="Page Not Found"
                description="The page you were looking for does not exist on Wishprise. Head back to the homepage or browse our birthday resources."
                path={pathname}
                noindex
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

            <main className="flex-1 max-w-3xl mx-auto px-6 py-24 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-magical-400 mb-4">404</p>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">This page took a different path.</h1>
                <p className="text-lg text-gray-400 mb-10">
                    We couldn't find anything at <code className="text-magical-300 break-all">{pathname}</code>.
                    It may have moved, or the link you followed might be out of date.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-magical-100 transition-colors shadow-lg"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        to="/create"
                        className="px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                        Create a Surprise
                    </Link>
                    <Link
                        to="/resources"
                        className="px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                        Browse Resources
                    </Link>
                </div>

                <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4">Popular destinations</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <li><Link to="/about" className="text-magical-300 hover:underline">About Wishprise</Link></li>
                        <li><Link to="/ai-wishes" className="text-magical-300 hover:underline">AI Birthday Wish Generator</Link></li>
                        <li><Link to="/poster" className="text-magical-300 hover:underline">Birthday Poster Maker</Link></li>
                        <li><Link to="/space-birthday" className="text-magical-300 hover:underline">NASA Space Birthday</Link></li>
                        <li><Link to="/resources/virtual-birthday-ideas-2026" className="text-magical-300 hover:underline">Virtual Birthday Ideas</Link></li>
                        <li><Link to="/contact" className="text-magical-300 hover:underline">Contact Us</Link></li>
                    </ul>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
