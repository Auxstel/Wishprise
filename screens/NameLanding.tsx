import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Landing3D } from '../components/Landing3D';
import { Logo } from '../components/Logo';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import { Cake } from '../components/Cake';
import { CakeFlavor, CakeStyle } from '../types';

export const NameLanding: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title={`Happy Birthday ${formattedName} - Create a 3D Surprise Wish`}
                description={`Looking for the best way to wish ${formattedName} a happy birthday? Create a stunning, interactive 3D virtual surprise for ${formattedName} for free with Wishprise.`}
                path={`/birthday-wishes-for/${name}`}
            />

            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-slate-950/40 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />
            </div>

            <div className="relative z-20 flex-1 flex flex-col items-center pt-16 md:pt-24 p-6 text-center">
                <div className="backdrop-blur-md bg-white/10 p-6 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-2xl animate-fade-in-up">
                    <Logo size="md" className="mb-6 mx-auto" />
                    
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">
                        Happy Birthday <span className="text-magical-300 font-hand">{formattedName}</span>!
                    </h1>
                    
                    <p className="text-lg text-slate-300 font-serif italic mb-6 opacity-80">
                        Give {formattedName} a digital surprise they'll never forget.
                    </p>

                    {/* Interactive Preview */}
                    <div className="h-64 md:h-80 w-full relative mb-8 rounded-2xl overflow-hidden bg-black/20 border border-white/5">
                        <Cake 
                            receiverName={formattedName}
                            flavor={CakeFlavor.CHOCOLATE}
                            style={CakeStyle.CLASSIC}
                            candles={1}
                            candlesLit={true}
                            isCut={false}
                            onCut={() => {}}
                        />
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-[10px] text-white/40 uppercase tracking-widest pointer-events-none">
                            Interactive 3D Preview
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ButtonWithIcon 
                            text={`Create this Surprise for ${formattedName}`}
                            onClick={() => navigate('/create')}
                            className="w-full text-white py-6 text-lg shadow-glow"
                        />
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                            Free • No Login • Sends via WhatsApp
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 text-left space-y-4">
                        <h2 className="text-white font-semibold text-lg">Send {formattedName} magic today:</h2>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li className="flex gap-2">🎂 <strong>Custom 3D Cake:</strong> Personalized for {formattedName}.</li>
                            <li className="flex gap-2">🎈 <strong>Physics Engine:</strong> They can pop balloons and blow candles.</li>
                            <li className="flex gap-2">💌 <strong>Secret Message:</strong> Include a heartfelt personal note.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer className="relative z-20 py-8 text-center text-slate-600 text-sm">
                <p>© 2026 Wishprise. Crafted with love.</p>
            </footer>
        </div>
    );
};
