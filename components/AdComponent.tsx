import React, { useEffect, useState } from 'react';
import { AdProps } from '../types';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdComponent: React.FC<AdProps> = ({ type, className = '', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only try to load ads if visible and we are in a browser
    if (visible && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [visible]);

  if (!visible) return null;

  // Interstitial Ad (Simulated for AdSense as auto-ads handle real interstitials usually)
  // For standard units, we return the <ins> tag
  if (type === 'banner' || type === 'interstitial') {
    return (
      <div className={`text-center overflow-hidden ${className}`}>
        {/* ADSENSE UNIT */}
        {/* Replace 'data-ad-slot' with your actual Ad Unit ID from AdSense Dashboard */}
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-6149729401246246"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>

        {/* Development Placeholder: Only visible when ad loads */}
      </div>
    );
  }

  return null;
};