import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const BirthdayTraditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="Birthday Traditions Around the World - Wishprise"
                description="From nose-greasing in Canada to ear-pulling in Italy, discover the most unique and fascinating birthday traditions from across the globe."
                path="/resources/birthday-traditions-around-the-world"
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
                    <div className="text-magical-400 text-sm font-bold tracking-wider uppercase mb-4">March 20, 2026 • Culture</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">Birthday Traditions Around the World</h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p>
                        While the cake-and-candles routine is a global phenomenon, many cultures have their own unique ways of celebrating the anniversary of one's birth. 
                        Some are rowdy, some are symbolic, and all of them are fascinating. Let's take a trip around the globe.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Canada: The Greasy Nose</h2>
                    <p>
                        In many parts of Canada, particularly the Atlantic provinces, it's tradition to "grease the nose" of the birthday person. 
                        Friends and family will ambush the person and smear butter or margarine on their nose. 
                        Why? The legend says it makes them "too slippery for bad luck to stick."
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Mexico: La Mordida</h2>
                    <p>
                        After the candles are blown out and the birthday song is sung, it's time for "La Mordida." 
                        The birthday person has their hands tied behind their back and is forced to take the first bite of the cake without utensils. 
                        Naturally, this usually ends with their face being shoved into the frosting by a helpful relative.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">China: Longevity Noodles</h2>
                    <p>
                        In China, birthdays are often celebrated with a bowl of "Longevity Noodles." 
                        These are exceptionally long noodles that represent a long and healthy life. 
                        The trick is to slurp the noodle down without breaking it—breaking the noodle is considered bad luck!
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Italy: The Ear Pull</h2>
                    <p>
                        If you're celebrating a birthday in Italy, watch your ears. 
                        It's common for friends to pull the birthday person's earlobes once for every year they have been alive. 
                        It's a playful way to wish someone a long life (and maybe a bit of a workout for your ears).
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Vietnam: Everyone's Birthday is Tet</h2>
                    <p>
                        In Vietnam, traditional birthdays weren't always celebrated on the individual's birth date. 
                        Instead, everyone's age was considered to increase by one year on Tet (the Vietnamese New Year). 
                        A baby born just days before Tet would be considered two years old shortly after birth!
                    </p>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border-l-4 border-magical-500 mt-12">
                        <h3 className="text-xl text-white font-bold mb-2">Create Your Own Tradition</h3>
                        <p className="mb-6">Start a new digital tradition with a 3D surprise that bridges any distance.</p>
                        <Link to="/create" className="inline-block bg-magical-600 hover:bg-magical-500 text-white font-bold px-6 py-2 rounded-full transition-colors">
                            Build a Surprise
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
