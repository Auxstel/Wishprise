import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Schema } from '../components/Schema';
import { Landing3D } from '../components/Landing3D';
import { Logo } from '../components/Logo';
import { Link } from 'react-router-dom';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import { Footer } from '../components/Footer';

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
        'colleague': 'Colleague',
        'coworker': 'Coworker',
        'nephew': 'Nephew',
        'niece': 'Niece',
        'daughter': 'Daughter',
        'son': 'Son (Bete)',
        'bhabhi': 'Sister-in-law (Bhabhi)',
        'sister-in-law': 'Sister-in-law',
        'chote-bhai': 'Younger Brother'
    };

    const displayRel = relationship ? (relMap[relationship.toLowerCase()] || relationship.charAt(0).toUpperCase() + relationship.slice(1).toLowerCase()) : 'Someone Special';

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title={`Best Birthday Wishes for ${displayRel} 2026 - Send a 3D Surprise`}
                description={`Looking for the best way to wish your ${displayRel}? Birthday wish karne ka naya tarika! Send an interactive 3D birthday surprise with music. 100% Free.`}
                path={`/birthday-wishes-for/my/${relationship}`}
            />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `How to wish my ${displayRel} happy birthday in a unique way?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `The best way (naya tarika) to wish your ${displayRel} is by sending an interactive 3D birthday surprise link via WhatsApp. It includes a 3D cake, music, and a personalized message.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Is Wishprise free for sending wishes to ${displayRel}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, Wishprise is 100% free to use for everyone. You can create and share unlimited surprises."
                        }
                    }
                ]
            }} />

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

                    <div className="mt-12 pt-12 border-t border-white/10 text-left space-y-8">
                        <section>
                            <h2 className="text-white font-semibold text-xl mb-4">Tips for wishing your {displayRel}</h2>
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
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white font-semibold text-xl">The Modern Way to Wish</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Forget the old way of sending simple text messages or static images. In 2026, the trend is all about 
                                <strong> interactive experiences</strong>. Wishprise allows you to create a virtual 3D world for your 
                                {displayRel} that they can open right in their browser. It's the most modern and memorable way to say Happy Birthday.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white font-semibold text-xl">Explore Other Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(relMap).slice(0, 10).map(([key, label]) => (
                                    <Link 
                                        key={key} 
                                        to={`/birthday-wishes-for/my/${key}`}
                                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-magical-300 transition-colors"
                                    >
                                        Wishes for {label}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer variant="transparent" />
        </div>
    );
};
