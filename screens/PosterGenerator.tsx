import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Seo } from '../components/Seo';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
    RiUploadCloud2Line, RiDownload2Line, RiFontSize, RiPaletteLine,
    RiLayoutMasonryLine, RiMagicLine, RiSettings4Line, RiImageLine,
    RiShareForwardLine, RiSunLine, RiMoonLine, RiSparkling2Line,
    RiArrowRightLine, RiHistoryLine, RiCloseLine, RiHome5Line,
    RiStarFill, RiHeart2Fill, RiEmotionLaughLine
} from 'react-icons/ri';
import { Landing3D } from '../components/Landing3D';
import { POSTER_TEMPLATES, PosterTemplate, PosterTheme, AspectRatio } from '../data/posterTemplates';

export const PosterGenerator: React.FC = () => {
    // --- STUDIO STATE ---
    const [view, setView] = useState<'gallery' | 'editor'>('gallery');
    const [activeTemplate, setActiveTemplate] = useState<PosterTemplate>(POSTER_TEMPLATES[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [headline, setHeadline] = useState('Happy Birthday');
    const [message, setMessage] = useState('Wishing you a universe of happiness, today and always.');
    const [fontSize, setFontSize] = useState(120);
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
    const [isGenerating, setIsGenerating] = useState(false);
    const [mobileTab, setMobileTab] = useState<'edit' | 'styles' | 'preview'>('edit');

    // Canvas Refs

    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- CANVAS ENGINE ---
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions based on Aspect Ratio
        let width = 1080;
        let height = 1350; // 4:5 default

        if (aspectRatio === '1:1') height = 1080;
        if (aspectRatio === '9:16') height = 1920;

        canvas.width = width;
        canvas.height = height;

        const theme = activeTemplate;

        // 1. Background Fill
        ctx.fillStyle = theme.colors.bg;
        ctx.fillRect(0, 0, width, height);

        // 2. Draw Image if exists
        if (imageObj) {
            const scale = Math.max(width / imageObj.width, height / imageObj.height);
            const x = (width / 2) - (imageObj.width / 2) * scale;
            const y = (height / 2) - (imageObj.height / 2) * scale;

            ctx.filter = 'none'; // reset
            ctx.drawImage(imageObj, x, y, imageObj.width * scale, imageObj.height * scale);

            // Premium Overlay
            const gradient = ctx.createLinearGradient(0, height * 0.3, 0, height);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, theme.colors.bg + 'ee'); // Add alpha to theme bg
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        // 3. Draw Decorative Elements (Simulated)
        if (theme.theme === 'gold') {
            ctx.strokeStyle = theme.colors.accent;
            ctx.lineWidth = 10;
            ctx.strokeRect(40, 40, width - 80, height - 80);
        }

        // 4. Draw Typography
        ctx.textAlign = textAlign;
        const textX = textAlign === 'center' ? width / 2 : textAlign === 'left' ? 100 : width - 100;

        // Headline
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        ctx.fillStyle = theme.colors.text;

        // Shadow for readability over images
        if (imageObj) {
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 15;
        }

        ctx.fillText(headline.toUpperCase(), textX, height - 350);
        ctx.shadowBlur = 0;

        // Decorative Accent Line
        ctx.beginPath();
        const lineW = 120;
        const lineXStart = textAlign === 'center' ? (width / 2 - lineW / 2) : textAlign === 'left' ? 100 : (width - 100 - lineW);
        ctx.moveTo(lineXStart, height - 300);
        ctx.lineTo(lineXStart + lineW, height - 300);
        ctx.lineWidth = 6;
        ctx.strokeStyle = theme.colors.accent;
        ctx.stroke();

        // Subtext Message
        ctx.font = '40px "Inter", sans-serif';
        ctx.fillStyle = theme.colors.muted;

        const words = message.split(' ');
        let line = '';
        let currentY = height - 220;
        const lineheight = 55;
        const maxWidth = width - 200;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, textX, currentY);
                line = words[n] + ' ';
                currentY += lineheight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, textX, currentY);

        // Branding
        ctx.font = '24px "Inter", sans-serif';
        ctx.fillStyle = theme.colors.accent;
        ctx.globalAlpha = 0.5;
        ctx.fillText('WISHPRISE ✨ POSTER STUDIO', width / 2, height - 60);
        ctx.globalAlpha = 1.0;

    }, [activeTemplate, aspectRatio, imageObj, headline, message, fontSize, textAlign]);

    useEffect(() => {
        if (view === 'editor') {
            drawCanvas();
        }
    }, [drawCanvas, view]);

    // --- ACTIONS ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => setImageObj(img);
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const downloadPoster = () => {
        if (!canvasRef.current) return;

        const link = document.createElement('a');
        link.download = `wishprise-poster-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png', 1.0);
        link.click();

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8b26f2', '#ff0080', '#fbbf24']
        });
    };

    const generateVariations = () => {
        setIsGenerating(true);
        // Simulate AI shuffle
        setTimeout(() => {
            const randomTemplate = POSTER_TEMPLATES[Math.floor(Math.random() * POSTER_TEMPLATES.length)];
            setActiveTemplate(randomTemplate);
            setIsGenerating(false);
        }, 800);
    };

    const selectTemplate = (t: PosterTemplate) => {
        setActiveTemplate(t);
        setView('editor');
    };

    // --- COMPONENTS ---
    const GalleryView = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto px-6 py-12 lg:px-20"
        >
            <div className="text-center mb-16">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-magical-500/10 border border-magical-500/20 text-magical-300 text-sm font-bold mb-8 shadow-lg"
                >
                    <RiSparkling2Line className="w-4 h-4" />
                    Wishprise Studio 🎨
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight tracking-tight">
                    Design Stunning Birthday <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-magical-400 via-pink-400 to-orange-400">Posters in Seconds 🎂</span>
                </h1>
                <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto">
                    Create scroll-stopping, heart-touching designs with Wishprise ✨
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {POSTER_TEMPLATES.map((t, idx) => (
                    <motion.div
                        key={t.id}
                        whileHover={{ scale: 1.05, y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectTemplate(t)}
                        className="group relative aspect-[4/5] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer shadow-2xl"
                    >
                        {/* Realistic Template Preview (Simplified CSS representation) */}
                        <div className="absolute inset-0 flex flex-col p-8 transition-transform duration-700 group-hover:scale-110" style={{ background: t.colors.bg }}>
                            <div className="w-12 h-1 px-4 bg-magical-500/20 rounded-full mb-auto"></div>
                            <h3 className="text-2xl font-serif mb-2" style={{ color: t.colors.text }}>Sample Name</h3>
                            <p className="text-xs opacity-60 line-clamp-2" style={{ color: t.colors.text }}>A heartfelt birthday message template.</p>
                        </div>

                        {/* Overlay Details */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 backdrop-blur-sm">
                            <span className="text-white font-bold text-lg mb-1">{t.name}</span>
                            <span className="text-slate-300 text-sm mb-4">{t.category}</span>
                            <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2">
                                Use Design <RiMagicLine />
                            </button>
                        </div>

                        {t.tag && (
                            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white text-slate-950 text-xs font-black uppercase tracking-wider shadow-xl z-20">
                                {t.tag}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 text-center text-slate-500 font-serif italic text-lg">
                More templates coming every week ✨
            </div>

            {/* Emotional CTA to /create */}
            <div className="mt-32 mb-8 max-w-2xl mx-auto text-center animate-fade-in px-6">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
                    Want to make it even more special? ✨
                </h3>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                    Don't just design a poster, create a moment that lasts forever. Our main surprise builder helps you craft a complete digital journey they'll never forget.
                </p>
                <Link
                    to="/create"
                    className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-magical-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-[0_10px_40px_rgba(139,38,242,0.3)] hover:shadow-[0_15px_60px_rgba(139,38,242,0.5)] hover:-translate-y-1 transition-all group w-full sm:w-auto"
                >
                    Build a Complete Surprise <RiMagicLine className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform shrink-0" />
                </Link>
            </div>
        </motion.div>
    );

    const EditorView = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] relative"
        >
            {/* LEFT: DESIGN PANEL + STYLE PANEL (Combined for mobile toggling) */}
            <div className={`w-full lg:w-[400px] h-full bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 flex flex-col overflow-y-auto no-scrollbar ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 space-y-12 pb-32">


                    {/* Media Only if tab is edit or styles (desktop always) */}
                    {(mobileTab === 'edit' || window.innerWidth >= 1024) && (
                        <>
                            <section>
                                <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-6 flex items-center gap-2">
                                    <RiImageLine className="text-magical-400" /> Upload Image
                                </h3>
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-800 rounded-[2rem] hover:border-magical-500/50 hover:bg-magical-500/5 transition-all cursor-pointer group overflow-hidden relative">
                                    {imageObj ? (
                                        <img src={imageObj.src} alt="Upload" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-center p-6">
                                            <RiUploadCloud2Line className="w-10 h-10 text-slate-600 mb-3 group-hover:text-magical-400 group-hover:animate-bounce" />
                                            <p className="text-sm font-bold text-slate-500">Drop your best birthday photo here</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </section>

                            <section>
                                <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-6 flex items-center gap-2">
                                    <RiFontSize className="text-pink-400" /> Messaging
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        placeholder="Name or Headline"
                                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-magical-500 transition-all font-bold text-lg"
                                    />
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Your heart-touching message..."
                                        rows={4}
                                        className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-magical-500 transition-all resize-none text-sm leading-relaxed"
                                    />
                                </div>
                            </section>
                        </>
                    )}

                    {/* Styling Only if tab is styles or edit (desktop always) */}
                    {(mobileTab === 'styles' || window.innerWidth >= 1024) && (
                        <>
                            <section>
                                <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-6 flex items-center gap-2">
                                    <RiPaletteLine className="text-orange-400" /> Pro Styles
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <label className="text-[10px] uppercase text-slate-500 mb-2 block font-bold">Text Align</label>
                                        <div className="flex gap-2">
                                            {['left', 'center', 'right'].map(a => (
                                                <button
                                                    key={a}
                                                    onClick={() => setTextAlign(a as any)}
                                                    className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center ${textAlign === a ? 'bg-magical-500 text-white shadow-lg' : 'bg-slate-950 text-slate-500'}`}
                                                >
                                                    {a === 'left' ? 'L' : a === 'center' ? 'C' : 'R'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <label className="text-[10px] uppercase text-slate-500 mb-2 block font-bold">Font Size</label>
                                        <input
                                            type="range"
                                            min="60" max="250"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            className="w-full accent-magical-500"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-6 flex items-center gap-2">
                                    <RiLayoutMasonryLine className="text-blue-400" /> Page Size
                                </h3>
                                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
                                    {['Square (1:1)', 'Post (4:5)', 'Story (9:16)'].map(s => {
                                        const ratio = s.split('(')[1].split(')')[0] as AspectRatio;
                                        return (
                                            <button
                                                key={ratio}
                                                onClick={() => setAspectRatio(ratio)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all ${aspectRatio === ratio ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {s.split(' ')[0]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* CENTER: CANVAS STAGE */}
            <div className={`flex-1 bg-slate-900/40 relative flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-hidden ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTemplate.id}-${aspectRatio}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group/canvas shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden"
                        style={{
                            aspectRatio: aspectRatio === '1:1' ? '1/1' : aspectRatio === '4:5' ? '4/5' : '9/16',
                            maxHeight: '80%',
                            maxWidth: '90%',
                            height: 'auto'
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain cursor-crosshair bg-black"
                        />

                        <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none group-hover/canvas:border-white/10 transition-colors"></div>
                    </motion.div>
                </AnimatePresence>

                {/* AI Shuffle Floating Tool */}
                <div className="absolute bottom-32 lg:bottom-40 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl z-20">
                    <button
                        onClick={generateVariations}
                        disabled={isGenerating}
                        className="flex items-center gap-3 text-white font-bold text-sm whitespace-nowrap hover:text-magical-300 transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? <RiSparkling2Line className="animate-spin" /> : <RiMagicLine className="text-magical-400" />}
                        Generate More Styles
                    </button>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex gap-2 overflow-x-auto max-w-[200px] no-scrollbar">
                        {POSTER_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTemplate(t)}
                                className={`w-6 h-6 rounded-full border border-white/20 shrink-0 transition-transform hover:scale-125 ${activeTemplate.id === t.id ? 'ring-2 ring-magical-500 ring-offset-2 ring-offset-slate-950' : ''}`}
                                style={{ background: t.colors.bg }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* PRO EXPORT STICKY BAR / TAB NAV */}
            <footer className="fixed bottom-0 left-0 w-full z-100 lg:z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 h-24 lg:h-24 flex items-center px-4 lg:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    {/* Desktop Template Info */}
                    <div className="hidden lg:block">
                        <span className="text-xs uppercase tracking-widest font-black text-slate-500">Editing Now</span>
                        <p className="text-white font-serif">{activeTemplate.name}</p>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="lg:hidden flex-1 grid grid-cols-4 items-center h-full">
                        <button
                            onClick={() => setView('gallery')}
                            className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-white"
                        >
                            <RiLayoutMasonryLine className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Start Over</span>
                        </button>
                        <button
                            onClick={() => setMobileTab('edit')}
                            className={`flex flex-col items-center justify-center gap-1 ${mobileTab === 'edit' ? 'text-magical-400' : 'text-slate-500'}`}
                        >
                            <RiFontSize className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Edit</span>
                        </button>
                        <button
                            onClick={() => setMobileTab('styles')}
                            className={`flex flex-col items-center justify-center gap-1 ${mobileTab === 'styles' ? 'text-magical-400' : 'text-slate-500'}`}
                        >
                            <RiPaletteLine className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Styles</span>
                        </button>
                        <button
                            onClick={() => setMobileTab('preview')}
                            className={`flex flex-col items-center justify-center gap-1 ${mobileTab === 'preview' ? 'text-magical-400' : 'text-slate-500'}`}
                        >
                            <RiImageLine className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Preview</span>
                        </button>
                    </div>

                    {/* Desktop & Main Action buttons */}
                    <div className="flex items-center gap-4 w-auto ml-auto lg:ml-0">
                        <div className="hidden lg:flex gap-4">
                            <button
                                onClick={() => setView('gallery')}
                                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                            >
                                <RiLayoutMasonryLine /> Templates
                            </button>
                        </div>

                        <button
                            onClick={downloadPoster}
                            className="flex items-center justify-center gap-3 px-6 lg:px-10 py-4 lg:py-4 rounded-2xl bg-gradient-to-r from-magical-600 to-pink-600 text-white font-black shadow-2xl hover:-translate-y-1 transition-all group shrink-0"
                        >
                            <RiDownload2Line className="w-6 h-6 group-hover:animate-bounce" />
                            <span className="hidden sm:inline">Download</span> HD
                        </button>
                    </div>
                </div>
            </footer>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden selection:bg-magical-500/30">
            <Seo
                title="Wishprise Poster Studio | Professional Birthday Poster Maker"
                description="Design high-end, premium birthday posters in seconds. Choose from curated templates and customize with AI-styles."
                path="/poster"
            />

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-950/50 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 md:px-12">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Wishprise" className="h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-white font-serif italic text-2xl hidden sm:inline tracking-tight">Wishprise</span>
                </Link>

                <div className="ml-auto flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm font-semibold bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <RiHome5Line className="w-4 h-4" /> Home
                    </Link>
                </div>
            </header>

            {/* Content Switcher */}
            <main className="relative z-30 flex-1 flex flex-col pt-20">
                <AnimatePresence mode="wait">
                    {view === 'gallery' ? (
                        <GalleryView key="gallery" />
                    ) : (
                        <EditorView key="editor" />
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Only in Gallery View */}
            {view === 'gallery' && (
                <footer className="relative z-30 pb-20 pt-12 border-t border-white/5 text-center">
                    <div className="text-slate-400 font-bold mb-2">Powered by Wishprise ✨</div>
                    <div className="text-slate-600 text-sm font-light italic">Create memories, not just designs.</div>
                </footer>
            )}
        </div>
    );
};
