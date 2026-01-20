import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const MessageEtiquette: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="Birthday Message Etiquette: What to Write - Wishprise"
                description="Stuck on what to say? Tips and templates for writing perfect birthday wishes for friends, family, and coworkers."
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
                    <div className="text-magical-400 text-sm font-bold tracking-wider uppercase mb-4">Jan 10, 2026 • Advice</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">Birthday Message Etiquette: What to Write</h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p>
                        The blinking cursor. The blank page. We have all been there.
                        You want to say something meaningful, but "Happy Birthday" feels too short, and a long essay feels too intense.
                        Here is a cheat sheet for every relationship type.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">For Close Friends (The Roast)</h2>
                    <p>
                        Close friends don't need formality. They need humor and affection.
                        Acknowledge the aging process but keep it light.
                        <br /><br />
                        <em>"Happy Birthday! I was going to make an age joke, but I figured you've reached the age where that's just hurtful now."</em>
                        <br />
                        <em>"Here's to another year of us causing trouble and blaming it on being young (even though we aren't anymore)."</em>
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">For Professional Contacts (The Classy)</h2>
                    <p>
                        Keep it brief, polite, and positive. Avoid overly personal jokes unless you are actually friends outside of work.
                        <br /><br />
                        <em>"Wishing you a fantastic birthday and a successful year ahead!"</em>
                        <br />
                        <em>"Happy Birthday, [Name]. Hope you get some well-deserved relaxation today."</em>
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">For Family (The Sentimental)</h2>
                    <p>
                        This is the place to be vulnerable. Mention a specific memory.
                        <br /><br />
                        <em>"Happy Birthday to the one who taught me everything I know. I still remember [Specific Memory]. Love you."</em>
                        <br />
                        <em>"Wishing the happiest of birthdays to my favorite sibling (don't tell the others)."</em>
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">The "Belated" Apology</h2>
                    <p>
                        You forgot. It happens. Own it, but don't make it a tragedy.
                        <br /><br />
                        <em>"I know I'm late, but I didn't want to overwhelm you with all the other wishes yesterday. Happy Belated!"</em>
                        <br />
                        <em>"Happy Birthday! (I'm not late, I'm just operating on a different time zone... in my head)."</em>
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">Pro Tip: Use Voice</h2>
                    <p>
                        If you really can't think of what to write... don't write.
                        Use the <strong>Audio Recording</strong> feature on Wishprise.
                        Simply saying "Happy Birthday, I barely made it through the year without you" carries so much more weight when spoken.
                        The tone of your voice conveys the emotion that text lacks.
                    </p>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border-l-4 border-magical-500 mt-12">
                        <h3 className="text-xl text-white font-bold mb-2">Say it with Wishprise</h3>
                        <p className="mb-6">Draft your perfect message inside a 3D card.</p>
                        <Link to="/create" className="inline-block bg-magical-600 hover:bg-magical-500 text-white font-bold px-6 py-2 rounded-full transition-colors">
                            Write Your Wish
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
