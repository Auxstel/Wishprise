import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  width: number;
  height: number;
  onReveal?: () => void;
  children: React.ReactNode;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ width, height, onReveal, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with Gold Foil effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#BF953F');
    gradient.addColorStop(0.25, '#FCF6BA');
    gradient.addColorStop(0.5, '#B38728');
    gradient.addColorStop(0.75, '#FBF5B7');
    gradient.addColorStop(1, '#AA771C');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add Text overlay
    ctx.font = 'bold 20px Inter';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("✨ Scratch to Reveal ✨", width / 2, height / 2);

    // Sparkles
    for(let i=0; i<20; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.arc(x, y, Math.random() * 2, 0, Math.PI*2);
        ctx.fill();
    }

  }, [width, height]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = (e as React.MouseEvent).clientX - rect.left;
        y = (e as React.MouseEvent).clientY - rect.top;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        checkReveal(ctx);
    }
  };

  const checkReveal = (ctx: CanvasRenderingContext2D) => {
      // Performance optimization: don't check every frame
      if (Math.random() > 0.1) return;

      const imageData = ctx.getImageData(0, 0, width, height);
      let transparent = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) transparent++;
      }
      
      const percentage = (transparent / (width * height)) * 100;
      if (percentage > 40) {
          setIsRevealed(true);
          if (onReveal) onReveal();
      }
  };

  return (
    <div 
        ref={containerRef} 
        className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02]"
        style={{ width, height }}
    >
      {/* Content Behind */}
      <div className="absolute inset-0 bg-white text-gray-800 p-6 flex flex-col items-center justify-center text-center border-4 border-magical-200 rounded-xl">
        {children}
      </div>

      {/* Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute inset-0 touch-none cursor-crosshair transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={() => isDrawing.current = true}
        onMouseUp={() => isDrawing.current = false}
        onMouseLeave={() => isDrawing.current = false}
        onMouseMove={handleMouseMove}
        onTouchStart={() => isDrawing.current = true}
        onTouchEnd={() => isDrawing.current = false}
        onTouchMove={handleMouseMove}
      />
    </div>
  );
};
