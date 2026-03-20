import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const PartyPlanningChecklist: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="Modern Birthday Party Planning Checklist 2026 - Wishprise"
                description="The ultimate checklist for planning the perfect birthday party in 2026. From budget to digital invites, we've got you covered."
                path="/resources/modern-birthday-party-planning-checklist-2026"
            />

            <nav className="p-6 flex justify-between items-center max-w-4xl mx-auto border-b border-white/5">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo size="sm" />
                </Link>
                <Link to="/resources" className="text-white font-medium hover:text-magical-300 transition-colors">
                    Back to Resources
                </Link>
            </nav>

            <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 leading-loose">
                <header className="mb-12">
                    <div className="text-magical-400 text-sm font-bold tracking-wider uppercase mb-4">March 20, 2026 • Planning</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">Modern Birthday Party Planning Checklist 2026</h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p>
                        Planning a party doesn't have to be stressful. In 2026, we have more tools than ever to make organization a breeze. 
                        Follow this timeline to ensure your next celebration is legendary.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">4 Weeks Before: The Foundation</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Set the Budget:</strong> Be realistic about what you want to spend.</li>
                        <li><strong>Choose the Date & Time:</strong> Consider your "VIP" guests' schedules.</li>
                        <li><strong>Select a Venue:</strong> Home, park, or a rented space?</li>
                        <li><strong>Draft the Guest List:</strong> Start collecting those digits!</li>
                    </ul>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">3 Weeks Before: The Vibes</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Pick a Theme:</strong> Y2K, Galactic, Minimalist, or maybe "Surprise!"</li>
                        <li><strong>Send Digital Invites:</strong> Save paper and get instant RSVPs.</li>
                        <li><strong>Plan the Menu:</strong> Consider allergies and dietary restrictions.</li>
                        <li><strong>Book Entertainment:</strong> DJ, magician, or just a really good playlist.</li>
                    </ul>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">2 Weeks Before: The Details</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Order the Cake:</strong> Or plan your DIY masterpiece.</li>
                        <li><strong>Shop for Decor:</strong> Balloons, streamers, and mood lighting.</li>
                        <li><strong>Plan Activities:</strong> Games or a designated "magic" moment.</li>
                        <li><strong>Coordinate Help:</strong> Ask a friend to be the designated photographer.</li>
                    </ul>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">1 Week Before: The Final Stretch</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Confirm RSVPs:</strong> Chase down the stragglers.</li>
                        <li><strong>Buy Last-Minute Supplies:</strong> Ice, drinks, and snacks.</li>
                        <li><strong>Prep the Playlist:</strong> Test your speaker setup.</li>
                        <li><strong>Create a Wishprise:</strong> Set up a custom 3D surprise for the big reveal.</li>
                    </ul>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border-l-4 border-magical-500 mt-12">
                        <h3 className="text-xl text-white font-bold mb-2">The Ultimate Reveal</h3>
                        <p className="mb-6">Don't forget the digital grand finale. Schedule your surprise link here.</p>
                        <Link to="/create" className="inline-block bg-magical-600 hover:bg-magical-500 text-white font-bold px-6 py-2 rounded-full transition-colors">
                            Prepare Surprise
                        </Link>
                    </div>
                </div>
            </article>

            <footer className="py-12 border-t border-white/10 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Wishprise. All rights reserved.</p>
            </footer>
        </div>
    );
};
