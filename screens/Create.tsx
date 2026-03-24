import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Cake } from '../components/Cake';
import { UpdatedCake } from '../components/UpdatedCake';
import { SurpriseData, CakeFlavor, CakeStyle, UpdatedCakeFlavor } from '../types';
import { saveSurprise, generateId, uploadFile } from '../services/storageService';

import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import { Landing3D } from '../components/Landing3D';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import { Edit2, Sparkles, Wand2 } from 'lucide-react';

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // File State
  const [songFile, setSongFile] = useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<Partial<SurpriseData>>({
    senderName: '',
    receiverName: '',
    introMessage: "Someone took a moment to make this just for you...",
    personalNote: "I'm so grateful for you.",
    finalMessage: "Your gift is my friendship! (And dinner soon!)",
    updatedCakeFlavor: UpdatedCakeFlavor.VANILLA,
    cakeFlavor: CakeFlavor.VANILLA,
    cakeStyle: CakeStyle.CLASSIC,
    candleCount: 1,
    songUrl: '',
    voiceMessageUrl: '',
    wheelOptions: [
      "A big warm hug 🫂",
      "Dinner is on me 🍕",
      "Movie night 🎬",
      "A coffee date ☕",
      "Your favorite dessert 🍦"
    ]
  });

  const handleChange = (field: keyof SurpriseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWheelOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.wheelOptions || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, wheelOptions: newOptions }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict audio-only validation
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/webm', 'audio/x-m4a', 'audio/mp4'];
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadError('Please upload an audio file only (MP3, WAV, OGG, M4A, AAC, FLAC).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Please keep it under 10MB.');
      return;
    }

    setSongFile(file);
    setFormData(prev => ({ ...prev, songUrl: file.name }));
    setUploadError('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setVoiceBlob(audioBlob);

        // Create local URL for preview
        const localUrl = URL.createObjectURL(audioBlob);
        setFormData(prev => ({ ...prev, voiceMessageUrl: localUrl }));

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setUploadError("Could not access microphone. Please enable permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteVoiceMessage = () => {
    setFormData(prev => ({ ...prev, voiceMessageUrl: '' }));
    setVoiceBlob(null);
    setRecordingTime(0);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const id = generateId(); // UUID

    try {
      let finalSongUrl = formData.songUrl || '';
      let finalVoiceUrl = '';

      // Upload Song
      if (songFile) {
        // e.g. "songs/uuid-songName.mp3"
        const path = `songs/${id}-${songFile.name}`;
        finalSongUrl = await uploadFile(songFile, path);
      }

      // Upload Voice
      if (voiceBlob) {
        const ext = voiceBlob.type.includes('mp4') ? 'mp4' : 'webm';
        const path = `voice/${id}-message.${ext}`;
        finalVoiceUrl = await uploadFile(voiceBlob, path);
      }

      const finalData: SurpriseData = {
        ...formData as SurpriseData,
        id,
        songUrl: finalSongUrl,
        voiceMessageUrl: finalVoiceUrl,
        createdAt: Date.now()
      };

      await saveSurprise(finalData);
      navigate(`/share/${id}`);

    } catch (e: any) {
      console.error(e);
      alert("Error saving surprise: " + (e.message || "Unknown error"));
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 flex flex-col overflow-hidden">
      <Seo 
          title="Create Your Magical Birthday Surprise" 
          description="Use our free birthday surprise giver tool to create a custom 3D birthday experience. Choose a cake, add music, and share the link."
          path="/create"
      />

      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950/80 to-slate-950 z-10"></div>
        <Landing3D />
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-start md:justify-center relative z-10 pt-12 md:pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 backdrop-blur-xl bg-white/5 p-4 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(139,38,242,0.15)] animate-fade-in">
          <div onClick={() => navigate('/')} className="cursor-pointer hover:scale-105 transition-transform duration-300">
            <Logo size="sm" />
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-magical-300 uppercase tracking-[0.3em] font-bold mb-1">Creation Progress</div>
            <div className="text-xs text-white/50 font-serif italic">Step {step} of 4</div>
          </div>
        </div>

        {/* Magical Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 mb-12 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-magical-600 via-magical-400 to-amber-300 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(139,38,242,0.6)] relative" 
            style={{ width: `${(step / 4) * 100}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-sm animate-pulse"></div>
          </div>
        </div>

        {/* STEP 1: WHO */}
        {step === 1 && (
          <div className="animate-fade-in backdrop-blur-2xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-magical-600/10 blur-[80px] rounded-full pointer-events-none transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 text-center drop-shadow-2xl">Whose day are we <span className="text-magical-300 font-hand text-5xl md:text-6xl block md:inline-block mt-2 md:mt-0">celebrating?</span></h2>
              <p className="text-center text-gray-400/80 mb-10 font-serif italic text-lg leading-relaxed max-w-md mx-auto">"Every great surprise begins with a thought for someone special."</p>

              <div className="space-y-8">
                <div className="group relative group/input">
                  <label className="block text-[10px] font-black text-magical-300 mb-2 group-focus-within:text-magical-400 transition-colors uppercase tracking-[0.4em] ml-1">Their Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.receiverName}
                      onChange={(e) => handleChange('receiverName', e.target.value)}
                      className="w-full bg-slate-900/40 p-5 pe-14 rounded-2xl border border-white/10 text-white placeholder-white/10 focus:ring-2 focus:ring-magical-500/50 focus:border-magical-500/50 outline-none text-2xl transition-all shadow-2xl focus:bg-slate-950/80 font-serif"
                      placeholder="e.g. Sarah"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                      <Edit2 size={24} />
                    </div>
                  </div>
                  <div className="absolute right-4 bottom-4 text-white/5 font-hand text-3xl pointer-events-none group-focus-within:opacity-0 transition-opacity uppercase">Receiver</div>
                </div>

                <div className="group relative group/input">
                  <label className="block text-[10px] font-black text-magical-300 mb-2 group-focus-within:text-magical-400 transition-colors uppercase tracking-[0.4em] ml-1">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) => handleChange('senderName', e.target.value)}
                      className="w-full bg-slate-900/40 p-5 pe-14 rounded-2xl border border-white/10 text-white placeholder-white/10 focus:ring-2 focus:ring-magical-500/50 focus:border-magical-500/50 outline-none text-2xl transition-all shadow-2xl focus:bg-slate-950/80 font-serif"
                      placeholder="e.g. Alex"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                      <Edit2 size={24} />
                    </div>
                  </div>
                  <div className="absolute right-4 bottom-4 text-white/5 font-hand text-3xl pointer-events-none group-focus-within:opacity-0 transition-opacity uppercase">Sender</div>
                </div>
              </div>

              <div className="flex justify-center mt-12 mb-2">
                <ButtonWithIcon 
                  text="Begin the Magic ✨" 
                  onClick={handleNext} 
                  disabled={!formData.receiverName || !formData.senderName}
                  className="w-full md:w-auto scale-110 shadow-magical-600/40 text-white"
                />
              </div>
            </div>
          </div>
        )}
        {/* STEP 2: CAKE */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in flex flex-col">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 drop-shadow-lg">Craft their <span className="text-magical-300 font-hand text-5xl md:text-6xl">perfect cake</span></h2>
              <p className="text-gray-400/80 font-serif italic text-lg">"A sweet gesture for a sweet soul."</p>
            </div>

            <div className="relative bg-gradient-to-b from-slate-900/40 to-slate-950/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl h-80 w-full overflow-hidden shrink-0">
              {/* <div className="absolute inset-0 bg-magical-600/5 opacity-0 transition-opacity duration-1000"></div> */}
              {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-magical-400/10 blur-3xl rounded-full pointer-events-none"></div> */}

              {/* <Cake
                flavor={formData.cakeFlavor || CakeFlavor.VANILLA}
                style={formData.cakeStyle || CakeStyle.CLASSIC}
                candles={formData.candleCount || 1}
                candlesLit={true}
                isCut={false}
                onCut={() => { }}
                receiverName={formData.receiverName}
              /> */}

              <UpdatedCake 
                flavor={formData.updatedCakeFlavor || UpdatedCakeFlavor.VANILLA}
                modelUrl="/cake.glb"
              />
            </div>

            <div className="backdrop-blur-2xl bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl overflow-y-auto max-h-[45vh] magical-scrollbar px-4">
              {/* <div>
                <label className="block text-[10px] font-black text-magical-300 uppercase tracking-[0.4em] mb-4 ml-1">The Style</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.values(CakeStyle).map(style => (
                    <button
                      key={style}
                      onClick={() => handleChange('cakeStyle', style)}
                      className={`p-3 rounded-xl border text-[10px] md:text-xs font-bold capitalize transition-all duration-300 ${formData.cakeStyle === style
                        ? 'border-magical-400 bg-magical-400/20 text-white shadow-[0_0_15px_rgba(139,38,242,0.3)]'
                        : 'border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
                        }`}
                    >
                      {style.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div> */}

              <div>
                <label className="block text-[10px] font-black text-magical-300 uppercase tracking-[0.4em] mb-4 ml-1">The Flavor</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.values(UpdatedCakeFlavor).map(flavor => (
                    <button
                      key={flavor}
                      onClick={() => handleChange('updatedCakeFlavor', flavor)}
                      className={`p-3 rounded-xl border text-[10px] md:text-xs font-bold capitalize transition-all duration-300 ${formData.updatedCakeFlavor === flavor
                        ? 'border-magical-400 bg-magical-400/20 text-white shadow-[0_0_15px_rgba(139,38,242,0.3)]'
                        : 'border-white/5 bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
                        }`}
                    >
                      {flavor.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[10px] font-black text-magical-300 uppercase tracking-[0.4em]">Candles of Light</label>
                  <span className="font-serif text-white text-2xl drop-shadow-glow">{formData.candleCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={formData.candleCount}
                  onChange={(e) => handleChange('candleCount', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-magical-400"
                />
              </div> */}

              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button 
                  onClick={handleBack} 
                  className="flex-1 py-4 px-8 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all font-serif italic text-lg"
                >
                  Go Back
                </button>
                <div className="flex-1 flex justify-center">
                  <ButtonWithIcon 
                    text="Looks Delicious! Next Step" 
                    onClick={handleNext}
                    className="w-full text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* STEP 3: WHEEL OPTIONS */}
        {step === 3 && (
          <div className="space-y-10 animate-fade-in backdrop-blur-3xl bg-white/[0.02] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Subtle atmospheric glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-magical-600/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center relative z-10 space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">The <span className="text-magical-300 font-hand text-5xl md:text-7xl">Wheel of Wishes</span></h2>
              <p className="text-slate-400/80 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">"Five promises. Five gifts of time. What magic will you grant?"</p>
            </div>

            <div className="grid grid-cols-1 gap-6 relative z-10 overflow-y-auto max-h-[55vh] pr-2 magical-scrollbar px-1">
              {formData.wheelOptions?.map((option, index) => (
                <div key={index} className="flex flex-col space-y-2 group/item">
                  <div className="flex items-center gap-4 relative group/input">
                    {/* Minimalist, elegant numbering */}
                    <div className="text-[10px] font-black text-magical-400/20 group-hover/item:text-magical-400 transition-colors duration-500 uppercase tracking-[0.6em] w-12 text-center">
                      Grant {index + 1}
                    </div>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleWheelOptionChange(index, e.target.value)}
                        className="w-full bg-slate-900/40 border-b border-white/10 p-4 pe-14 text-white focus:border-magical-500/50 outline-none text-xl transition-all placeholder-white/10 focus:bg-slate-950/60 font-serif italic rounded-t-xl hover:bg-slate-900/60"
                        placeholder="Type a magical promise..."
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                        <Edit2 size={16} />
                      </div>
                      {/* Interactive focus indicator */}
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-magical-500 group-focus-within/item:w-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(139,38,242,0.8)]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtler Inspiration Spark */}
            <div className="mt-4 pt-4 border-t border-white/5 relative z-10 text-center">
              <p className="text-[10px] text-slate-500 font-serif italic leading-relaxed max-w-xs mx-auto">
                Need a spark? Try <span className="text-magical-400">"a sunset walk,"</span> <span className="text-magical-400">"your favorite home-cooked meal,"</span> or <span className="text-magical-400">"a night under the stars."</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4 relative z-10">
              <button 
                onClick={handleBack} 
                className="flex-1 py-4 px-8 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all font-serif italic text-lg border border-transparent hover:border-white/5"
              >
                Go Back
              </button>
              <div className="flex-1 flex justify-center">
                <ButtonWithIcon 
                  text="Lock in the Magic" 
                  onClick={handleNext}
                  className="w-full text-white shadow-magical-600/30"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-fade-in backdrop-blur-3xl bg-white/[0.02] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group/step4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-magical-600/[0.05] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center relative z-10 space-y-3">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">Pour your <span className="text-magical-300 font-hand text-5xl md:text-7xl">heart into words</span></h2>
              <p className="text-slate-400 font-serif italic text-lg leading-relaxed max-w-lg mx-auto">"Your voice and your words are the true gift. This is the moment they'll hear as they celebrate."</p>
            </div>

            <div className="space-y-10 relative z-10 overflow-y-auto max-h-[55vh] pr-2 magical-scrollbar px-1">
              {/* Written Messages */}
              <div className="space-y-8">
                <div className="group/field relative group/input">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-magical-400/40 uppercase tracking-[0.4em]">The Opening Chapter</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={formData.introMessage}
                      onChange={(e) => handleChange('introMessage', e.target.value)}
                      className="w-full bg-slate-900/40 p-6 pe-14 rounded-3xl border border-white/5 text-white placeholder-white/5 focus:border-magical-500/30 outline-none min-h-[120px] focus:bg-slate-950/60 font-serif text-xl leading-relaxed transition-all italic shadow-inner"
                      placeholder="Type a beautiful intro..."
                    />
                    <div className="absolute right-5 top-6 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                      <Edit2 size={24} />
                    </div>
                  </div>
                </div>

                <div className="group/field relative group/input">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-magical-400/40 uppercase tracking-[0.4em]">A Secret Note</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={formData.personalNote}
                      onChange={(e) => handleChange('personalNote', e.target.value)}
                      className="w-full bg-slate-900/40 p-6 pe-14 rounded-3xl border border-white/5 text-white placeholder-white/5 focus:border-magical-500/30 outline-none min-h-[120px] focus:bg-slate-950/60 font-serif text-xl leading-relaxed transition-all italic shadow-inner"
                      placeholder="Something just for them..."
                    />
                    <div className="absolute right-5 top-6 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                      <Edit2 size={24} />
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500 italic font-serif text-right px-2">This note stays hidden until they find it.</p>
                </div>
              </div>

              {/* Media Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Voice Message */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-magical-400/40 uppercase tracking-[0.4em]">The Gift of Your Voice</span>
                  </div>
                  <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
                    <p className="text-[10px] text-slate-500 italic font-serif leading-tight">"They'll hear your voice as a toast to their special day."</p>
                    {!formData.voiceMessageUrl ? (
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-full py-6 rounded-2xl font-bold text-xs transition-all flex flex-col items-center justify-center gap-3 border ${isRecording
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                          : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-magical-500/30 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <span className="text-3xl">{isRecording ? "🔴" : "🎙️"}</span>
                        <span>{isRecording ? `Recording... (${recordingTime}s)` : "Record a Heartfelt Message"}</span>
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[10px] text-magical-300 uppercase tracking-widest font-black">Message Saved</span>
                          <button onClick={deleteVoiceMessage} className="text-[10px] text-red-400/50 hover:text-red-400 flex items-center gap-1 transition-colors uppercase font-bold tracking-tighter italic">Delete</button>
                        </div>
                        <audio src={formData.voiceMessageUrl} controls className="w-full h-8 opacity-40 hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Soundtrack */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-magical-400/40 uppercase tracking-[0.4em]">Soundtrack of Memory</span>
                  </div>
                  <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
                    <p className="text-[10px] text-slate-500 italic font-serif leading-tight">"This melody will play as they cut their cake, making it truly magical."</p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.songUrl}
                        onChange={(e) => handleChange('songUrl', e.target.value)}
                        className="w-full bg-slate-950/40 p-4 rounded-xl border border-white/5 text-white placeholder-white/5 focus:border-magical-500/30 outline-none text-sm transition-all italic font-serif"
                        placeholder="Paste MP3 Link..."
                      />
                      <div className="relative">
                        <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="song-upload" />
                        <label htmlFor="song-upload" className="flex items-center justify-center w-full p-4 rounded-xl border border-dashed border-white/10 text-white/20 hover:border-magical-500/30 hover:text-magical-300 hover:bg-white/5 cursor-pointer transition-all duration-300 text-xs font-serif italic">
                          {songFile ? `📁 ${songFile.name}` : "Or Upload Your Own MP3"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Surprise */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-magical-400/40 uppercase tracking-[0.4em]">One Final secret</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="group relative group/input">
                  <input
                    type="text"
                    value={formData.finalMessage}
                    onChange={(e) => handleChange('finalMessage', e.target.value)}
                    className="w-full bg-slate-900/20 border-b border-white/10 p-4 pe-14 text-white placeholder-white/10 focus:border-amber-400/50 outline-none text-2xl transition-all font-serif italic focus:bg-white/[0.02]"
                    placeholder="The very last thing they'll see..."
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-magical-400/30 group-hover/input:text-magical-400/60 transition-colors pointer-events-none">
                    <Edit2 size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6 relative z-10">
              <button 
                onClick={handleBack} 
                className="flex-1 py-4 px-8 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all font-serif italic text-lg border border-transparent hover:border-white/5"
              >
                Go Back
              </button>
              <div className="flex-1 flex justify-center">
                <ButtonWithIcon 
                  text={isSaving ? "Creating..." : "Create the Surprise ✨"} 
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="w-full text-white shadow-magical-600/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};