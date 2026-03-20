import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const SmallBirthdayTips: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="How to Make a Small Birthday Feel Huge - Wishprise"
                description="Small budget? Few guests? No problem. Here are 5 ways to create a high-impact, memorable birthday celebration without the stress."
                path="/resources/how-to-make-a-small-birthday-feel-huge"
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
                    <div className="text-magical-400 text-sm font-bold tracking-wider uppercase mb-4">March 20, 2026 • Advice</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">How to Make a Small Birthday Feel Huge</h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p>
                        Not every birthday needs a rented ballroom and a 100-person guest list. 
                        In fact, some of the most memorable celebrations are the ones that are intimate, focused, and deeply personal. 
                        Here is how to maximize the magic on a small scale.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">1. The Power of Presence</h2>
                    <p>
                        When you have fewer guests, the quality of interaction increases. 
                        Instead of trying to talk to everyone, you can actually *be* with everyone. 
                        Plan a shared activity like a board game tournament, a movie marathon, or a deep-dive conversation over a great meal.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">2. Level Up the Details</h2>
                    <p>
                        Because you aren't spending a fortune on catering for 50, you can spend a little more on high-quality details for 5. 
                        Get the *really* good champagne, the artisan cake from the boutique bakery, or even personalized party favors that actually mean something.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">3. Decorate the Senses</h2>
                    <p>
                        Mood lighting, a curated playlist, and maybe even a specific scent (like a nice candle) can transform a living room into an event space. 
                        Total immersion doesn't require a large square footage—it just requires thought.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">4. Create a "Digital Grand Stand"</h2>
                    <p>
                        Even if the physical room is small, the digital space is infinite. 
                        Projecting a 3D birthday surprise onto a TV screen or sharing it on a tablet makes the moment feel spectacular. 
                        It adds that "wow" factor that guests will remember long after the night is over.
                    </p>

                    <h2 className="text-2xl text-white font-semibold mt-12 mb-4">5. The Heartfelt Tribute</h2>
                    <p>
                        Take a moment to have everyone say one thing they appreciate about the birthday person. 
                        In a large group, this is awkward; in a small group, it's a powerful emotional gift that no physical object can replace.
                    </p>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border-l-4 border-magical-500 mt-12">
                        <h3 className="text-xl text-white font-bold mb-2">Small Scale, Big Impact</h3>
                        <p className="mb-6">Scale up the digital magic for your next intimate celebration.</p>
                        <Link to="/create" className="inline-block bg-magical-600 hover:bg-magical-500 text-white font-bold px-6 py-2 rounded-full transition-colors">
                            Create Big Magic
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
