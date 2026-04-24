import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '../../components/Seo';
import { Schema } from '../../components/Schema';
import { Landing3D } from '../../components/Landing3D';
import { Logo } from '../../components/Logo';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import HowItWorks from '../../components/HowItWorks';
import { Footer } from '../../components/Footer';

export const LongDistanceBirthday: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title="Best Virtual Birthday Surprise for Long Distance | Wishprise"
                description="The ultimate long-distance birthday surprise tool. Create a 3D interactive magic gift for your partner or friend. No shipping, just pure 3D magic via link."
                path="/long-distance-birthdays"
            />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Long Distance Birthday Surprise Guide & Tool",
                "description": "How to celebrate a birthday when you are miles apart using 3D interactive technology.",
                "publisher": {
                    "@type": "Organization",
                    "name": "Wishprise"
                }
            }} />

            {/* Hero Section */}
            <div className="relative h-[80vh] w-full flex flex-col">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-slate-900/10 to-slate-950 z-10 pointer-events-none"></div>
                    <Landing3D />
                </div>

                <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="backdrop-blur-md bg-white/10 p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-[0_0_80px_rgba(168,85,247,0.2)] animate-fade-in-up w-full max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-[0.2em] uppercase mb-8">
                            Distance is just a number
                        </span>
                        
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">
                            Celebrate Together, <span className="text-magical-300 font-hand text-5xl md:text-7xl">Miles Apart</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-white font-serif italic mb-8 opacity-90 leading-relaxed">
                            No shipping required. No delays. Just a <strong>magical 3D surprise</strong> that feels like you're right there with them.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <ButtonWithIcon
                                text="Start Long Distance Surprise ✨"
                                onClick={() => navigate('/create')}
                                className="scale-110 shadow-[0_0_40px_rgba(168,85,247,0.4)] text-white"
                            />
                            <p className="text-xs uppercase tracking-widest text-white/40 mt-4">
                                🌎 Works Globally • ⚡ Instant Delivery • ❤️ 100% Free
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emotional Content */}
            <div className="relative z-20 bg-slate-950 py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-16 text-gray-300">
                    <section className="text-center">
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">How to Surprise Someone from Afar</h2>
                        <p className="text-lg leading-relaxed">
                            Physical gifts are great, but they take time and can get lost in the mail. 
                            <strong> Wishprise</strong> delivers emotional impact instantly. Our 3D interactive layers 
                            create a sense of presence—as if they're unwrapping a gift you're holding in your hands.
                        </p>
                    </section>

                    <HowItWorks />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <h3 className="text-xl font-serif text-white mb-4">For Partners</h3>
                            <p className="text-sm opacity-80">Add a voice note telling them how much you miss them. Our 3D audio makes it feel like you're whispering in their ear.</p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <h3 className="text-xl font-serif text-white mb-4">For Family</h3>
                            <p className="text-sm opacity-80">Send a group surprise! Tell everyone to contribute a "wheel promise" like 'a big hug when we meet'.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-slate-950 pt-12 pb-4 px-6 text-center">
                <Logo size="sm" />
                <p className="text-gray-600 text-sm mt-4">Wishprise — Connecting hearts across any distance.</p>
            </div>
            <Footer />
        </div>
    );
};
