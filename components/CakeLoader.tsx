import React from 'react';

const CakeLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4 animate-fade-in w-full max-w-[280px] sm:max-w-sm mx-auto">
            <style>{`
                @keyframes float-cake {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(2deg); }
                    75% { transform: translateY(-5px) rotate(-2deg); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .animate-float-cake {
                    animation: float-cake 4s ease-in-out infinite;
                }
                .sparkle-1 { animation: sparkle 2s infinite 0.1s; }
                .sparkle-2 { animation: sparkle 2.5s infinite 0.5s; }
                .sparkle-3 { animation: sparkle 1.8s infinite 1.2s; }
            `}</style>
            
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6">
                {/* Glow effect behind the cake */}
                <div className="absolute inset-0 bg-magical-500/30 blur-[40px] rounded-full animate-pulse-slow"></div>
                
                {/* Sparkles around the cake */}
                <div className="absolute -top-4 -left-2 w-4 h-4 text-yellow-300 sparkle-1">✨</div>
                <div className="absolute top-1/2 -right-6 w-3 h-3 text-magical-300 sparkle-2 text-xl">✨</div>
                <div className="absolute -bottom-2 left-1/4 w-2 h-2 text-pink-300 sparkle-3">✨</div>
                
                {/* The Cake SVG with floating animation */}
                <div className="w-full h-full animate-float-cake relative z-10">
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full drop-shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                    >
                        {/* Cake Base/Stand */}
                        <path
                            d="M20 85C20 82 25 80 50 80C75 80 80 82 80 85V88H20V85Z"
                            fill="#F1F5F9"
                        />
                        
                        {/* Bottom Layer */}
                        <rect
                            x="25"
                            y="60"
                            width="50"
                            height="20"
                            rx="4"
                            fill="#D946EF"
                        />
                        {/* Bottom Layer Icing/Drip */}
                        <path
                            d="M25 65C30 68 35 62 40 65C45 68 50 62 55 65C60 68 65 62 70 65C75 68 75 65 75 65V60H25V65Z"
                            fill="#FDF4FF"
                        />

                        {/* Top Layer */}
                        <rect
                            x="32"
                            y="45"
                            width="36"
                            height="15"
                            rx="3"
                            fill="#F0ABFC"
                        />
                        
                        {/* Candle */}
                        <rect
                            x="48"
                            y="30"
                            width="4"
                            height="15"
                            rx="1"
                            fill="#FAE8FF"
                        />
                        
                        {/* Flame with dynamic movement */}
                        <path
                            fill="#FFD700"
                            className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                        >
                            <animate
                                attributeName="d"
                                values="M50 15C50 15 46 22 46 25C46 28 48 30 50 30C52 30 54 28 54 25C54 22 50 15 50 15Z;
                                        M50 12C50 12 44 22 44 26C44 30 47 32 50 32C53 32 56 30 56 26C56 22 50 12 50 12Z;
                                        M52 14C52 14 48 22 48 25C48 28 50 30 52 30C54 30 56 28 56 25C56 22 52 14 52 14Z;
                                        M50 15C50 15 46 22 46 25C46 28 48 30 50 30C52 30 54 28 54 25C54 22 50 15 50 15Z"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>
                </div>

                {/* Orbiting particles - Responsive sizing */}
                <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-1/2 -left-2 w-3 h-3 bg-yellow-400 rounded-full blur-[1px] shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                </div>
                <div className="absolute inset-x-0 inset-y-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }}>
                    <div className="absolute bottom-1/2 -right-2 w-2 h-2 bg-magical-400 rounded-full blur-[1px] shadow-[0_0_8px_rgba(192,38,211,0.6)]"></div>
                </div>
            </div>

            <div className="text-center space-y-4">
                <div className="space-y-1">
                    <p className="font-serif italic text-2xl sm:text-3xl text-white drop-shadow-lg tracking-wide animate-pulse">
                        Baking the magic
                    </p>
                    <p className="text-[10px] text-magical-300 uppercase tracking-[0.4em] font-black opacity-60">
                        Preparing your surprise
                    </p>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-magical-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                    <div className="w-2 h-2 bg-magical-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(192,38,211,0.5)]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-magical-300 rounded-full animate-bounce shadow-[0_0_10px_rgba(240,171,252,0.5)]" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default CakeLoader;
