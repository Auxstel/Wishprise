import React, { useEffect } from 'react';
import { AdProps } from '../types';

const ADSENSE_CLIENT = 'ca-pub-4046935924897443';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdComponent: React.FC<AdProps> = ({ type, className = '' }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  if (type === 'banner' || type === 'interstitial') {
    return (
      <div className={`text-center overflow-hidden ${className}`}> 
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="3960990642"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>
    );
  }

  return null;
};

export default AdComponent;