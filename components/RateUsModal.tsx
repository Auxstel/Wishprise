import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import ButtonWithIcon from './ui/button-witn-icon';
import { submitFeedback } from '../services/feedbackService';
import { Feedback } from '../types';

interface RateUsModalProps {
  surpriseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RateUsModal: React.FC<RateUsModalProps> = ({ surpriseId, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDismiss = () => {
    localStorage.setItem('wishprise_rating_seen', 'true');
    onClose();
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      localStorage.setItem('wishprise_rating_seen', 'true');
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose();
        setSubmitted(false); // Reset state for future opening
        setRating(0);
        setComment('');
      }, 3000);
      
    } catch (e: any) {
      console.error(e);
      setError("The magic failed to send. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[2rem] overflow-hidden animate-fade-in-up transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-8 space-y-8 relative">
          {/* Subtle Glow Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-magical-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          {submitted ? (
            <div className="animate-fade-in text-center py-6 space-y-4">
              <div className="text-5xl animate-bounce">✨</div>
              <h3 className="text-2xl font-serif text-white italic">Your light has been received!</h3>
              <p className="text-slate-400 font-serif italic text-sm leading-relaxed px-4">"Thank you for noticing the love we put into every pixel. Your feedback keeps the magic alive."</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 text-center mt-2 relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-magical-500/10 border border-magical-500/20 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-magical-300">Handcrafted Experience</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight italic">How was your journey?</h3>
                <p className="text-slate-400 font-serif italic text-sm leading-relaxed px-2">
                    "We gave all of it through this website, can you say how much this experience was?"
                </p>
              </div>

              <div className="flex justify-center gap-2 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-all duration-300 transform hover:scale-125 focus:outline-none p-2"
                  >
                    <Star
                      size={40}
                      className={`transition-all duration-500 ${
                        (hoveredRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                          : 'text-white/10 fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-5 relative z-10">
                <div className="relative group">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-slate-950/60 p-5 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-magical-500/50 outline-none min-h-[100px] focus:bg-slate-950/80 font-serif text-lg leading-relaxed transition-all italic shadow-inner custom-scrollbar"
                        placeholder="Say something nice about the effort..."
                    />
                    {/* Subtle glow for focus */}
                    <div className="absolute inset-0 rounded-2xl bg-magical-500/5 blur-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>

                {error && <p className="text-red-400 text-xs font-serif italic text-center animate-pulse">{error}</p>}

                <div className="flex justify-center pt-2">
                    <ButtonWithIcon 
                        text={isSubmitting ? "Sending..." : "Share Your Thoughts ✨"}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full text-white shadow-magical-600/30 py-4 text-lg"
                    />
                </div>
                
                <div className="text-center pt-2">
                    <button 
                      onClick={handleDismiss}
                      className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors font-black"
                    >
                      Skip for now
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateUsModal;
