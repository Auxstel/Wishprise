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

export const Receiver: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [data, setData] = useState<SurpriseData | null>(null);
  const [loading, setLoading] = useState(true);
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
            // Fallback for demo or not found
            setData({
              id: 'demo', senderName: 'A Friend', receiverName: 'You',
              introMessage: "Someone wanted to make you smile.",
              personalNote: "Happy Birthday!", finalMessage: "Big hug!",
              cakeFlavor: 'vanilla' as any, cakeStyle: CakeStyle.CLASSIC, candleCount: 3, createdAt: Date.now()
            });
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


  if (loading || !data) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading magic...</div>;

  const allBalloonsPopped = poppedBalloons.length === balloons.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans">

      <ImmersiveScene
        step={step}
        onInteract={step === ExperienceStep.LANDING && allBalloonsPopped ? startJourney : undefined}
        explosionTrigger={burstCount}
      />

      {/* Branding Overlay */}
      <div className="absolute top-6 left-6 z-20 opacity-80 pointer-events-none">
        <Logo size="sm" />
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
        <div className="pointer-events-auto w-full max-w-lg p-6 flex flex-col items-center">

          {/* LANDING */}
          {step === ExperienceStep.LANDING && (
            <div className="text-center w-full h-full flex flex-col items-center justify-center">


              {!allBalloonsPopped ? (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in z-30 w-full">
                  <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-12">
                    For {data.receiverName}
                  </h1>
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
                <div className="text-center mt-auto mb-20 animate-fade-in-up">
                  <h1 className="text-5xl md:text-7xl font-hand text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-white to-yellow-200 drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-pulse-slow mb-6">It's Your Birthday!</h1>
                  <Button onClick={startJourney} variant="primary" className="px-10 py-4 text-xl rounded-full shadow-[0_0_40px_rgba(217,70,239,0.6)] border border-white/30 animate-bounce-subtle hover:scale-105 transition-transform">
                    Open the Box 🎁
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* INTRO */}
          {step === ExperienceStep.INTRO_ANIMATION && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="text-center p-8 max-w-2xl animate-fade-in">
                <div className="mb-8">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-magical-500 to-transparent mx-auto rounded-full mb-6"></div>
                  <h2 className="text-xl md:text-2xl font-serif text-magical-200 mb-4 tracking-widest uppercase">Message from {data.senderName}</h2>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif text-white leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">"{typedText}"<span className="animate-pulse text-magical-500">|</span></h1>
              </div>
            </div>
          )}

          {/* CHECK */}
          {step === ExperienceStep.INTERACTIVE_CHECK && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-magical-200 drop-shadow-2xl mb-12 text-center">Take a deep breath...</h2>
              <div className="w-full h-40"></div>
              <Button onClick={() => setStep(ExperienceStep.WHEEL)} className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-12 py-4 text-lg rounded-full transition-all duration-500 hover:tracking-widest">I'm Ready</Button>
            </div>
          )}

          {/* WHEEL */}
          {step === ExperienceStep.WHEEL && (
            <div className="text-center w-full flex flex-col items-center">
              <h2 className="text-2xl font-serif text-white mb-8 drop-shadow-md">Spin for a surprise</h2>
              <div className="relative w-80 h-80 mb-8">
                <div className="w-full h-full rounded-full border-4 border-white/20 shadow-[0_0_30px_rgba(217,70,239,0.3)] relative overflow-hidden transition-transform duration-[3500ms] cubic-bezier(0.15, 0, 0.15, 1)"
                  style={{ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${wheelOptions.map((_, i) => `${wheelColors[i % wheelColors.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')})` }}>
                  {wheelOptions.map((opt, i) => (
                    <div key={i} className="absolute inset-0 flex justify-center pt-4" style={{ transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg)` }}>
                      <div className="text-magical-900 font-bold text-[10px] md:text-xs w-20 text-center leading-tight drop-shadow-sm select-none" >{opt}</div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-20 flex items-center justify-center"><div className="w-2 h-2 bg-magical-500 rounded-full"></div></div>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-lg"><div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white"></div></div>
              </div>
              {!wheelResult ? (
                <Button onClick={spinWheel} disabled={wheelSpinning} className="bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/30 px-10">{wheelSpinning ? "Spinning..." : "SPIN"}</Button>
              ) : (
                <div className="space-y-4 animate-fade-in w-full max-w-sm">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/20 transform scale-105 transition-all">
                    <p className="text-xs text-magical-200 uppercase tracking-widest mb-2">You won</p>
                    <p className="text-2xl font-hand text-white drop-shadow-lg">{wheelResult}</p>
                  </div>
                  <Button onClick={continueFromWheel} className="w-full">Continue</Button>
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

              <div className="space-y-4 relative z-20">
                <h2 className="text-3xl font-serif text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                  Make a Wish
                </h2>
                {candlesLit && (
                  <div className="flex flex-col items-center space-y-3">
                    <p className="text-white/70 text-sm">Blow into the mic or tap the button</p>
                    {!micActive && (
                      <Button onClick={requestMic} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-white/10">🎙️ Enable Mic</Button>
                    )}
                    <button onClick={manualBlow} className="text-white/50 text-xs underline hover:text-white">Tap to blow</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUTTING */}
          {step === ExperienceStep.CAKE_CUTTING && (
            <div className="text-center w-full">
              <h2 className="text-2xl font-serif text-white mb-6 drop-shadow-md">
                {isCut ? "Yay! 🍰" : "Cut the cake!"}
              </h2>

              <div className="h-[400px] w-full relative mb-6">
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
                <div className="mt-4 animate-bounce-subtle">
                  <Button onClick={openGift} className="px-8 py-4 text-xl shadow-[0_0_30px_rgba(255,255,255,0.4)]">🎁 Open Gift</Button>
                </div>
              )}
            </div>
          )}

          {/* REVEAL */}
          {step === ExperienceStep.REVEAL && (
            <div className="w-full text-center">
              <div className="bg-black/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full border border-white/10 space-y-6 relative z-10 animate-fade-in-up">
                <h1 className="text-4xl font-serif text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Happy Birthday!</h1>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full opacity-50"></div>

                <div className="py-4 flex justify-center">
                  <ScratchCard width={300} height={180}>
                    <p className="text-lg font-hand text-gray-800 leading-relaxed italic">"{data.personalNote}"</p>
                  </ScratchCard>
                </div>

                {data.voiceMessageUrl && (
                  <div className="bg-magical-900/40 p-4 rounded-xl border border-magical-500/30 flex flex-col items-center space-y-2">
                    <p className="uppercase text-xs font-bold text-magical-200 tracking-widest">A Special Voice Message</p>
                    <audio src={data.voiceMessageUrl} controls className="w-full max-w-xs h-8" />
                  </div>
                )}

                <div className="relative mt-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="absolute -top-3 -left-3 text-3xl animate-bounce">✨</div>
                  <div className="absolute -top-4 -right-2 text-3xl animate-pulse">💖</div>
                  <div className="absolute -bottom-2 -left-2 text-2xl">🧸</div>
                  <div className="absolute -bottom-4 -right-3 text-3xl">🎉</div>

                  <div className="bg-white text-gray-800 p-8 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-4 border-magical-200">
                    <p className="uppercase text-xs font-bold text-magical-400 tracking-widest mb-4 border-b-2 border-magical-100 pb-2 inline-block">
                      A Little Secret
                    </p>
                    <p className="text-2xl md:text-3xl font-hand leading-relaxed text-magical-900 drop-shadow-sm">
                      {data.finalMessage}
                    </p>
                    <div className="mt-4 flex justify-center gap-2 text-xl opacity-60">
                      <span>🌸</span><span>🐇</span><span>🍬</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/50 pt-4">From: {data.senderName}</p>
                <div className="pt-6"><Button onClick={() => navigate('/')} variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">Create your own</Button></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};