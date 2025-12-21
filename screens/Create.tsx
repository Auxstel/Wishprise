import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Cake } from '../components/Cake';
import { SurpriseData, CakeFlavor, CakeStyle } from '../types';
import { saveSurprise, generateId, uploadFile } from '../services/storageService';
import { AdComponent } from '../components/AdComponent';
import { Logo } from '../components/Logo';
import { Landing3D } from '../components/Landing3D';

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

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Please keep it under 10MB.');
      return;
    }

    setSongFile(file);
    // Create a local URL for preview if needed, or just show the name
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">

      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950/80 to-slate-950 z-10"></div>
        <Landing3D />
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center relative z-10">

        <div className="flex items-center justify-between mb-8 backdrop-blur-sm bg-black/20 p-4 rounded-full border border-white/10">
          <div onClick={() => navigate('/')} className="cursor-pointer hover:scale-105 transition-transform">
            <Logo size="sm" />
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Step {step} of 4</div>
        </div>

        <div className="w-full h-1 bg-gray-800/50 mb-10 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-magical-600 to-magical-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* STEP 1: WHO */}
        {step === 1 && (
          <div className="animate-fade-in backdrop-blur-xl bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <h2 className="text-4xl font-serif text-white mb-2 text-center drop-shadow-lg">Who is this surprise for?</h2>
            <p className="text-center text-gray-400 mb-8">Let's start with the basics.</p>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-magical-200 mb-2 group-focus-within:text-magical-400 transition-colors uppercase tracking-wider">Their Name</label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => handleChange('receiverName', e.target.value)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 focus:border-transparent outline-none text-xl transition-all shadow-inner focus:bg-slate-900/80"
                  placeholder="e.g. Sarah"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-magical-200 mb-2 group-focus-within:text-magical-400 transition-colors uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleChange('senderName', e.target.value)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 focus:border-transparent outline-none text-xl transition-all shadow-inner focus:bg-slate-900/80"
                  placeholder="e.g. Alex"
                />
              </div>
            </div>

            <Button onClick={handleNext} disabled={!formData.receiverName || !formData.senderName} fullWidth className="mt-8 py-4 text-lg shadow-magical-500/20">
              Next Step
            </Button>
          </div>
        )}

        {/* STEP 2: CAKE */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in flex flex-col">
            <h2 className="text-3xl font-serif text-white text-center drop-shadow-md">Design the Cake</h2>

            <div className="relative bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-3xl border border-slate-800 shadow-2xl h-80 w-full overflow-hidden shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>

              <Cake
                flavor={formData.cakeFlavor || CakeFlavor.VANILLA}
                style={formData.cakeStyle || CakeStyle.CLASSIC}
                candles={formData.candleCount || 1}
                candlesLit={true}
                isCut={false}
                onCut={() => { }}
                receiverName={formData.receiverName}
              />
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl overflow-y-auto max-h-[40vh] no-scrollbar">

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shape (10 Styles)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.values(CakeStyle).map(style => (
                    <button
                      key={style}
                      onClick={() => handleChange('cakeStyle', style)}
                      className={`p-3 rounded-lg border text-[10px] md:text-xs font-medium capitalize transition-all ${formData.cakeStyle === style
                          ? 'border-magical-500 bg-magical-500/20 text-white shadow-lg shadow-magical-500/20'
                          : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                      {style.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Flavor (10 Varieties)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.values(CakeFlavor).map(flavor => (
                    <button
                      key={flavor}
                      onClick={() => handleChange('cakeFlavor', flavor)}
                      className={`p-2 rounded-lg border text-[10px] md:text-xs font-medium capitalize transition-all ${formData.cakeFlavor === flavor
                          ? 'border-magical-500 bg-magical-500/20 text-white shadow-lg shadow-magical-500/20'
                          : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                      {flavor.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Candles</label>
                  <span className="font-mono text-magical-400 text-lg">{formData.candleCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={formData.candleCount}
                  onChange={(e) => handleChange('candleCount', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-magical-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <Button variant="secondary" onClick={handleBack} className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10">Back</Button>
                <Button onClick={handleNext} className="flex-1">Looks Delicious</Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WHEEL OPTIONS */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
            <div className="text-center">
              <h2 className="text-3xl font-serif text-white">The Wheel of Wishes</h2>
              <p className="text-gray-400 text-sm mt-2">Enter 5 prizes or promises. They will spin the wheel and win one!</p>
            </div>

            <div className="space-y-4">
              {formData.wheelOptions?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-magical-900/50 border border-magical-500/30 flex items-center justify-center text-xs font-bold text-magical-300 group-hover:bg-magical-500 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleWheelOptionChange(index, e.target.value)}
                    className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-magical-500 outline-none text-sm transition-all placeholder-gray-600 focus:bg-slate-900/80"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-4">
              <Button variant="secondary" onClick={handleBack} className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next Step</Button>
            </div>
          </div>
        )}

        {/* STEP 4: MESSAGES & SONG & VOICE */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-serif text-white text-center">Heartfelt Words</h2>
            <p className="text-gray-400 text-sm text-center">Write the messages they will see during the experience.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-magical-200 mb-2 uppercase tracking-wider">Intro Message</label>
                <textarea
                  value={formData.introMessage}
                  onChange={(e) => handleChange('introMessage', e.target.value)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 outline-none min-h-[80px] focus:bg-slate-900/80"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-magical-200 mb-2 uppercase tracking-wider">Short Personal Note</label>
                <textarea
                  value={formData.personalNote}
                  onChange={(e) => handleChange('personalNote', e.target.value)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 outline-none min-h-[80px] focus:bg-slate-900/80"
                />
              </div>

              {/* VOICE MESSAGE SECTION */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-magical-200 uppercase tracking-wider">Voice Message</label>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 flex flex-col space-y-3">
                  {!formData.voiceMessageUrl ? (
                    <div className="flex gap-2">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex-1 p-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isRecording
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}
                      >
                        {isRecording ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Stop ({recordingTime}s)
                          </>
                        ) : (
                          <>🎙️ Record (Max 60s)</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-magical-500/20 p-3 rounded-lg border border-magical-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔊</span>
                        <div className="text-sm text-magical-200">Voice Message Recorded</div>
                      </div>
                      <div className="flex gap-2">
                        <audio src={formData.voiceMessageUrl} controls className="h-8 w-24 hidden md:block" />
                        <button onClick={deleteVoiceMessage} className="text-xs text-red-400 hover:text-red-300 underline">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-magical-200 uppercase tracking-wider">Favorite Song</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.songUrl}
                      onChange={(e) => handleChange('songUrl', e.target.value)}
                      className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 outline-none text-sm focus:bg-slate-900/80"
                      placeholder="Paste MP3 Link or Upload ->"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="song-upload"
                    />
                    <label htmlFor="song-upload" className="flex items-center justify-center w-full p-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:border-magical-500 hover:text-magical-400 cursor-pointer transition-colors bg-white/5 hover:bg-white/10">
                      <span className="text-sm">
                        {songFile ? `📁 ${songFile.name}` : "📁 Upload MP3"}
                      </span>
                    </label>
                  </div>
                </div>
                {uploadError ? (
                  <p className="text-red-400 text-xs">{uploadError}</p>
                ) : (
                  <p className="text-gray-500 text-xs">Max file size: 10MB.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-magical-200 mb-2 uppercase tracking-wider">Final Hidden Surprise</label>
                <input
                  type="text"
                  value={formData.finalMessage}
                  onChange={(e) => handleChange('finalMessage', e.target.value)}
                  className="w-full bg-slate-900/60 p-4 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-magical-500 outline-none focus:bg-slate-900/80"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <Button variant="secondary" onClick={handleBack} className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10">Back</Button>
              <Button onClick={handleSubmit} disabled={isSaving} className="flex-1 shadow-magical-500/50 shadow-lg">
                {isSaving ? "Uploading & Saving..." : "Create Magic ✨"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto relative z-10">
        <AdComponent type="banner" className="bg-slate-950/80 border-t border-white/10 text-slate-500" />
      </div>
    </div>
  );
};