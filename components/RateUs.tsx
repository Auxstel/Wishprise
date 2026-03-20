import React, { useState } from 'react';
import { Star } from 'lucide-react';
import ButtonWithIcon from './ui/button-witn-icon';
import { submitFeedback } from '../services/feedbackService';
import { Feedback } from '../types';

interface RateUsProps {
  surpriseId: string;
}

const RateUs: React.FC<RateUsProps> = ({ surpriseId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating to share the magic!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedback: Feedback = {
        surpriseId,
        rating,
        comment,
        createdAt: Date.now()
      };

      await submitFeedback(feedback);
      setSubmitted(true);
    } catch (e: any) {
      console.error(e);
      setError("The magic failed to send. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-in text-center p-8 space-y-4">
        <div className="text-4xl animate-bounce">✨</div>
        <h3 className="text-2xl font-serif text-white italic">Your light has been received!</h3>
        <p className="text-slate-400 font-serif italic text-sm">"Thank you for noticing the love we put into every pixel. Your feedback keeps the magic alive."</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-sm mx-auto">
      <div className="space-y-3 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-magical-500/10 border border-magical-500/20 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-magical-300">Handcrafted Experience</span>
        </div>
        <h3 className="text-xl md:text-2xl font-serif text-white tracking-tight italic">How was your journey?</h3>
        <p className="text-slate-400 font-serif italic text-sm leading-relaxed px-4">
            "We poured our hearts into every detail, transition, and glow to make this moment special. If you felt the magic, please let us know."
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="transition-all duration-300 transform hover:scale-125 focus:outline-none"
          >
            <Star
              size={36}
              className={`transition-all duration-500 ${
                (hoveredRating || rating) >= star
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'text-white/10 fill-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative group">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-900/40 p-5 rounded-3xl border border-white/5 text-white placeholder-white/5 focus:border-magical-500/30 outline-none min-h-[100px] focus:bg-slate-950/60 font-serif text-lg leading-relaxed transition-all italic shadow-inner"
                placeholder="Any thoughts on how we can add more magic? (optional)"
            />
            {/* Subtle glow for focus */}
            <div className="absolute inset-0 rounded-3xl bg-magical-500/5 blur-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        </div>

        {error && <p className="text-red-400 text-xs font-serif italic text-center animate-pulse">{error}</p>}

        <div className="flex justify-center pt-2">
            <ButtonWithIcon 
                text={isSubmitting ? "Sending..." : "Share Your Feedback"}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full text-white shadow-magical-600/20"
            />
        </div>
      </div>
    </div>
  );
};

export default RateUs;
