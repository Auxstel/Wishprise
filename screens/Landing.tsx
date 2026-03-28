import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { AdComponent } from '../components/AdComponent';
import { Landing3D } from '../components/Landing3D';
import { Logo } from '../components/Logo';
import { Seo } from '../components/Seo';
import { Schema } from '../components/Schema';
import { ScratchCard } from '../components/ScratchCard';
import ButtonWithIcon from '@/components/ui/button-witn-icon';
import DynamicTestimonials from '../components/DynamicTestimonials';
import HowItWorks from '../components/HowItWorks';
import GiftThemBack from '../components/GiftThemBack';
import { getFeedbackStats } from '../services/feedbackService';
import { Navbar } from '../components/ui/mini-navbar';

export const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [senderName, setSenderName] = React.useState('');
    const [phase, setPhase] = React.useState<'input' | 'scratch' | 'complete'>('input');
    const [scratchRevealed, setScratchRevealed] = React.useState(false);
    const [stats, setStats] = React.useState({ average: 4.9, count: 124 });

    React.useEffect(() => {
        const fetchStats = async () => {
            const data = await getFeedbackStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden">
            <Seo
                title="Create a 3D Birthday Wish - The #1 Interactive Birthday Surprise"
                description="Birthday wish karne ka naya tarika! Create stunning, interactive 3D birthday surprises with custom cakes, music, and personalized messages. Send via WhatsApp. Free!"
                path="/"
                schemaType="FAQPage"
                faqData={[
                    {
                        question: "Is Wishprise really free?",
                        answer: "Yes! Wishprise is completely free to use. We sustain the service through non-intrusive advertisements. No hidden fees, no premium tiers."
                    },
                    {
                        question: "Do I need to create an account?",
                        answer: "No account required! Just create your surprise and share the link. It's that simple."
                    },
                    {
                        question: "What is the 'one-time view' feature?",
                        answer: "This special feature deletes your uploaded photos and audio after the recipient views them once. It's perfect for private, personal surprises."
                    }
                ]}
            />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": "How to Create a Virtual Birthday Surprise",
                "step": [
                    {
                        "@type": "HowToStep",
                        "name": "Personalize Your Surprise",
                        "text": "Add your recipient's name, choose a cake style, write a heartfelt message, and optionally upload a photo or voice note."
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Share the Link",
                        "text": "Get a unique link to your surprise and send it via WhatsApp, text, or email."
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Watch the Magic",
                        "text": "Your recipient opens the link and experiences a stunning 3D birthday animation."
                    }
                ]
            }} />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "Product",
                "name": "Wishprise 3D Birthday Wish Maker",
                "description": "The world's first interactive 3D birthday wish maker. Create personalized virtual surprises for free.",
                "brand": {
                    "@type": "Brand",
                    "name": "Wishprise"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": stats.average.toString(),
                    "reviewCount": stats.count.toString()
                }
            }} />

            <Schema data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://wishprise.online"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Birthday Wish Maker",
                        "item": "https://wishprise.online"
                    }
                ]
            }} />

            {/* 3D Background (Global & Fixed) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-950/40 to-slate-950 z-10 pointer-events-none"></div>
                <Landing3D />
            </div>

            {/* Mini Navbar (Floating) */}
            <Navbar />

            {/* SECTION 1: HERO (Full Screen Height, but natural flow) */}
            <div className="relative min-h-screen w-full flex flex-col">

                {/* Content */}
                <div className="relative z-20 flex-1 flex flex-col items-center pt-24 md:pt-32 p-6 text-center pb-[200px] md:pb-6">

                    <div className="backdrop-blur-md bg-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-[0_0_80px_rgba(139,38,242,0.2)] animate-fade-in-up w-full max-w-3xl mx-auto flex flex-col items-center my-4 relative">
                        <div className="inline-block py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 md:mb-8 shadow-glow">
                            #1 Personalized 3D Birthday Wish Maker
                        </div>

                        <div className="mb-4 transform hover:scale-105 transition-transform duration-500" aria-label="Wishprise Magical Logo">
                            <Logo size="xl" />
                        </div>

                        <h2 className="text-xl md:text-3xl font-light text-white mt-4 drop-shadow-lg leading-tight">
                            Create a <span className="text-magical-300 font-hand text-3xl md:text-4xl">Magical</span> Birthday Surprise
                        </h2>

                        <div className="space-y-4 mt-6 max-w-2xl mx-auto">
                            <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed tracking-wide opacity-90">
                                Create a <span className="text-shimmer animate-shimmer font-bold">stunning, interactive 3D birthday surprise</span> for someone you love.
                            </p>
                            <p className="flex items-center justify-center gap-4 text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-amber-200/40">
                                <span className="flex items-center gap-1.5"><span className="text-magical-400">⚡</span> No login required</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-magical-500/50"></span>
                                <span className="flex items-center gap-1.5"><span className="text-magical-400">🔒</span> Private & Secure</span>
                            </p>
                        </div>

                        <div className="mt-6 md:mt-8 w-full max-w-md mx-auto flex flex-col justify-center">
                            {phase === 'input' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <p className="text-lg md:text-xl font-serif italic text-white/70">
                                        "Because behind every surprise is someone who truly cares."
                                    </p>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="What's your name?"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && senderName.trim() && setPhase('scratch')}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none focus:border-magical-500/50 transition-all font-sans text-lg text-center"
                                        />
                                        <ButtonWithIcon
                                            text="Next Magic Step"
                                            onClick={() => senderName.trim() && setPhase('scratch')}
                                            disabled={!senderName.trim()}
                                            className="w-full text-white text-xs md:text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {phase === 'scratch' && (
                                <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
                                    <ScratchCard
                                        width={450}
                                        height={260}
                                        onReveal={() => setScratchRevealed(true)}
                                    >
                                        <div className="flex flex-col items-center gap-4 px-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-magical-600 bg-magical-50 px-3 py-1 rounded-full">Your Impact</p>
                                            <p className="text-base md:text-xl text-slate-800 font-serif leading-relaxed italic">
                                                <span className="font-bold text-slate-950 not-italic block mb-2 text-xl md:text-2xl">{senderName},</span>
                                                A surprise like this is a reminder that they are <span className="text-magical-600 font-bold not-italic">seen, loved</span>, and truly matter. You're about to make their world a little brighter today. ❤️
                                            </p>
                                        </div>
                                    </ScratchCard>

                                    {!scratchRevealed ? (
                                        <p className="text-sm text-amber-200/60 animate-pulse font-medium tracking-[0.2em] uppercase">
                                            Scratch the gold to see your impact...
                                        </p>
                                    ) : (
                                        <ButtonWithIcon
                                            text="Got it! Let's build it"
                                            onClick={() => setPhase('complete')}
                                            className="animate-fade-in text-white text-xs md:text-sm"
                                        />
                                    )}
                                </div>
                            )}

                            {phase === 'complete' && (
                                <div className="animate-fade-in flex flex-col items-center py-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-magical-500 to-amber-300 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                        <ButtonWithIcon
                                            text="Create My 3D Surprise Now"
                                            onClick={() => navigate('/create')}
                                            className="shadow-[0_0_40px_rgba(139,38,242,0.4)] font-serif tracking-[0.1em] md:tracking-[0.2em] uppercase md:scale-110 text-white text-xs md:text-sm"
                                        />
                                    </div>
                                    <p className="mt-6 md:mt-10 text-magical-300 font-hand text-2xl md:text-4xl animate-bounce-subtle">
                                        The magic begins with you, {senderName}...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* SECTION 2: HOW IT WORKS */}
            <HowItWorks />

            {/* SECTION 3: TESTIMONIALS */}
            <div className="relative z-20 bg-slate-950/20 backdrop-blur-sm py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Moments of <span className="text-magical-300 font-hand text-5xl md:text-6xl text-shimmer animate-shimmer">Joy</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-serif italic text-lg opacity-80">Join thousands who made their loved ones smile with Wishprise.</p>
                    </div>

                    <DynamicTestimonials />
                </div>
            </div>

            {/* SECTION 4: LATEST RESOURCES (For AdSense/SEO visibility) */}
            <div className="relative z-20 bg-slate-900/10 backdrop-blur-sm py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Celebration Guides</h2>
                            <p className="text-gray-400">Expert tips for making every birthday unforgettable.</p>
                        </div>
                        <Link to="/resources" className="text-magical-400 font-bold flex items-center gap-2 hover:text-magical-300 transition-colors group">
                            View All Resources <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Link to="/resources/birthday-traditions-around-the-world" className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-magical-500/50 transition-all group">
                            <div className="text-magical-400 text-xs font-bold uppercase tracking-widest mb-4">Culture</div>
                            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-magical-300 transition-colors">Birthday Traditions Around the World</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">From nose-greasing in Canada to ear-pulling in Italy, discover unique global customs.</p>
                            <span className="text-magical-400 text-sm font-medium">Read More →</span>
                        </Link>

                        <Link to="/resources/modern-birthday-party-planning-checklist-2026" className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-magical-500/50 transition-all group">
                            <div className="text-magical-400 text-xs font-bold uppercase tracking-widest mb-4">Planning</div>
                            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-magical-300 transition-colors">Modern Party Planning Checklist</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">The ultimate timeline for organizing a stress-free and legendary celebration in 2026.</p>
                            <span className="text-magical-400 text-sm font-medium">Read More →</span>
                        </Link>

                        <Link to="/resources/the-science-of-surprises" className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-magical-500/50 transition-all group">
                            <div className="text-magical-400 text-xs font-bold uppercase tracking-widest mb-4">Psychology</div>
                            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-magical-300 transition-colors">The Science of Surprises</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">Explore the neurochemistry of dopamine and why unexpected joy is so powerful.</p>
                            <span className="text-magical-400 text-sm font-medium">Read More →</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* SECTION 5: FAQ */}
            <div className="relative z-20 bg-gradient-to-b from-slate-950/20 to-slate-900/40 py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-serif text-white">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Everything you need to know about Wishprise.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-2">Is Wishprise really free?</h3>
                            <p className="text-gray-400">Yes! Wishprise is completely free to use. We sustain the service through non-intrusive advertisements. No hidden fees, no premium tiers.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-2">Do I need to create an account?</h3>
                            <p className="text-gray-400">No account required! Just create your surprise and share the link. It's that simple.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-2">What is the "one-time view" feature?</h3>
                            <p className="text-gray-400">This special feature deletes your uploaded photos and audio after the recipient views them once. It's perfect for private, personal surprises that you don't want stored forever.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-2">Will my surprise work on all devices?</h3>
                            <p className="text-gray-400">Absolutely! Wishprise is designed to work beautifully on smartphones, tablets, and computers. The 3D experience adapts to any screen size.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white mb-2">How long is my surprise link valid?</h3>
                            <p className="text-gray-400">Your surprise link is valid for 30 days. Once the recipient views the surprise, the content is automatically deleted for privacy. Unviewed surprises are cleaned up after 30 days.</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* SECTION 5: THE ULTIMATE GUIDE */}
            <div className="relative z-20 bg-slate-950/20 backdrop-blur-sm px-6 pb-24">
                <div className="max-w-4xl mx-auto border-t border-white/5 pt-24 text-gray-400 leading-relaxed font-light">
                    <h2 className="text-3xl font-serif text-white mb-8 text-center">The Ultimate Guide to Digital Birthday Surprises</h2>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">Why Choose a Digital Birthday Surprise?</h3>
                            <p>
                                In our increasingly connected world, physical distances often separate us from our loved ones on their special days.
                                A digital birthday surprise bridges that gap instantly. Unlike traditional e-cards which can feel generic, Wishprise offers
                                an immersive 3D experience that feels like a genuine gift. It shows you put thought and effort into making their day magical,
                                regardless of how many miles lie between you.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">How to Create the Perfect Wish</h3>
                            <p>
                                Creating a memorable digital wish is an art. Start by choosing a cake flavor that you know they'd love in real life.
                                In our <strong>Customize</strong> step, select from options like Rich Chocolate, Classic Vanilla, or Funfetti.
                                Next, personalize the message. Don't just stick to "Happy Birthday" — mention a shared memory or an inside joke to make it truly personal.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">Adding Audio and Visuals</h3>
                            <p>
                                To elevate your surprise, take advantage of our multimedia features. You can upload a cherished photo to appear next to the cake.
                                Even better, record a voice note! Hearing your voice singing "Happy Birthday" or sharing a heartfelt message adds a layer of emotional
                                warmth that text alone cannot convey. Our platform supports easy audio recording directly from your browser.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">The "One-Time View" Feature Explained</h3>
                            <p>
                                Privacy is paramount. That's why we introduced the "One-Time View" option. If you're sharing personal photos or intimate audio messages,
                                you might not want them lingering on the internet forever. By selecting this option, all uploaded media is permanently deleted from our servers
                                immediately after your recipient views the surprise. It empowers you to share genuine, unscripted moments with total peace of mind.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">Why Wishprise is the Best Birthday Online Wisher</h3>
                            <p>
                                When searching for a <strong>birthday wish maker</strong> or a <strong>birthday online wisher</strong>, you'll find many static e-cards. Wishprise is different.
                                We provide a fully immersive 3D environment that the recipient can interact with.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-3">Tips for Sharing Your Dream Wish</h3>
                            <p>
                                Once your surprise is ready, you'll get a unique link. For the best impact, send this link when you know they have a quiet moment to enjoy it.
                                Suggest they wear headphones for the full 3D audio experience. Whether you share it via WhatsApp, Messenger, or Email, the preview image will
                                hint at the magic inside without spoiling the full 3D reveal.
                            </p>
                        </section>
                    </div>
                </div>
            </div>


            {/* SECTION: FAQ (For SEO and User Trust) */}
            <div className="relative z-20 bg-slate-950/50 py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-16 text-center">Frequently Asked Questions</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {[
                            {
                                q: "What is Wishprise?",
                                a: "Wishprise is a free online tool to create interactive 3D birthday surprises. Instead of a simple text, you send a link that opens a magical 3D world with a cake, music, and your message."
                            },
                            {
                                q: "Is it really free?",
                                a: "Yes, 100% free. No hidden charges, no credits, and no login required to create or view surprises."
                            },
                            {
                                q: "How do I share the surprise?",
                                a: "Once you create a surprise, you get a unique link. You can copy and paste this link into WhatsApp, Instagram, or any messaging app."
                            },
                            {
                                q: "Does it work on mobile?",
                                a: "Absolutely. Wishprise is fully optimized for all mobile devices and browsers. No app download is needed."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-magical-500/30 transition-all">
                                <h3 className="text-white font-bold text-lg mb-3">{faq.q}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <GiftThemBack defaultExpanded={true} />

            {/* SECTION: Global Navigation Link Cloud (SEO Booster) */}
            <div className="relative z-20 bg-slate-900/40 py-16 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-[10px] text-magical-400 uppercase tracking-[0.3em] font-bold mb-8 opacity-60">Browse All Birthday Surprises</p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                        {[
                            { name: 'Best Friend', slug: 'friend' },
                            { name: 'Sister', slug: 'sister' },
                            { name: 'Brother', slug: 'brother' },
                            { name: 'Mom', slug: 'mom' },
                            { name: 'Dad', slug: 'dad' },
                            { name: 'Girlfriend', slug: 'girlfriend' },
                            { name: 'Boyfriend', slug: 'boyfriend' },
                            { name: 'Boss', slug: 'boss' },
                            { name: 'Colleague', slug: 'colleague' },
                            { name: 'Sister-in-law', slug: 'bhabhi' },
                            { name: 'Daughter', slug: 'daughter' },
                            { name: 'Son', slug: 'son' },
                            { name: 'Nephew', slug: 'nephew' },
                            { name: 'Niece', slug: 'niece' },
                            { name: 'Crush', slug: 'crush' }
                        ].map(rel => (
                            <Link
                                key={rel.slug}
                                to={`/birthday-wishes-for/my/${rel.slug}`}
                                className="text-sm text-slate-500 hover:text-white transition-colors underline decoration-slate-800 underline-offset-4"
                            >
                                Wishes for {rel.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 6: FOOTER */}
            <footer className="relative z-20 bg-slate-950/40 backdrop-blur-sm py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left" aria-label="Wishprise Branding">
                            <Logo size="sm" />
                            <p className="text-gray-600 text-sm mt-2">Making birthdays magical, one surprise at a time.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link to="/about" className="text-gray-400 hover:text-magical-400 transition-colors">About Us</Link>
                            <Link to="/ai-wishes" className="text-magical-400 hover:text-magical-300 transition-colors font-medium">AI Wishes ✨</Link>
                            <Link to="/poster" className="text-magical-400 hover:text-magical-300 transition-colors font-medium">Poster Studio 🎨</Link>
                            <Link to="/space-birthday" className="text-magical-400 hover:text-magical-300 transition-colors font-medium">NASA Birthday 🚀</Link>
                            <Link to="/gifts" className="text-magical-400 hover:text-magical-300 transition-colors font-medium">Gift Shop 🎁</Link>
                            <Link to="/resources" className="text-gray-400 hover:text-magical-400 transition-colors hidden md:inline">Resources</Link>
                            <Link to="/privacy" className="text-gray-400 hover:text-magical-400 transition-colors hidden md:inline">Privacy</Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center border-t border-slate-900 pt-6">
                        <p className="text-gray-600 text-sm">Wishprise © 2026. Crafted with love.</p>
                    </div>
                </div>
            </footer>

            {/* Sticky Ad Banner */}
            <div className="sticky bottom-0 z-50">
                <AdComponent type="banner" className="bg-black/80 backdrop-blur text-gray-500 border-t border-white/10" />
            </div>
        </div>
    );
};

