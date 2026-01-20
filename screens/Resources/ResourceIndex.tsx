import React from 'react';
import { Seo } from '../../components/Seo';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const ResourceIndex: React.FC = () => {
    const articles = [
        {
            title: "10 Creative Virtual Birthday Ideas for 2026",
            excerpt: "Discover how to host memorable birthday parties online. From 3D wishes to virtual escape rooms, here are the top trends.",
            link: "/resources/virtual-birthday-ideas-2026",
            date: "Jan 18, 2026",
            readTime: "5 min read"
        },
        {
            title: "The Ultimate Guide to Long-Distance Birthdays",
            excerpt: "Distance shouldn't dim the celebration. Learn how to make your loved ones feel special even when they are miles away.",
            link: "/resources/long-distance-birthday-guide",
            date: "Jan 15, 2026",
            readTime: "4 min read"
        },
        {
            title: "Digital vs. Physical Birthday Cards: Which is Better?",
            excerpt: "A deep dive into the environmental impact, cost, and emotional weight of digital greetings versus traditional paper cards.",
            link: "/resources/digital-vs-physical-cards",
            date: "Jan 12, 2026",
            readTime: "6 min read"
        },
        {
            title: "Birthday Message Etiquette: What to Write",
            excerpt: "Stuck on what to say? We provide templates for funny, sentimental, and professional birthday wishes.",
            link: "/resources/birthday-message-etiquette",
            date: "Jan 10, 2026",
            readTime: "4 min read"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <Seo
                title="Wishprise Resources - Birthday Tips & Guides"
                description="Expert advice on virtual celebrations, birthday etiquette, and making digital wishes magical."
            />

            <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo size="sm" />
                </Link>
                <Link to="/" className="text-white font-medium hover:text-magical-300 transition-colors">
                    Back to Home
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Birthday Resources</h1>
                    <p className="text-xl text-slate-400">Tips, tricks, and guides for magical celebrations.</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {articles.map((article, index) => (
                        <Link key={index} to={article.link} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-magical-500/50 transition-colors group">
                            <div className="flex justify-between items-center text-xs text-magical-400 font-bold tracking-wider uppercase mb-4">
                                <span>{article.date}</span>
                                <span>{article.readTime}</span>
                            </div>
                            <h2 className="text-2xl font-serif text-white mb-3 group-hover:text-magical-300 transition-colors">
                                {article.title}
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                {article.excerpt}
                            </p>
                            <div className="mt-6 text-magical-400 font-medium flex items-center gap-2">
                                Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="py-12 border-t border-white/10 text-center text-slate-500 text-sm mt-20">
                <p>&copy; {new Date().getFullYear()} Wishprise. All rights reserved.</p>
            </footer>
        </div>
    );
};
