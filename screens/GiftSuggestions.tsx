import React, { useState, useMemo } from 'react';
import { Seo } from '../components/Seo';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Gift, Percent, Star, Home } from 'lucide-react';
import { RiMagicLine } from 'react-icons/ri';
import { Landing3D } from '../components/Landing3D';
import { giftProducts, GIFT_CATEGORIES, GiftCategory, AFFILIATE_DISCLOSURE } from '../data/giftProducts';

export const GiftSuggestions: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<GiftCategory | 'all'>('all');
    const [budgetLimit, setBudgetLimit] = useState<number | null>(null);

    const filteredProducts = useMemo(() => {
        return giftProducts.filter(product => {
            const matchesCategory = selectedCategory === 'all' || product.category.includes(selectedCategory);
            const matchesBudget = !budgetLimit || product.price <= budgetLimit;
            return matchesCategory && matchesBudget;
        });
    }, [selectedCategory, budgetLimit]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden relative">
            <Seo
                title="Curated Birthday Gift Ideas | Handpicked Gifts"
                description="Find the perfect birthday gift. Carefully curated selection of premium gifts, tech gadgets, and romantic presents for your loved ones."
                path="/gifts"
            />

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-950/40 to-slate-950 z-10 pointer-events-none"></div>
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

            <div className="relative z-10 flex-1 flex flex-col pt-24 md:pt-32 p-6 max-w-7xl mx-auto w-full">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-magical-300 text-sm font-medium mb-6">
                        <Gift className="w-4 h-4" />
                        The Wishprise Curated Shop
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight drop-shadow-md">
                        Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-magical-400 to-blue-400">Perfect Gift</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        We've scoured the internet for the most magical, memorable, and high-quality gifts so you don't have to.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl mb-12 flex flex-col md:flex-row gap-8 shadow-2xl">

                    {/* Category Filter */}
                    <div className="flex-1">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4" /> Who is it for?
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === 'all'
                                    ? 'bg-magical-500 text-white shadow-[0_0_20px_rgba(139,38,242,0.4)] border border-magical-400'
                                    : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                ✨ All Gifts
                            </button>
                            {Object.entries(GIFT_CATEGORIES).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key as GiftCategory)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === key
                                        ? 'bg-magical-500 text-white shadow-[0_0_20px_rgba(139,38,242,0.4)] border border-magical-400'
                                        : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                                        }`}
                                >
                                    {value.emoji} {value.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-slate-800"></div>

                    {/* Budget Filter */}
                    <div className="md:w-1/3">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                            <Percent className="w-4 h-4" /> Budget
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: 'Any', value: null },
                                { label: 'Under ₹500', value: 500 },
                                { label: 'Under ₹1500', value: 1500 },
                                { label: 'Under ₹5000', value: 5000 }
                            ].map((budget) => (
                                <button
                                    key={budget.label}
                                    onClick={() => setBudgetLimit(budget.value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${budgetLimit === budget.value
                                        ? 'bg-slate-200 text-slate-900 shadow-lg'
                                        : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                                        }`}
                                >
                                    {budget.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-magical-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_40px_rgba(139,38,242,0.15)] transition-all duration-500">

                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-white/5 p-8 flex items-center justify-center">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                                    loading="lazy"
                                />
                                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold border border-white/10">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight group-hover:text-magical-300 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-slate-400 text-sm font-serif italic mb-6 line-clamp-2 opacity-80">
                                    "{product.quote}"
                                </p>

                                <a
                                    href={product.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-white text-slate-950 hover:bg-slate-200 hover:scale-[1.02] active:scale-95 rounded-xl font-bold transition-all"
                                >
                                    Buy on Amazon <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-slate-400 animate-fade-in text-xl font-light">
                        Hmm, no gifts found matching those filters. Try clearing them!
                    </div>
                )}


                {/* Emotional CTA to /create */}
                <div className="mt-12 mb-20 max-w-2xl mx-auto text-center animate-fade-in px-6">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
                        Want to make it even more special? ✨
                    </h3>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                        Don't just pick a gift, create a moment that lasts forever. Our main surprise builder helps you craft a complete digital journey they'll never forget.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-magical-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-[0_10px_40px_rgba(139,38,242,0.3)] hover:shadow-[0_15px_60px_rgba(139,38,242,0.5)] hover:-translate-y-1 transition-all group w-full sm:w-auto"
                    >
                        Build a Complete Surprise <RiMagicLine className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform shrink-0" />
                    </Link>
                </div>

                {/* Disclosure */}
                <div className="text-center text-slate-600 text-xs py-8 border-t border-white/5 font-medium">
                    {AFFILIATE_DISCLOSURE}
                </div>
            </div>
        </div>
    );
};
