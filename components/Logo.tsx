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

  const heightClasses = {
    sm: 'h-8',
    md: 'h-10 md:h-12',
    lg: 'h-14 md:h-20',
    xl: 'h-12 md:h-16' // Small layout height
  };

  const scaleClasses = {
    sm: '',
    md: '',
    lg: '',
    xl: 'scale-[2.5] md:scale-[3.5] lg:scale-[4] origin-center my-8 md:my-16' // Large visual scale
  };

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Wishprise Logo"
        className={`${heightClasses[size]} ${scaleClasses[size]} object-contain animate-fade-in relative z-10`}
      />
    </div>
  );
};