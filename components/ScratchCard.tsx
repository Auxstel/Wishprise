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
    if (!canvas || !containerRef.current) return;

    const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with Gold Foil effect
    const gradient = ctx.createLinearGradient(0, 0, containerWidth, containerHeight);
    gradient.addColorStop(0, '#BF953F');
    gradient.addColorStop(0.25, '#FCF6BA');
    gradient.addColorStop(0.5, '#B38728');
    gradient.addColorStop(0.75, '#FBF5B7');
    gradient.addColorStop(1, '#AA771C');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    // Add Text overlay
    ctx.font = 'bold 24px Inter';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("✨ Scratch Me ✨", containerWidth / 2, containerHeight / 2);

    // Sparkles
    for(let i=0; i<30; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        const x = Math.random() * containerWidth;
        const y = Math.random() * containerHeight;
        ctx.arc(x, y, Math.random() * 2.5, 0, Math.PI*2);
        ctx.fill();
    }
  }, [width, height]); // Re-run if props change, though we're using container size now

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let x, y;

    if ('touches' in e) {
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        x = ((e as React.MouseEvent).clientX - rect.left) * scaleX;
        y = ((e as React.MouseEvent).clientY - rect.top) * scaleY;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        checkReveal(ctx, canvas.width, canvas.height);
    }
  };

  const checkReveal = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (Math.random() > 0.05) return;

      const imageData = ctx.getImageData(0, 0, w, h);
      let transparent = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) transparent++;
      }
      
      const percentage = (transparent / (w * h)) * 100;
      if (percentage > 45) {
          setIsRevealed(true);
          if (onReveal) onReveal();
      }
  };

  return (
    <div 
        ref={containerRef} 
        className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02] border-4 border-magical-400/30"
        style={{ width: '100%', maxWidth: width, height }}
    >
      {/* Content Behind */}
      <div className="absolute inset-0 bg-slate-50 text-slate-900 p-6 flex flex-col items-center justify-center text-center border-4 border-magical-200/50 rounded-2xl overflow-hidden">
        {children}
      </div>

      {/* Canvas Overlay */}
      <canvas
        ref={canvasRef}
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
