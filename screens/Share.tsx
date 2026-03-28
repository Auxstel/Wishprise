import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurprise } from '../services/storageService';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import { SurpriseData } from '../types';
import { Landing3D } from '../components/Landing3D';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import RateUsModal from '../components/RateUsModal';
import ShareCarousel from '../components/ShareCarousel';
import GiftThemBack from '../components/GiftThemBack';
import CakeLoader from '../components/CakeLoader';

export const Share: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surprise, setSurprise] = useState<SurpriseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await getSurprise(id);
          setSurprise(data);
        } catch (e) {
          console.error("Failed to load surprise", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <CakeLoader />
    </div>
  );
  
  if (!surprise) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
       <div className="text-6xl mb-6">🕯️</div>
       <p className="font-serif italic text-white/40 text-xl tracking-tight">The magic seems to have faded...</p>
       <button onClick={() => navigate('/')} className="mt-8 text-magical-400 underline uppercase text-[10px] font-black tracking-[0.3em]">Return Home</button>
    </div>
  );

  const shareUrl = `${window.location.origin}/view/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (!localStorage.getItem('wishprise_rating_seen')) {
      setIsRatingModalOpen(true);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsapp = () => {
    const text = `Hey ${surprise.receiverName}! I made a special birthday surprise for you. Open this on your phone: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300 relative">
      <RateUsModal 
        isOpen={isRatingModalOpen} 
        onClose={() => setIsRatingModalOpen(false)} 
        surpriseId={id || ''} 
      />
      <ShareCarousel />
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <Seo title="Your Surprise is Ready!" path={`/share/${id}`} />

      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-slate-950/80 to-slate-950 z-10"></div>
        <Landing3D />
      </div>

      <div className="max-w-xl w-full animate-fade-in relative z-20 text-center space-y-12">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer hover:scale-105 transition-transform duration-300 inline-block mb-4"
        >
          <Logo size="md" />
        </div>

        <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">It's <span className="text-magical-300 font-hand text-6xl md:text-8xl">Ready!</span></h2>
            <p className="text-slate-400 font-serif italic text-xl leading-relaxed">Your surprise for <span className="text-magical-300 font-hand text-3xl md:text-4xl mx-1">{surprise.receiverName}</span> is glowing with magic.</p>
        </div>

        <div className="backdrop-blur-3xl bg-white/[0.02] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden space-y-12">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-magical-600/[0.05] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="space-y-8">
              <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 break-all text-xs text-white/40 font-mono tracking-widest select-all shadow-inner">
                  {shareUrl}
              </div>

              <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                      <ButtonWithIcon 
                          text={copied ? "Link Copied!" : "Copy Magical Link ✨"} 
                          onClick={handleCopy}
                          className="w-full text-white shadow-magical-600/30 py-8"
                      />
                  </div>
                  
                  <button 
                      onClick={handleWhatsapp}
                      className="w-full py-4 rounded-full border border-white/5 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all font-serif italic text-lg shadow-lg"
                  >
                      Share via WhatsApp
                  </button>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-6">
                  <button
                      onClick={() => navigate(`/view/${id}?preview=true`)}
                      className="text-[10px] font-black text-magical-400/50 hover:text-magical-300 uppercase tracking-[0.4em] transition-colors"
                  >
                      Preview the magic yourself
                  </button>

                  <p className="text-[10px] text-slate-500 font-serif italic leading-relaxed max-w-xs mx-auto">
                      🔒 This surprise is private and will gracefully fade away after they've experienced it.
                  </p>
              </div>
            </div>

            {/* FEEDBACK SECTION REMOVED (Now a Modal) */}

            <GiftThemBack />
        </div>
      </div>
    </div>
  </div>
  );
};