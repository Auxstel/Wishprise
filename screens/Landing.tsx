import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AdComponent } from '../components/AdComponent';
import { Landing3D } from '../components/Landing3D';
import { Logo } from '../components/Logo';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
      
      {/* SECTION 1: HERO (Full Screen) */}
      <div className="relative h-screen w-full flex flex-col">
        
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-900/10 to-slate-950 z-10 pointer-events-none"></div>
             <Landing3D />
        </div>

        {/* Logo Header (Absolute) */}
        <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-center">
             {/* Small logo for mobile/header if we wanted, but we center the big one. Keeping this area clean or for login later. */}
        </div>

        {/* Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6 text-center">
            
            <div className="backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.15)] animate-fade-in-up max-w-3xl mx-auto flex flex-col items-center">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-glow">
                    The #1 Birthday Experience
                </span>
                
                <div className="mb-4 transform hover:scale-105 transition-transform duration-500">
                    <Logo size="xl" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-light text-white mt-4 drop-shadow-lg">
                    Make it <span className="text-magical-300 font-hand text-4xl">Magical</span>
                </h2>
                
                <p className="text-lg md:text-xl text-purple-100/80 font-light mt-6 max-w-xl mx-auto leading-relaxed">
                    Create a stunning, interactive 3D birthday surprise for someone you love. <br/>
                    <span className="italic text-white opacity-60">No login required. Free forever.</span>
                </p>

                <div className="mt-12 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-magical-500 to-amber-300 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <Button 
                        onClick={() => navigate('/create')} 
                        className="relative px-12 py-5 bg-black/20 hover:bg-black/30 backdrop-blur-xl border border-white/20 text-white text-lg rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-3 font-serif tracking-widest uppercase hover:border-white/40 hover:scale-[1.02] active:scale-95"
                    >
                         <span className="text-magical-300 group-hover:text-white transition-colors text-xl">✨</span>
                         <span className="text-sm md:text-base font-bold">Create a Surprise</span>
                         <span className="text-magical-300 group-hover:text-white transition-colors text-xl">✨</span>
                    </Button>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
      </div>

      {/* SECTION 2: TESTIMONIALS (Dark Footer) */}
      <div className="relative z-20 bg-slate-950 py-24 px-6 border-t border-white/5">
         <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16 space-y-4">
                 <h2 className="text-3xl md:text-5xl font-serif text-white">Moments of Joy</h2>
                 <p className="text-gray-400">Join thousands who made their loved ones smile with Wishprise.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {/* Review 1 */}
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -top-4 left-8 text-4xl">🎂</div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed pt-4">
                        "I sent this to my boyfriend who is deployed. He said it was the best part of his day. The 3D cake blowing part is genius!"
                    </p>
                    <div className="flex items-center space-x-4 border-t border-slate-800 pt-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">J</div>
                        <div>
                            <p className="text-white font-bold text-sm">Jessica M.</p>
                            <p className="text-gray-500 text-xs">Created a Chocolate Cake</p>
                        </div>
                    </div>
                </div>

                {/* Review 2 */}
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -top-4 left-8 text-4xl">✨</div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed pt-4">
                        "My mom isn't tech-savvy but she absolutely loved scratching the card to see my message. Simple, elegant, and free."
                    </p>
                    <div className="flex items-center space-x-4 border-t border-slate-800 pt-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">D</div>
                        <div>
                            <p className="text-white font-bold text-sm">David K.</p>
                            <p className="text-gray-500 text-xs">Created a Vanilla Cake</p>
                        </div>
                    </div>
                </div>

                {/* Review 3 */}
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="absolute -top-4 left-8 text-4xl">💖</div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed pt-4">
                        "The music sync and the reveal animation were beautiful. Much better than a boring e-card or a text message."
                    </p>
                    <div className="flex items-center space-x-4 border-t border-slate-800 pt-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">S</div>
                        <div>
                            <p className="text-white font-bold text-sm">Sarah L.</p>
                            <p className="text-gray-500 text-xs">Created a Grand Tiered Cake</p>
                        </div>
                    </div>
                </div>
             </div>
             
             <div className="mt-20 text-center border-t border-slate-900 pt-10">
                 <p className="text-gray-600 text-sm">Wishprise © 2024. Crafted with love.</p>
             </div>
         </div>
      </div>
      
      {/* Sticky Ad Banner */}
      <div className="sticky bottom-0 z-50">
         <AdComponent type="banner" className="bg-black/80 backdrop-blur text-gray-500 border-t border-white/10" />
      </div>
    </div>
  );
};
