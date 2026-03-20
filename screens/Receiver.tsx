import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getSurprise } from '../services/storageService';
import { AudioHandler } from '../services/audioService';
import { SurpriseData, ExperienceStep, CakeStyle } from '../types';
import { WHEEL_MESSAGES, DEMO_MUSIC_URL } from '../constants';
import { Cake } from '../components/Cake';
import { Button } from '../components/Button';

import { ImmersiveScene } from '../components/ImmersiveScene';
import { ScratchCard } from '../components/ScratchCard';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import RateUs from '../components/RateUs';
import ButtonWithIcon from '@/components/ui/button-witn-icon';

export const Receiver: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [data, setData] = useState<SurpriseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [step, setStep] = useState<ExperienceStep>(ExperienceStep.LANDING);

  // Interactive States
  const [typedText, setTypedText] = useState("");
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState("");

  // Candle States
  const [candlesLit, setCandlesLit] = useState(true);
  const [micActive, setMicActive] = useState(false);

  const [isCut, setIsCut] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);


  // Balloon Logic
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [burstCount, setBurstCount] = useState(0);

  const balloons = [
    { id: 0, word: "It's" },
    { id: 1, word: "Your" },
    { id: 2, word: "Birthday!" }
  ];

  const audioHandler = useRef(new AudioHandler());
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const s = await getSurprise(id);
          if (s) {
            setData(s);
          } else {
            // Surprise was already viewed or expired
            setExpired(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data) {
      const audioSource = data.songUrl || DEMO_MUSIC_URL;
      musicRef.current = new Audio(audioSource);
      musicRef.current.loop = false;
      musicRef.current.volume = 0.5;
    }

    return () => {
      musicRef.current?.pause();
      audioHandler.current.stop();
    };
  }, [data]);

  // -- ONE-TIME VIEW LOGIC --
  useEffect(() => {
    // If the user reaches the REVEAL step (End of experience), DELETE EVERYTHING.
    // BUT only if:
    // 1. It is not a preview (crucial!)
    // 2. We have an ID and data
    // 3. We haven't already marked it (idempotency handled by delete function gracefully)
    if (step === ExperienceStep.REVEAL && !isPreview && data && id && id !== 'demo') {
      import('../services/storageService').then(({ deleteSurpriseAndFiles }) => {
        deleteSurpriseAndFiles(id, data.songUrl, data.voiceMessageUrl);
      });
    }
  }, [step, isPreview, data, id]);

  // -- LOGIC: INTRO --
  const startJourney = () => {
    setStep(ExperienceStep.INTRO_ANIMATION);
  };

  const handlePop = (balloonId: number) => {
    if (poppedBalloons.includes(balloonId)) return;
    setBurstCount(prev => prev + 1);
    setPoppedBalloons(prev => [...prev, balloonId]);
  };

  useEffect(() => {
    if (step === ExperienceStep.INTRO_ANIMATION && data) {
      const text = `${data.introMessage}`;
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(text.slice(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setTimeout(() => setStep(ExperienceStep.INTERACTIVE_CHECK), 3000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, data]);

  // -- LOGIC: WHEEL --
  const wheelOptions = (data?.wheelOptions && data.wheelOptions.filter(o => o.trim()).length > 0)
    ? data.wheelOptions.filter(o => o.trim())
    : WHEEL_MESSAGES;

  const segmentAngle = 360 / wheelOptions.length;
  const wheelColors = ['#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF'];

  const spinWheel = () => {
    if (wheelSpinning || wheelResult) return;
    setWheelSpinning(true);
    const randomIndex = Math.floor(Math.random() * wheelOptions.length);
    const selected = wheelOptions[randomIndex];
    const extraSpins = 1800;
    const targetRotation = extraSpins - (randomIndex * segmentAngle + segmentAngle / 2);
    setRotation(targetRotation);
    setTimeout(() => {
      setWheelSpinning(false);
      setWheelResult(selected);
    }, 3500);
  };

  const continueFromWheel = () => setStep(ExperienceStep.CANDLES);

  // -- LOGIC: CANDLES --
  const playCelebrationMusic = () => {
    if (musicRef.current) {
      musicRef.current.currentTime = 0;
      musicRef.current.volume = 0.5;
      musicRef.current.play()
        .then(() => {
          setBgMusicPlaying(true);
        })
        .catch(e => console.log("Audio autoplay blocked", e));
    }
  };

  const handleSuccessfulBlow = () => {
    // Immediate success
    setCandlesLit(false);
    audioHandler.current.stop();
    playCelebrationMusic();
    // Move to cutting step after a delay to show clapping characters
    setTimeout(() => setStep(ExperienceStep.CAKE_CUTTING), 2000);
  };

  const requestMic = async () => {
    const granted = await audioHandler.current.initMicrophone();
    if (granted) {
      setMicActive(true);
      const checkBlow = setInterval(() => {
        if (audioHandler.current.isBlowing(50) && candlesLit) {
          handleSuccessfulBlow();
          clearInterval(checkBlow);
        }
      }, 100);
    } else {
      alert("Microphone access needed to blow candles! Or just tap them.");
    }
  };

  const manualBlow = () => {
    if (!candlesLit) return;
    handleSuccessfulBlow();
  };

  const handleCut = () => {
    setIsCut(true);
    setTimeout(() => setShowGift(true), 2500);
  };

  const openGift = () => setStep(ExperienceStep.REVEAL);


  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading magic...</div>;

  if (expired || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 max-w-md w-full space-y-6">
        <div className="text-6xl">✨</div>
        <h1 className="text-3xl font-serif text-white">This surprise has already been opened</h1>
        <p className="text-gray-400">Birthday surprises on Wishprise are one-time experiences. This one has already been viewed by its recipient, or it has expired.</p>
        <Button onClick={() => navigate('/')} variant="primary" className="w-full">
          Create Your Own Surprise 🎁
        </Button>
      </div>
    </div>
  );

  const allBalloonsPopped = poppedBalloons.length === balloons.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans">
      <Seo 
        title={`A Birthday Surprise!`} 
        description={`Open your magical 3D birthday surprise from someone special.`}
        path={`/view/${id}`}
      />

      <ImmersiveScene
        step={step}
        onInteract={step === ExperienceStep.LANDING && allBalloonsPopped ? startJourney : undefined}
        explosionTrigger={burstCount}
      />

      {/* Branding Overlay */}
      <div className="absolute top-6 left-6 z-20 opacity-80 pointer-events-none">
        <Logo size="sm" />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start z-10 overflow-y-auto pt-32 pb-[350px] custom-scrollbar">
        <div className="pointer-events-auto w-full max-w-lg p-6 flex flex-col items-center">

          {/* LANDING */}
          {step === ExperienceStep.LANDING && (
            <div className="text-center w-full h-full flex flex-col items-center justify-center">


              {!allBalloonsPopped ? (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in z-30 w-full">
                  <div className="flex flex-col items-center justify-center space-y-4 mb-16 animate-fade-in-up">
                    <p className="text-magical-200/60 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold drop-shadow-sm blur-[0.2px]">A special gift for</p>
                    <h1 className="text-6xl md:text-8xl font-hand text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] text-shimmer animate-shimmer leading-none py-2">
                        {data.receiverName}
                    </h1>
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white"></div>
                        <p className="text-[10px] md:text-xs font-serif italic text-white/80 tracking-widest">Sent with love & magic</p>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white"></div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4 w-full h-64">
                    {balloons.map((b, index) => {
                      const isPopped = poppedBalloons.includes(b.id);
                      const colors = ['bg-gradient-to-br from-yellow-300 to-amber-500', 'bg-gradient-to-br from-fuchsia-300 to-purple-600', 'bg-gradient-to-br from-pink-300 to-rose-500'];
                      return (
                        <div key={b.id} className="relative w-24 md:w-32 h-48 flex items-center justify-center">
                          {!isPopped && (
                            <div
                              onClick={() => handlePop(b.id)}
                              className={`absolute cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-float z-20 w-full h-full flex flex-col items-center justify-center`}
                              style={{ animationDelay: `${index * 0.5}s` }}
                            >
                              <div className={`w-20 h-28 md:w-28 md:h-36 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] ${colors[index]} shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3),_5px_5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute top-[20%] left-[20%] w-4 h-8 bg-white/40 rounded-[50%] rotate-[30deg] blur-[2px]"></div>
                                <span className="text-4xl select-none opacity-80 mix-blend-overlay">?</span>
                              </div>
                              <div className="w-[2px] h-12 bg-white/40"></div>
                            </div>
                          )}
                          {isPopped && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <div className="absolute w-32 h-32 border-2 border-white/50 rounded-full animate-[ping_0.6s_ease-out_forwards]"></div>
                              <div className="transform perspective-500 animate-[bounce-subtle_2s_infinite]">
                                <div className="text-3xl md:text-4xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_4px_0_#A21CAF] rotate-x-12">
                                  {b.word}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-8 text-magical-200 text-sm tracking-widest uppercase animate-pulse">Pop all the balloons!</p>
                </div>
              ) : (
                <div className="text-center mt-auto mb-20 animate-fade-in-up space-y-12">
                  <div className="space-y-4">
                    <p className="text-magical-200 text-xs tracking-[0.4em] uppercase opacity-70 font-black drop-shadow-sm">The wait is over</p>
                    <h1 className="text-6xl md:text-8xl font-hand text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-white to-yellow-200 drop-shadow-[0_0_35px_rgba(255,215,0,0.5)] animate-pulse-slow leading-none">
                        It's Your Birthday!
                    </h1>
                  </div>
                  
                  <div className="relative inline-block group">
                    {/* Soft glow behind button */}
                    <div className="absolute inset-0 bg-magical-500/20 blur-[100px] rounded-full group-hover:bg-magical-500/40 transition-all duration-1000 animate-pulse-slow"></div>
                    
                    <ButtonWithIcon 
                        text="Open Your Magical Gift 🎁" 
                        onClick={startJourney}
                        className="relative z-10 px-12 py-10 text-xl shadow-[0_0_70px_rgba(255,255,255,0.4)] hover:shadow-[0_0_90px_rgba(255,255,255,0.6)] transition-all bg-white text-slate-950 font-black"
                    />
                  </div>
                  
                  <p className="text-white/40 font-serif italic text-sm tracking-wide">Tap to see what someone special has for you</p>
                </div>
              )}
            </div>
          )}

          {/* INTRO */}
          {step === ExperienceStep.INTRO_ANIMATION && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
              <div className="text-center p-8 max-w-2xl animate-fade-in space-y-12">
                <div className="space-y-4">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-magical-500 to-transparent mx-auto rounded-full opacity-60"></div>
                  <h2 className="text-xs md:text-sm font-sans font-black text-magical-200 tracking-[0.4em] uppercase opacity-70 mb-2">{data.senderName} has a message for you...</h2>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-magical-500 to-transparent mx-auto rounded-full opacity-60"></div>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    "{typedText}"<span className="animate-pulse text-magical-500 font-sans not-italic">|</span>
                </h1>
              </div>
            </div>
          )}

          {/* CHECK */}
          {step === ExperienceStep.INTERACTIVE_CHECK && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animate-fade-in space-y-16">
              <div className="space-y-6 text-center">
                <h2 className="text-4xl md:text-6xl font-serif italic text-white/90 drop-shadow-2xl animate-pulse-slow">
                    Take a deep breath...
                </h2>
                <p className="text-magical-200/40 text-[10px] tracking-[0.4em] uppercase font-bold">The magic is beginning</p>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-magical-500/10 blur-[80px] rounded-full group-hover:bg-magical-500/30 transition-all duration-1000 animate-pulse-slow"></div>
                <ButtonWithIcon 
                    text="I'm Ready for the Magic ✨" 
                    onClick={() => setStep(ExperienceStep.WHEEL)} 
                    className="relative z-10 px-12 py-8 text-lg rounded-full transition-all duration-500 hover:tracking-widest bg-white text-slate-950 font-black shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          )}

          {/* WHEEL */}
          {step === ExperienceStep.WHEEL && (
            <div className="text-center w-full flex flex-col items-center space-y-6 animate-fade-in pt-8 pb-10">
              <div className="space-y-1">
                <p className="text-magical-200 text-[10px] tracking-[0.4em] uppercase opacity-70 font-black drop-shadow-sm">The wait is over</p>
                <h2 className="text-3xl md:text-5xl font-serif text-white drop-shadow-lg leading-tight italic">Spin for a Surprise</h2>
                <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase font-bold">The stars are aligning for you</p>
              </div>

              <div className="relative group/wheel py-4">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400/10 via-magical-500/10 to-yellow-400/10 rounded-full blur-[80px] opacity-60 group-hover/wheel:opacity-100 transition-opacity duration-1000 animate-pulse-slow pointer-events-none"></div>
                
                <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto p-3 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
                    <div className="w-full h-full rounded-full border-[5px] border-white/20 shadow-[inset_0_0_30px_rgba(255,215,0,0.1)] relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.1, 1)"
                      style={{ 
                        transform: `rotate(${rotation}deg)`, 
                        background: `conic-gradient(${wheelOptions.map((_, i) => `${i % 2 === 0 ? '#FFFFFF' : '#FDF4FF'} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')})` 
                      }}>
                      
                      {wheelOptions.map((opt, i) => (
                        <div key={i} className="absolute inset-0 flex justify-center pt-6 md:pt-14" style={{ transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg)` }}>
                          <div className={`font-serif font-black text-[8px] md:text-xs w-20 md:w-32 text-center leading-tight select-none uppercase tracking-tighter ${i % 2 === 0 ? 'text-magical-800' : 'text-magical-400'}`} >
                            {opt}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Center Magic Jewel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-20 md:h-20 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.9)] z-20 flex items-center justify-center border-4 border-yellow-50/50">
                        <div className="w-6 h-6 md:w-12 md:h-12 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 rounded-full animate-pulse-slow shadow-inner"></div>
                    </div>

                    {/* Premium Pointer (Needle) */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                        <div className="w-1 h-8 md:w-1.5 md:h-10 bg-gradient-to-b from-white to-yellow-400 rounded-full shadow-[0_0_15px_rgba(255,215,0,1)]"></div>
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full -mt-2 border-2 border-yellow-400 shadow-xl"></div>
                    </div>
                </div>
              </div>

              {!wheelResult ? (
                <div className="relative group">
                    <div className="absolute inset-0 bg-magical-500/10 blur-3xl rounded-full group-hover:bg-magical-500/30 transition-all duration-700 pointer-events-none"></div>
                    <ButtonWithIcon 
                        text={wheelSpinning ? "Spelling Magic..." : "Spin for a Gift ✨"} 
                        onClick={spinWheel} 
                        disabled={wheelSpinning} 
                        className="relative z-40 px-10 py-6 md:px-12 md:py-8 bg-white text-slate-950 font-black shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                    />
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in-up w-full max-w-sm px-4">
                  <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-white/10 transform scale-105 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-magical-500/5 pointer-events-none"></div>
                    <p className="text-[9px] text-magical-200 uppercase tracking-[0.3em] font-black mb-2 opacity-60">The stars have chosen</p>
                    <p className="text-2xl md:text-4xl font-hand text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        {wheelResult}
                    </p>
                  </div>
                  <ButtonWithIcon 
                    text="Claim Your Magical Surprise 🎁" 
                    onClick={continueFromWheel} 
                    className="w-full relative z-40 bg-white text-slate-950 font-black shadow-[0_0_50px_rgba(255,215,0,0.5)] py-6"
                  />
                  <p className="text-[10px] text-white/40 italic mt-4 px-6 leading-relaxed text-center animate-fade-in delay-500">
                    "Before you thank me personally, tell me what you got in the spin first!" <br/> — {data?.senderName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CAKE & CANDLES */}
          {step === ExperienceStep.CANDLES && (
            <div className="text-center w-full">
              <div className="h-[400px] w-full relative mb-6">
                <Cake
                  flavor={data.cakeFlavor}
                  style={data.cakeStyle}
                  candles={data.candleCount}
                  candlesLit={candlesLit}
                  isCut={false}
                  onCut={() => { }}
                  receiverName={data.receiverName}
                />
              </div>

              <div className="space-y-8 relative z-20 mt-8 pb-12">
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-serif italic text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    Make a Beautiful Wish
                  </h2>
                  <p className="text-magical-200/60 text-xs md:text-sm max-w-xs mx-auto leading-relaxed px-4">
                    Close your eyes, hold that wish in your heart, and blow out the candles to release the magic.
                  </p>
                </div>

                {candlesLit && (
                  <div className="flex flex-col items-center space-y-8 animate-fade-in-up">
                    {!micActive ? (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-magical-500/10 blur-[60px] rounded-full group-hover:bg-magical-500/30 transition-all duration-1000 animate-pulse-slow pointer-events-none"></div>
                        <ButtonWithIcon 
                            text="Activate Magic Voice 🎙️" 
                            onClick={requestMic} 
                            className="relative z-10 px-10 py-6 bg-slate-900/40 border-white/10 shadow-[0_0_30px_rgba(139,38,242,0.2)]"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3 animate-pulse">
                        <div className="w-14 h-14 rounded-full border-2 border-magical-400/30 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full bg-magical-500/20 animate-ping"></div>
                            <div className="w-3 h-3 rounded-full bg-magical-400 shadow-[0_0_15px_rgba(139,38,242,0.8)]"></div>
                        </div>
                        <p className="text-magical-200 text-[10px] uppercase tracking-[0.4em] font-black blur-[0.1px]">Listening for your magic...</p>
                      </div>
                    )}
                    
                    <button 
                        onClick={manualBlow} 
                        className="text-white/30 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black hover:text-white hover:tracking-[0.4em] transition-all duration-700 group flex flex-col items-center gap-2"
                    >
                        <span>Alternatively, tap to blow ✨</span>
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-16 transition-all"></div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUTTING */}
          {step === ExperienceStep.CAKE_CUTTING && (
            <div className="text-center w-full flex flex-col items-center space-y-8 animate-fade-in group">
              <div className="space-y-3">
                <p className="text-magical-200 text-[10px] tracking-[0.4em] uppercase font-black drop-shadow-sm opacity-70">The magic has spoken</p>
                <h2 className="text-4xl md:text-6xl font-serif italic text-white drop-shadow-2xl leading-tight">
                    {isCut ? "A Beautiful Wish for You... ✨" : "Cut the Cake"}
                </h2>
                {isCut && (
                  <div className="space-y-4 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-center gap-3 opacity-80">
                        <div className="h-[1px] w-4 bg-white/20"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-magical-200">The stars have spoken</p>
                        <div className="h-[1px] w-4 bg-white/20"></div>
                    </div>
                    <p className="text-lg md:text-xl font-serif italic text-white/80">
                        You've won <span className="text-white font-hand text-3xl md:text-4xl px-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{wheelResult}</span>
                    </p>
                    <div className="pt-4">
                        <p className="font-hand text-2xl md:text-3xl text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                           May all your dreams come true, {data.receiverName}.
                        </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-[380px] md:h-[450px] w-full relative mb-4">
                <Cake
                  flavor={data.cakeFlavor}
                  style={data.cakeStyle}
                  candles={data.candleCount}
                  candlesLit={false}
                  isCut={isCut}
                  onCut={handleCut}
                  receiverName={data.receiverName}
                />
              </div>

              {showGift && (
                <div className="mt-4 w-full max-w-sm px-6 animate-fade-in-up">
                  <div className="relative group/gift">
                    <div className="absolute inset-0 bg-magical-500/20 blur-[80px] rounded-full group-hover/gift:bg-magical-500/40 transition-all duration-1000 animate-pulse-slow pointer-events-none"></div>
                    <ButtonWithIcon 
                        text="Reveal Your Heartfelt Gift 🎁" 
                        onClick={openGift} 
                        className="relative z-10 w-full py-8 text-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] bg-slate-900/40 border-white/20"
                    />
                  </div>
                  <p className="mt-4 text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Touch the gift to see your surprise</p>
                </div>
              )}
            </div>
          )}

          {/* REVEAL */}
          {step === ExperienceStep.REVEAL && (
            <div className="w-full text-center space-y-8 py-10 overflow-y-auto custom-scrollbar">
              {/* Diamond-Glow Header */}
              <div className="space-y-3 animate-fade-in-down">
                <p className="text-magical-200 text-[10px] tracking-[0.5em] uppercase font-black drop-shadow-sm opacity-60">A Celebration of You</p>
                <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] leading-tight italic">
                    Happy Birthday!
                </h1>
                <div className="flex justify-center items-center gap-4 py-2">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/40"></div>
                    <span className="text-white/60 text-xs font-serif italic tracking-widest">{data.receiverName}</span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/40"></div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full border border-white/10 space-y-10 relative z-10 animate-fade-in-up overflow-hidden">
                {/* Visual Depth Particles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute top-10 left-[10%] text-xl animate-float-slow">🌸</div>
                    <div className="absolute top-[20%] right-[15%] text-lg animate-float-fast">✨</div>
                    <div className="absolute bottom-[30%] left-[20%] text-sm animate-float-slow">🍬</div>
                    <div className="absolute bottom-[10%] right-[25%] text-2xl animate-float-fast">🐇</div>
                </div>

                <div className="space-y-4 relative">
                  <div className="flex items-center gap-3 justify-center mb-2">
                     <div className="w-6 h-[1px] bg-white/20"></div>
                     <p className="text-[9px] uppercase tracking-[0.3em] font-black text-magical-200/60">A Heartfelt Message</p>
                     <div className="w-6 h-[1px] bg-white/20"></div>
                  </div>
                  <div className="py-4 flex justify-center transform hover:scale-[1.02] transition-transform duration-500">
                    <ScratchCard width={320} height={200}>
                      <p className="text-xl md:text-2xl font-hand text-gray-800 leading-relaxed italic px-6 select-none">
                        "{data.personalNote}"
                      </p>
                    </ScratchCard>
                  </div>
                </div>

                {data.voiceMessageUrl && (
                  <div className="bg-slate-950/60 p-6 rounded-[32px] border border-white/5 flex flex-col items-center space-y-4 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-magical-400 animate-pulse"></div>
                        <p className="uppercase text-[9px] font-black text-white/50 tracking-widest leading-none">Press play to hear the magic</p>
                    </div>
                    <audio src={data.voiceMessageUrl} controls className="w-full max-w-xs h-10 custom-audio-player filter invert brightness-200" />
                  </div>
                )}

                <div className="relative mt-12 py-6">
                  <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/10 via-magical-500/10 to-yellow-400/10 rounded-[44px] blur-2xl opacity-50 pointer-events-none"></div>
                  
                  <div className="relative transform rotate-1 hover:rotate-0 transition-all duration-700">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-4xl select-none group-hover:gap-8 transition-all duration-1000">
                        <span className="animate-bounce-subtle delay-100">✨</span>
                        <span className="animate-pulse delay-200">💖</span>
                        <span className="animate-bounce-subtle delay-300">🧸</span>
                        <span className="animate-pulse delay-400">🎉</span>
                    </div>

                    <div className="bg-[#FFFDF7] text-gray-900 p-10 md:p-14 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-[12px] border-white relative overflow-hidden group/card max-w-sm mx-auto">
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                      
                      <div className="relative space-y-6">
                        <div className="flex flex-col items-center space-y-2">
                             <p className="uppercase text-[9px] font-black text-magical-400 tracking-[0.4em] mb-2 border-b border-magical-100/50 pb-1">A Little Secret</p>
                             <div className="w-8 h-8 rounded-full bg-magical-50 flex items-center justify-center border-2 border-magical-100 shadow-sm mb-2 text-xs">✨</div>
                        </div>
                        
                        <p className="text-2xl md:text-3xl font-hand leading-snug text-magical-950 drop-shadow-sm italic">
                          {data.finalMessage}
                        </p>

                        <div className="pt-8 flex flex-col items-center gap-2">
                           <p className="text-[10px] font-serif text-magical-400/60 tracking-widest uppercase">Sent with all my love,</p>
                           <p className="text-xl md:text-2xl font-hand text-magical-900 leading-none">{data.senderName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate Us Section */}
                <div className="pt-12 pb-8 border-t border-white/5 mt-12 animate-fade-in delay-700">
                   <RateUs surpriseId={id || 'demo'} />
                </div>
                
                <div className="pt-16 pb-4 space-y-6 border-t border-white/5 mt-10">
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Wishprise Studios Present</p>
                   <button onClick={() => navigate('/')} className="inline-block group/cta">
                      <div className="flex flex-col items-center space-y-3 opacity-60 group-hover/cta:opacity-100 transition-all duration-500">
                        <p className="text-[11px] font-serif italic text-white/50 tracking-widest">Wanna make someone smile today?</p>
                        <span className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 group-hover/cta:bg-white/10 group-hover/cta:border-white/30 transition-all text-white active:scale-95">
                            Create Your Surprise
                        </span>
                      </div>
                   </button>
                </div>
              </div>
            </div>
          )}

          {/* Final physical spacer to ensure scroll clearance on all mobile devices */}
          <div className="h-[400px] w-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};