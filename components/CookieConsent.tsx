import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('wishprise_cookie_consent');
        if (!consent) {
            // Small delay for smooth entrance
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('wishprise_cookie_consent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up">
            <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span>🍪</span> We value your privacy
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We use cookies to enhance your experience, serve personalized ads, and analyze our traffic.
                        By clicking "Accept", you consent to our use of cookies.
                        Read our <Link to="/privacy" className="text-magical-400 hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-magical-100 transition-colors shadow-lg"
                    >
                        Accept
                    </button>
                    {/* Optional: Decline button if you want to be stricter, but usually Accept/Close is enough for simple setups */}
                    <button
                        onClick={() => setVisible(false)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
