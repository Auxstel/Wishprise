import React, { useState, useEffect } from 'react';

const messages = [
  "Loved the magic? Share Wishprise with friends and family! ✨",
  "Handcrafted design for heart-centered surprises. 💖",
  "Small gestures, big impacts. Spread the joy today! 🌈",
  "Because every birthday deserves a little 3D wonder. 🎂"
];

const ShareCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/10 overflow-hidden relative z-50">
      <div className="max-w-xl mx-auto relative min-h-[2.5rem] md:min-h-[1.5rem] flex items-center justify-center">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform px-4 md:px-8 ${
              i === index 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-95'
            }`}
          >
            <p className="text-[9px] md:text-[10px] font-sans font-black text-magical-300 tracking-[0.1em] md:tracking-[0.25em] uppercase text-center leading-relaxed drop-shadow-[0_0_8px_rgba(139,38,242,0.4)]">
              {msg}
            </p>
          </div>
        ))}
      </div>
      {/* Subtle magical glow line */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-magical-500/40 to-transparent"></div>
    </div>
  );
};

export default ShareCarousel;
