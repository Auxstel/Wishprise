import React, { useEffect } from 'react';
import { AdProps } from '../types';

const ADSENSE_CLIENT = 'ca-pub-4440385158046615';
const ADSENSE_SCRIPT_ID = 'wishprise-adsense-script';
const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

declare global {
  interface Window {
    adsbygoogle: any[];
    __wishpriseAdSensePromise?: Promise<void>;
  }
}

const ensureAdSenseScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.__wishpriseAdSensePromise) {
    return window.__wishpriseAdSensePromise;
  }

  window.__wishpriseAdSensePromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load AdSense script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = ADSENSE_SRC;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load AdSense script.')), { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    window.__wishpriseAdSensePromise = undefined;
    throw error;
  });

  return window.__wishpriseAdSensePromise;
};

export const AdComponent: React.FC<AdProps> = ({ type, className = '' }) => {

  useEffect(() => {
    let cancelled = false;

    ensureAdSenseScript()
      .then(() => {
        if (cancelled || typeof window === 'undefined') return;
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense error:', error);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('AdSense script load error:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Interstitial Ad (Simulated for AdSense as auto-ads handle real interstitials usually)
  // For standard units, we return the <ins> tag
  if (type === 'banner' || type === 'interstitial') {
    return (
      <div className={`text-center overflow-hidden ${className}`}> 
        {/* ADSENSE UNIT */}
        {/* Replace 'data-ad-slot' with your actual Ad Unit ID from AdSense Dashboard */}
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="5639398850"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>

        {/* Development Placeholder: Only visible when ad loads */}
      </div>
    );
  }

  return null;
};
