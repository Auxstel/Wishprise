import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '../../components/Seo';
import { Schema } from '../../components/Schema';
import { Landing3D } from '../../components/Landing3D';
import { Logo } from '../../components/Logo';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import HowItWorks from '../../components/HowItWorks';
import { Footer } from '../../components/Footer';

export const WhatsappSurprise: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title="Send a Birthday Surprise via WhatsApp Link | 3D Magic"
                description="The best way to send a birthday surprise via WhatsApp. Create a stunning 3D interactive link for free. No login required. Perfect for long-distance friends."
                path="/whatsapp-birthday-surprise"
            />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "How to Send a Birthday Surprise via WhatsApp Link",
                "description": "A step-by-step guide and tool to create interactive 3D birthday surprises shareable via WhatsApp.",
                "publisher": {
                    "@type": "Organization",
                    "name": "Wishprise"
                }
            }} />

            {/* Hero Section */}
            <div className="relative h-[80vh] w-full flex flex-col">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-slate-900/10 to-slate-950 z-10 pointer-events-none"></div>
                    <Landing3D />
                </div>

                <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="backdrop-blur-md bg-white/10 p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-[0_0_80px_rgba(34,197,94,0.2)] animate-fade-in-up w-full max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold tracking-[0.2em] uppercase mb-8">
                            WhatsApp Surprise Specialist
                        </span>
                        
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">
                            The Perfect <span className="text-green-400 font-hand text-5xl md:text-7xl">WhatsApp</span> Birthday Surprise
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-white font-serif italic mb-8 opacity-90 leading-relaxed">
                            Stop sending boring "Happy Birthday" texts. <br/>
                            Send an <strong>interactive 3D experience</strong> they can open right in their chat.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <ButtonWithIcon
                                text="Create My WhatsApp Surprise ✨"
                                onClick={() => navigate('/create')}
                                className="scale-110 shadow-[0_0_40px_rgba(34,197,94,0.4)] text-white"
                            />
                            <p className="text-xs uppercase tracking-widest text-white/40 mt-4">
                                🔒 No Login • ⚡ Free Forever • 📱 Mobile Ready
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialized Content */}
            <div className="relative z-20 bg-slate-950 py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-16 text-gray-300">
                    <section className="text-center">
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Why Send a Surprise via Link?</h2>
                        <p className="text-lg leading-relaxed">
                            When you send a text, it's just a notification. When you send a <strong>Wishprise link</strong> on WhatsApp, 
                            it generates a beautiful preview that invites them into a different world. They'll experience a 3D cake, 
                            music, and your personal message in a way a text message never could.
                        </p>
                    </section>

                    <HowItWorks />

                    <section className="bg-slate-900/50 p-10 rounded-[2rem] border border-slate-800">
                        <h2 className="text-3xl font-serif text-white mb-6">WhatsApp Sharing Tips</h2>
                        <ul className="space-y-4 list-disc pl-6">
                            <li><strong>Wait for the Preview:</strong> When you paste the link, wait 2 seconds for the image to load before hitting send.</li>
                            <li><strong>Add a Mystery Intro:</strong> Say something like "I made this for you, open it when you're alone! 🤫"</li>
                            <li><strong>Full Volume:</strong> Remind them to turn their sound on for the full musical experience.</li>
                        </ul>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-slate-950 pt-12 pb-4 px-6 text-center">
                <Logo size="sm" />
                <p className="text-gray-600 text-sm mt-4">Wishprise — Making WhatsApp birthdays magical.</p>
            </div>
            <Footer />
        </div>
    );
};
