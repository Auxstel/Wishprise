import React, { useState } from 'react';
import { AdProps } from '../types';

export const AdComponent: React.FC<AdProps> = ({ type, className = '', onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  if (type === 'banner') {
    return (
      <div className={`w-full h-16 backdrop-blur-md bg-white/10 flex items-center justify-center border-t border-white/10 text-xs text-gray-400 select-none ${className}`}>
        [Ad Banner Placeholder]
      </div>
    );
  }

  if (type === 'interstitial') {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl max-w-sm w-full text-center space-y-4 shadow-2xl">
          <p className="text-gray-500 text-sm tracking-widest uppercase">Sponsored</p>
          <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
             Video Ad Playing...
          </div>
          <button 
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-magical-400 font-bold hover:text-magical-300 hover:underline mt-4 block mx-auto transition-colors"
          >
            Skip to Surprise &rarr;
          </button>
        </div>
      </div>
    );
  }

  return null;
};