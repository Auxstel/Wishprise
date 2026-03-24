import React, { useState } from 'react';
import { Seo } from '../components/Seo';
import { Link } from 'react-router-dom';
import {
    RiSparkling2Line, RiMagicLine, RiHeartFill, RiShareForwardLine,
    RiFileCopyLine, RiRefreshLine, RiHome5Line, RiUser3Line,
    RiChatPollLine, RiCheckDoubleLine, RiCake2Line, RiEmotionLaughLine,
    RiHeart2Fill, RiFireLine, RiEmotionSadLine, RiBriefcase4Line
} from 'react-icons/ri';
import ButtonWithIcon from '../components/ui/button-witn-icon';
import { Landing3D } from '../components/Landing3D';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const TONES = [
    { id: 'funny', label: 'Funny', emoji: '😂', color: 'bg-amber-400', icon: <RiEmotionLaughLine className="w-6 h-6" />, shadow: 'shadow-amber-500/20' },
    { id: 'romantic', label: 'Romantic', emoji: '❤️', color: 'bg-rose-500', icon: <RiHeart2Fill className="w-6 h-6" />, shadow: 'shadow-rose-500/20' },
    { id: 'savage', label: 'Savage', emoji: '🔥', color: 'bg-orange-500', icon: <RiFireLine className="w-6 h-6" />, shadow: 'shadow-orange-500/20' },
    { id: 'emotional', label: 'Emotional', emoji: '🥺', color: 'bg-indigo-500', icon: <RiEmotionSadLine className="w-6 h-6" />, shadow: 'shadow-indigo-500/20' },
    { id: 'professional', label: 'Professional', emoji: '👔', color: 'bg-slate-600', icon: <RiBriefcase4Line className="w-6 h-6" />, shadow: 'shadow-slate-500/20' },
];

