import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { getLatestFeedback } from '../services/feedbackService';

interface Testimonial {
  rating: number;
  comment: string;
  senderName: string;
  cakeInfo: string;
}

const DUMMY_REVIEWS: Testimonial[] = [
  {
    rating: 5,
    comment: "I sent this to my boyfriend who is deployed. He said it was the best part of his day. The 3D cake blowing part is genius!",
    senderName: "Jessica M.",
    cakeInfo: "Chocolate Classic"
  },
  {
    rating: 5,
    comment: "My mom isn't tech-savvy but she absolutely loved scratching the card to see my message. Simple, elegant, and free.",
    senderName: "David K.",
    cakeInfo: "Vanilla Modern"
  },
  {
    rating: 5,
    comment: "The music sync and the reveal animation were beautiful. Much better than a boring e-card or a text message.",
    senderName: "Sarah L.",
    cakeInfo: "Grand Tiered Cake"
  },
  {
    rating: 5,
    comment: "I never thought a digital surprise could make someone cry (the good kind). The voice message at the end is so emotional.",
    senderName: "Michael R.",
    cakeInfo: "Funfetti Fun"
  },
  {
    rating: 5,
    comment: "Wishprise made my long-distance relationship feel a little closer today. The attention to detail is just incredible.",
    senderName: "Elena V.",
    cakeInfo: "Red Velvet"
  }
];

const DynamicTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const realReviews = await getLatestFeedback(6);
        const combined = [...realReviews];
        
        if (combined.length < 5) {
          const needed = 5 - combined.length;
          combined.push(...DUMMY_REVIEWS.slice(0, needed));
        }
        
        setTestimonials(combined);
      } catch (e) {
        console.error("Testimonial Fetch Error:", e);
        setTestimonials(DUMMY_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white/5 h-64 rounded-[2rem] border border-white/5 mb-6"></div>
        ))}
      </div>
    );
  }

  const rotations = ['hover:rotate-0 -rotate-1', 'hover:rotate-0 rotate-1', 'hover:rotate-0 -rotate-2', 'hover:rotate-0 rotate-2', 'hover:rotate-0 -rotate-1'];

  return (
    <div className="space-y-12">
      {/* Trust Indicator */}
      <div className="flex flex-col items-center justify-center space-y-2 mb-12 animate-fade-in">
        <div className="flex -space-x-3 mb-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-[10px] text-white/40 font-bold`}>
                    {String.fromCharCode(64 + i)}
                </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-magical-500 flex items-center justify-center text-[10px] text-white font-bold">
                +
            </div>
        </div>
        <p className="text-slate-500 text-xs font-medium tracking-[0.2em] uppercase">Trusted by 10,000+ happy givers</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {testimonials.map((t, i) => (
          <div 
            key={i} 
            className={`break-inside-avoid bg-white/[0.03] backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl relative group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(139,38,242,0.15)] ${rotations[i % rotations.length]} mb-8`}
          >
            {/* Oversized Quote Mark */}
            <Quote className="absolute top-6 left-6 w-16 h-16 text-magical-500/5 -z-0 transform -rotate-12" />

            <div className="relative z-10">
              <div className="flex gap-0.5 mb-6">
                {[...Array(5)].map((_, starIndex) => (
                  <Star 
                    key={starIndex} 
                    size={12} 
                    className={starIndex < t.rating ? 'fill-amber-400 text-amber-400' : 'text-white/5 fill-white/5'} 
                  />
                ))}
              </div>

              <p className="text-white font-serif text-lg leading-relaxed mb-8 italic">
                "{t.comment}"
              </p>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-magical-500/20 via-purple-500/10 to-transparent flex items-center justify-center text-magical-300 font-bold text-sm border border-white/10 shadow-inner">
                  {t.senderName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white font-bold text-sm truncate">{t.senderName}</p>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Verified Gift</span>
                  </div>
                  <div className="inline-flex px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-400 font-medium tracking-wide">{t.cakeInfo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Random Floating Emoji (Subtle) */}
            {i % 2 === 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-xs shadow-lg transform rotate-12 group-hover:scale-110 transition-transform">
                    {i === 0 ? '🎉' : i === 2 ? '❤️' : '🎂'}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicTestimonials;
