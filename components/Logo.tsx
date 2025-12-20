import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-7xl lg:text-8xl'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl md:text-8xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <span className={`${iconSizes[size]} animate-bounce-subtle filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]`}>🎁</span>
      <span className={`font-serif font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${sizeClasses[size]}`}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200">
            Wish
        </span>
        <span className="text-magical-300">prise</span>
      </span>
    </div>
  );
};