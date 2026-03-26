import React, { useState, useEffect } from 'react';
import { Seo } from '../components/Seo';
import { Rocket, Share2, CalendarDays, ExternalLink, Image as ImageIcon, Home } from 'lucide-react';
import { RiMagicLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Landing3D } from '../components/Landing3D';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY; // Managed via .env

interface NasaData {
    url: string;
    title: string;
    explanation: string;
    media_type: string;
    code?: number;
    msg?: string;
}

export const SpaceBirthday: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [data, setData] = useState<NasaData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Pre-fill with today's date minus 20 years as a good default demo
    useEffect(() => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 20);
        setSelectedDate(today.toISOString().split('T')[0]);
    }, []);

    const fetchSpaceImage = async () => {
        if (!selectedDate) {
            setError("Please select a date.");
            return;
        }

        const dateObj = new Date(selectedDate);
        const earliestNasaDate = new Date('1995-06-16');
        const today = new Date();

        if (dateObj < earliestNasaDate) {
            setError("NASA's APOD archive only goes back to June 16, 1995. Please pick a later date.");
            return;
        }

        if (dateObj > today) {
            setError("We can't see into the future yet! Please select a past date.");
            return;
        }

        setLoading(true);
        setError('');
        setInfo('');
        setData(null);

        let currentDateStr = selectedDate;
        let attempts = 0;
        const maxAttempts = 5; // Try up to 5 days back

        while (attempts < maxAttempts) {
            try {
                const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${currentDateStr}`);
                const result = await res.json();

                if (res.ok && result.url) {
                    setData(result);
                    if (attempts > 0) {
                        setInfo(`NASA didn't have an image for your exact date, so we found this stellar one from ${currentDateStr} instead!`);
                    }
                    setLoading(false);
                    return;
                }

                // If we get an error, prep for next day back
                const nextDate = new Date(currentDateStr);
                nextDate.setDate(nextDate.getDate() - 1);
                currentDateStr = nextDate.toISOString().split('T')[0];
                attempts++;

            } catch (err) {
                console.error('NASA API Error:', err);
                setError("Failed to reach NASA's servers. Please try again later.");
                break;
            }
        }

        setError("NASA doesn't have an image archived for this exact week. Try a different month or year!");
        setLoading(false);
    };

    const shareFeature = async () => {
        if (!data) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `My Space Birthday - ${data.title}`,
                    text: `On my birthday, NASA captured this amazing image: ${data.title}. See what the universe looked like on yours!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(`On my birthday, NASA captured this amazing image: ${data.title}. See yours at: ${window.location.href}`);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden relative">
            <Seo
                title="Your Space Birthday | See the Universe on Your Birthday"
                description="Discover what NASA saw in the universe on the exact day you were born. Share your stellar birthday image with friends."
                path="/space-birthday"
            />

            {/* Space Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-slate-950/40 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="Wishprise" className="h-8 object-contain group-hover:scale-105 transition-transform" />
                    <span className="text-white font-serif italic text-lg hidden sm:inline">Wishprise</span>
                </Link>
                <Link to="/" className="ml-auto flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    <Home className="w-4 h-4" /> Home
                </Link>
            </header>

            <div className="relative z-10 flex flex-col items-center pt-24 md:pt-32 p-6 max-w-5xl mx-auto w-full min-h-screen">

                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6 backdrop-blur-md">
                        <Rocket className="w-4 h-4" />
                        Powered by Wishprise
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight drop-shadow-md">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Space Birthday</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        What was happening in the cosmos when you were born? Enter your birth date to reveal the universe's gift to you.
                    </p>
                </div>

                {/* Date Picker Card */}
                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] mb-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <label className="block text-sm font-medium text-cyan-100 mb-4 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Select Your Birth Date
                    </label>

                    <div className="flex gap-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]} // Cannot pick future dates
                            className="flex-1 bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-text"
                            // Adding specific styling for date picker icon to ensure it's visible in dark mode
                            style={{ colorScheme: 'dark' }}
                        />
                        <button
                            onClick={fetchSpaceImage}
                            disabled={loading}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Launch'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    {info && (
                        <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-xl text-sm animate-fade-in flex items-center gap-2">
                            <RiMagicLine className="animate-pulse" /> {info}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {data && (
                    <div className="w-full bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in flex flex-col md:flex-row mb-16">

                        {/* Media Area */}
                        <div className="md:w-1/2 relative min-h-[400px] bg-black flex items-center justify-center p-4">
                            {data.media_type === 'video' ? (
                                <div className="w-full text-center space-y-4">
                                    <Rocket className="w-16 h-16 text-slate-600 mx-auto" />
                                    <p className="text-slate-400">NASA captured a video on this day.</p>
                                    <a href={data.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
                                        Watch on YouTube <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            ) : (
                                <img
                                    src={data.url}
                                    alt={data.title}
                                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-black/50 drop-shadow-2xl"
                                />
                            )}
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-xs font-mono text-cyan-300 px-3 py-1 rounded border border-cyan-500/30">
                                NASA ARCHIVE // {selectedDate}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                            <h2 className="text-3xl font-serif text-white mb-6 leading-tight group">
                                {data.title}
                            </h2>

                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-8 text-slate-300 font-light leading-relaxed">
                                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-cyan-400 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                    {data.explanation}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={shareFeature}
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)]"
                                >
                                    <Share2 className="w-5 h-5" /> Share My Universe
                                </button>
                                {data.media_type === 'image' && (
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <ImageIcon className="w-5 h-5" /> View Full Res
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* Emotional CTA to /create */}
                <div className="mt-12 mb-20 max-w-2xl mx-auto text-center animate-fade-in px-6">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
                        Want to make it even more special? ✨
                    </h3>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                        Don't just look at the stars, create a moment that lasts forever. Our main surprise builder helps you craft a complete digital journey they'll never forget.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-magical-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-[0_10px_40px_rgba(139,38,242,0.3)] hover:shadow-[0_15px_60px_rgba(139,38,242,0.5)] hover:-translate-y-1 transition-all group w-full sm:w-auto"
                    >
                        Build a Complete Surprise <RiMagicLine className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform shrink-0" />
                    </Link>
                </div>

            </div>
        </div>
    );
};
