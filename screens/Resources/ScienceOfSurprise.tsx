import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const ScienceOfSurprise: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="The Science of Surprises: Why We Love Them - Wishprise"
                description="Discover the neurochemistry and psychology behind the feeling of surprise and why birthday surprises are so effective."
                path="/resources/the-science-of-surprises"
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
                    <div className="text-magical-400 text-sm font-bold tracking-wider uppercase mb-4">March 20, 2026 • Psychology</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">The Science of Surprises: Why We Love Them</h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p>
                        What happens in your brain when you walk into a room and everyone yells "Surprise!"? 
                        It's not just a social convention; it's a physiological event. 
                        Let's dive into the fascinating world of neurochemistry and see why surprises are so powerful.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">The Dopamine Hit</h2>
                    <p>
                        Our brains are survival machines designed to predict the future. 
                        When something unexpected happens, the "prediction error" triggers a surge of dopamine. 
                        Interestingly, research suggests that an unexpected reward releases significantly more dopamine than a reward we saw coming. 
                        This is why a surprise gift often feels "better" than one we asked for.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Intensified Emotion</h2>
                    <p>
                        Surprise is a "multiplier" emotion. It effectively acts as a volume knob for whatever emotion follows it. 
                        If you are surprised and then feel joy, the joy is amplified. 
                        This is why the reveal of a birthday surprise creates such a high-impact memory—your brain is primed to pay attention and feel more deeply.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Bonds and Social Connection</h2>
                    <p>
                        Psychologically, a surprise signal that someone knows you deeply. 
                        To pull off a successful surprise, the giver must understand the receiver's likes, dislikes, and schedule. 
                        This act of shared vulnerability and planning strengthens social bonds and fosters a sense of being valued and loved.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">The Digital Surprise Edge</h2>
                    <p>
                        In our hyper-connected world, we often expect a text or a call. 
                        The unexpectedness of a custom 3D link vs. an expected WhatsApp message creates that "prediction error" dopamine surge. 
                        It breaks the routine and forces the brain into a state of delightful novelty.
                    </p>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border-l-4 border-magical-500 mt-12">
                        <h3 className="text-xl text-white font-bold mb-2">Hack the Brain</h3>
                        <p className="mb-6">Ready to trigger a dopamine surge? Create a personalized 3D experience today.</p>
                        <Link to="/create" className="inline-block bg-magical-600 hover:bg-magical-500 text-white font-bold px-6 py-2 rounded-full transition-colors">
                            Surprise Them
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
