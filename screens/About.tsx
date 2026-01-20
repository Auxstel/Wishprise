import React from 'react';
import { Seo } from '../components/Seo';
import { Logo } from '../components/Logo';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="About Wishprise - Our Mission to Make Birthdays Magical"
                description="Learn about Wishprise's mission to eliminate boring text wishes and replace them with magical, interactive 3D experiences. Free, fast, and fun."
            />

            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo size="sm" />
                </Link>
                <Link to="/" className="text-white font-medium hover:text-magical-300 transition-colors">
                    Back to Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Reimagining the Birthday Wish</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-magical-500 to-purple-600 mx-auto rounded-full"></div>
                </header>

                <div className="space-y-12 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl text-white font-semibold mb-4">The Problem with "HBD"</h2>
                        <p>
                            We've all been there. It's your best friend's birthday. You want to show them you care, but you act fast. You type "Happy Birthday!" or maybe just "HBD 🎂" and hit send.
                            It gets lost in a sea of identical messages on their timeline. It feels impersonal. It feels... fleeting.
                        </p>
                        <p className="mt-4">
                            In a world of digital noise, a simple text message just doesn't carry the weight of a true celebration. We believe birthdays deserve more than a notification. They deserve a moment of magic.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl text-white font-semibold mb-4">Enter Wishprise</h2>
                        <p>
                            Wishprise was born from a simple idea: <strong>What if sending a digital greeting felt as special as giving a real gift?</strong>
                        </p>
                        <p className="mt-4">
                            We set out to build a platform that allows anyone, anywhere, to create a stunning, interactive 3D birthday experience in seconds. No complex software, no sign-ups, and absolutely no cost. Just pure, unadulterated joy delivered via a simple link.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl text-white font-semibold mb-4">Our Technology</h2>
                        <p>
                            Under the hood, Wishprise uses advanced WebGL technology (powered by Three.js) to render photorealistic cakes and environments directly in the browser.
                            Whether your loved one is on a high-end gaming PC or a budget smartphone, our optimized engine ensures a silky-smooth experience.
                        </p>
                        <p className="mt-4">
                            We combine this visual fidelity with spatial audio and interactive physics (yes, you can actually blow out the candles!) to create a sense of presence that a static image simply cannot match.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl text-white font-semibold mb-4">Why Free?</h2>
                        <p>
                            We believe that spreading joy shouldn't have a price tag. Our mission is to facilitate 1 million smiles.
                            To keep the lights on and the servers running, we display non-intrusive ads (like the ones you might see on this page), allowing us to keep the core creation tools free for everyone, forever.
                        </p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-2xl border border-white/10 mt-12">
                        <h3 className="text-xl text-white font-semibold mb-4">Ready to Create Magic?</h3>
                        <p className="mb-6">
                            Join thousands of others who have upgraded from "HBD" to "OMG". It takes less than a minute to create a memory that lasts a lifetime.
                        </p>
                        <Link to="/create" className="inline-block bg-white text-slate-900 font-bold px-8 py-3 rounded-full hover:bg-magical-300 transition-colors">
                            Create a Surprise Now
                        </Link>
                    </section>
                </div>
            </main>

            <footer className="py-12 border-t border-white/10 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Wishprise. All rights reserved.</p>
            </footer>
        </div>
    );
};
