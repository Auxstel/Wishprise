import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Landing3D } from '../components/Landing3D';
import { Logo } from '../components/Logo';
import ButtonWithIcon from '@/components/ui/button-witn-icon';

export const RelationshipLanding: React.FC = () => {
    const { relationship } = useParams<{ relationship: string }>();
    const navigate = useNavigate();
    
    const relMap: Record<string, string> = {
        'friend': 'Best Friend',
        'sister': 'Sister',
        'brother': 'Brother',
        'mom': 'Mom',
        'dad': 'Dad',
        'girlfriend': 'Girlfriend',
        'boyfriend': 'Boyfriend',
        'boss': 'Boss',
        'coworker': 'Coworker'
    };

    const displayRel = relationship ? (relMap[relationship.toLowerCase()] || relationship.charAt(0).toUpperCase() + relationship.slice(1).toLowerCase()) : 'Someone Special';

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title={`Best Birthday Wishes for ${displayRel} - Create a 3D Surprise`}
                description={`Looking for meaningful birthday wishes for your ${displayRel}? Send an interactive 3D birthday surprise instead of a boring text. 100% Free and magical.`}
                path={`/birthday-wishes-for/my/${relationship}`}
            />

            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-950/40 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />
            </div>

            <div className="relative z-20 flex-1 flex flex-col items-center pt-24 md:pt-32 p-6 text-center">
                <div className="backdrop-blur-md bg-white/10 p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-2xl animate-fade-in-up">
                    <Logo size="lg" className="mb-8" />
                    
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">
                        Birthday Wishes for <span className="text-magical-300 font-hand">{displayRel}</span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 font-serif italic mb-10 leading-relaxed">
                        Don't just send a message. Send a 3D experience that your {displayRel} will never forget.
                    </p>

                    <div className="space-y-6">
                        <ButtonWithIcon 
                            text={`Create a Surprise for my ${displayRel}`}
                            onClick={() => navigate('/create')}
                            className="w-full text-white py-6 text-lg"
                        />
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/10 text-left space-y-6">
                        <h2 className="text-white font-semibold text-xl">Tips for wishing your {displayRel}</h2>
                        <div className="grid gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <h3 className="text-magical-300 font-bold text-sm mb-1 uppercase tracking-widest">Funny Tone</h3>
                                <p className="text-slate-400 text-sm italic">"Happy birthday! I was going to get you something amazing, but then I remembered having me as a friend is gift enough."</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <h3 className="text-magical-300 font-bold text-sm mb-1 uppercase tracking-widest">Emotional Tone</h3>
                                <p className="text-slate-400 text-sm italic">"To the person who makes every day brighter. May your birthday be as magical as the impact you have on my life."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="relative z-20 py-8 text-center text-slate-600 text-sm">
                <p>© 2026 Wishprise. Making connections magical.</p>
            </footer>
        </div>
    );
};