export const AiWishes: React.FC = () => {
    const [recipientName, setRecipientName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [tone, setTone] = useState('funny');
    const [gender, setGender] = useState('none');
    const [generatedWish, setGeneratedWish] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [generationCount, setGenerationCount] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    React.useEffect(() => {
        let timer: any;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const generateWish = async () => {
        if (!recipientName || !relationship) {
            setError('Please fill in both name and relationship.');
            return;
        }

        if (generationCount >= 5) {
            setError('Max wishes reached for this session. Please refresh to generate more.');
            return;
        }

        if (cooldown > 0) {
            setError(`Please wait ${cooldown}s before generating another wish.`);
            return;
        }

        setError('');
        setIsGenerating(true);
        setGeneratedWish('');
        setCopied(false);

        const prompt = `Write exactly ONE short, engaging, and shareable birthday wish for my ${relationship} named ${recipientName} (Gender: ${gender === 'none' ? 'not specified' : gender}). Tone: ${tone}. Keep it under 3-4 sentences and include appropriate emojis. CRITICAL INSTRUCTION: Return ONLY the raw text of the wish. Do NOT provide multiple options. Do NOT include any introductory text, quotation marks, or conversational filler.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Error generating wish');
            }

            const wishText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (wishText) {
                setGeneratedWish(wishText.trim());
                setGenerationCount(prev => prev + 1);
                setCooldown(10); // 10 second cooldown
            } else {
                throw new Error('No content returned from AI');
            }
        } catch (err: any) {
            console.error('Gemini API Error:', err);
            setError(err.message || 'Failed to generate wish. Please try again later.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedWish);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const shareOnWhatsApp = () => {
        const text = encodeURIComponent(generatedWish);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden relative selection:bg-magical-500/30">
            <Seo
                title="AI Birthday Wish Generator | Create Unique & Funny Wishes"
                description="Generate perfectly crafted birthday wishes in seconds. Choose from funny, romantic, savage, or emotional tones using our advanced AI."
                path="/ai-wishes"
            />

            {/* Premium 3D Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-950/60 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />

                {/* Floating Emojis Animation Layer */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-20">
                    <span className="absolute top-[15%] left-[10%] text-4xl md:text-6xl animate-bounce [animation-duration:3s]">🎂</span>
                    <span className="absolute top-[60%] left-[5%] text-4xl md:text-6xl animate-pulse">🎉</span>
                    <span className="absolute top-[25%] right-[10%] text-4xl md:text-6xl animate-bounce [animation-duration:4s]">✨</span>
                    <span className="absolute bottom-[20%] right-[15%] text-4xl md:text-6xl animate-pulse">🎈</span>
                </div>
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 md:px-12">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Wishprise" className="h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-white font-serif italic text-2xl hidden sm:inline tracking-tight">Wishprise</span>
                </Link>
                <div className="ml-auto flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm font-semibold bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
                        <RiHome5Line className="w-4 h-4" /> Home
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-30 flex-1 flex flex-col items-center pt-32 pb-20 px-6">

                {/* HERO SECTION */}
                <div className="text-center mb-16 max-w-4xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-magical-500/10 border border-magical-500/20 text-magical-300 text-sm font-bold mb-8 shadow-[0_0_20px_rgba(139,38,242,0.1)]">
                        <RiSparkling2Line className="w-4 h-4" />
                        Powered by Wishprise ✨
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight tracking-tight px-4">
                        Create Heartfelt Birthday <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-magical-400 via-pink-400 to-orange-400">Wishes in Seconds 🎂</span>
                    </h1>
                    <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                        Turn emotions into perfect words instantly. Powered by Wishprise ✨
                    </p>
                </div>

                {/* MAIN GENERATOR CARD (Glassmorphism) */}
                <div className="w-full max-w-4xl backdrop-blur-3xl bg-slate-900/40 p-6 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)] transition-all duration-500">

                    <div className="space-y-12">

                        {/* Inputs Grid */}
                        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
                                    <RiCake2Line className="w-4 h-4 text-magical-400" /> Who is celebrating?
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="e.g. Sarah, Alex"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-magical-500/60 focus:ring-4 focus:ring-magical-500/10 transition-all font-sans text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
                                    <RiHeartFill className="w-4 h-4 text-rose-500" /> Relationship
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Best Friend, Mom, Partner"
                                    value={relationship}
                                    onChange={(e) => setRelationship(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-magical-500/60 focus:ring-4 focus:ring-magical-500/10 transition-all font-sans text-lg"
                                />
                            </div>
                        </div>

                        {/* Gender Pill Select */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
                                <RiUser3Line className="w-4 h-4 text-blue-400" /> Gender Context
                            </label>
                            <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5 w-full md:w-fit overflow-x-auto custom-scrollbar no-scrollbar">
                                <div className="flex min-w-full">
                                    {['Male', 'Female', 'Unknown'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setGender(g === 'Unknown' ? 'none' : g)}
                                            className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${(gender === g || (gender === 'none' && g === 'Unknown'))
                                                ? 'bg-gradient-to-r from-magical-600 to-magical-500 text-white shadow-lg'
                                                : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tone Selector Cards */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
                                <RiChatPollLine className="w-4 h-4 text-orange-400" /> Choose the Vibe
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {TONES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTone(t.id)}
                                        className={`group relative flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-3xl transition-all duration-500 border ${tone === t.id
                                            ? `${t.color} border-white/20 text-white transform scale-105 ${t.shadow} shadow-2xl`
                                            : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/20 hover:bg-slate-900/60'
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${tone === t.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                            {t.icon}
                                        </div>
                                        <span className="text-xs md:text-sm font-bold tracking-tight whitespace-nowrap">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-rose-400 text-sm font-medium animate-shake text-center">{error}</p>}

                        {/* GENERATE BUTTON */}
                        <div className="pt-4">
                            <button
                                onClick={generateWish}
                                disabled={isGenerating || !recipientName || !relationship || cooldown > 0 || generationCount >= 5}
                                className="w-full py-4 md:py-6 rounded-[2rem] text-lg md:text-xl font-bold text-white bg-gradient-to-r from-magical-600 via-pink-600 to-orange-500 shadow-[0_10px_40px_rgba(139,38,242,0.3)] hover:shadow-[0_15px_60px_rgba(139,38,242,0.5)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isGenerating ? (
                                        <>
                                            <RiRefreshLine className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                            <span className="text-base md:text-xl">Crafting your perfect wish...</span>
                                        </>
                                    ) : cooldown > 0 ? (
                                        <>
                                            <RiRefreshLine className="w-5 h-5 md:w-6 md:h-6 opacity-40" />
                                            <span className="text-base md:text-xl opacity-80">Wait {cooldown}s...</span>
                                        </>
                                    ) : generationCount >= 5 ? (
                                        <>
                                            <RiRefreshLine className="w-5 h-5 md:w-6 md:h-6 opacity-40" />
                                            <span className="text-base md:text-xl opacity-80">Session Limit Reached</span>
                                        </>
                                    ) : (
                                        <>
                                            <RiMagicLine className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform" />
                                            ✨ Generate Magic Wish
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                            </button>
                            {generationCount > 0 && (
                                <p className="text-center text-slate-500 text-xs mt-4 font-bold tracking-[0.2em] uppercase">
                                    {5 - generationCount} Wishes Remaining This Session
                                </p>
                            )}
                        </div>
                    </div>

                    {/* OUTPUT SECTION */}
                    {(isGenerating || generatedWish) && (
                        <div className="mt-16 animate-fade-in-up">
                            <div className="w-full h-px bg-white/10 mb-16"></div>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <h3 className="text-sm uppercase tracking-[0.2em] text-magical-400 font-black text-center">Your Magic Result</h3>

                                {isGenerating ? (
                                    <div className="bg-slate-950/60 rounded-[2.5rem] p-12 border border-white/5 flex flex-col items-center gap-6">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-magical-500 rounded-full animate-bounce"></div>
                                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                        <p className="text-slate-400 italic text-lg font-serif">Consulting the AI muses...</p>
                                    </div>
                                ) : (
                                    <div className="relative group/output">
                                        {/* Chat Bubble Style */}
                                        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative">
                                            <div className="text-slate-900 text-2xl md:text-3xl font-serif leading-relaxed italic pr-4">
                                                "{generatedWish}"
                                            </div>
                                            {/* Bubble tail */}
                                            <div className="absolute bottom-[-15px] left-12 w-8 h-8 bg-white rotate-45 transform"></div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-12 justify-center">
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center gap-3 py-4 px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all font-bold border border-slate-200 shadow-lg group/copy"
                                            >
                                                {copied ? <RiCheckDoubleLine className="w-5 h-5 text-green-600" /> : <RiFileCopyLine className="w-5 h-5 group-copy:scale-110" />}
                                                {copied ? 'Captured!' : 'Copy Text'}
                                            </button>

                                            <button
                                                onClick={shareOnWhatsApp}
                                                className="flex items-center gap-3 py-4 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white transition-all font-bold shadow-lg"
                                            >
                                                <RiShareForwardLine className="w-5 h-5" />
                                                WhatsApp Share
                                            </button>

                                            <button
                                                onClick={generateWish}
                                                className="flex items-center gap-3 py-4 px-8 rounded-2xl bg-magical-600 hover:bg-magical-500 text-white transition-all font-bold shadow-lg"
                                            >
                                                <RiRefreshLine className="w-5 h-5" />
                                                Regenerate
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Emotional CTA to /create */}
                <div className="mt-24 mb-8 max-w-2xl mx-auto text-center animate-fade-in px-6">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
                        Want to make it even more special? ✨
                    </h3>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                        Don't just send a wish, create a moment that lasts forever. Our main surprise builder helps you craft a complete digital journey they'll never forget.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-magical-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-[0_10px_40px_rgba(139,38,242,0.3)] hover:shadow-[0_15px_60px_rgba(139,38,242,0.5)] hover:-translate-y-1 transition-all group w-full sm:w-auto"
                    >
                        Build a Complete Surprise <RiMagicLine className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform shrink-0" />
                    </Link>
                </div>

                {/* Optional Trending Section */}
                <div className="mt-20 text-center animate-fade-in [animation-delay:1s]">
                    <p className="text-slate-500 flex items-center justify-center gap-2 mb-4 font-bold uppercase tracking-widest text-xs">
                        <RiFireLine className="w-4 h-4 text-orange-500" /> Trending wishes today
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 px-6 max-w-2xl mx-auto">
                        {["Funny Sister", "Romantic Partner", "Boss Professional", "Best Friend Savage"].map(item => (
                            <span key={item} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm hover:border-magical-500/30 hover:text-magical-300 cursor-pointer transition-all">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-30 pb-12 pt-12 border-t border-white/5 text-center">
                <div className="text-slate-400 font-bold mb-2">Powered by Wishprise ✨</div>
                <div className="text-slate-600 text-sm font-light italic">Made with ❤️ for unforgettable moments</div>
            </footer>
        </div>
    );
};
