import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurprise } from '../services/storageService';
import { Button } from '../components/Button';
import { AdComponent } from '../components/AdComponent';
import { Logo } from '../components/Logo';
import { SurpriseData } from '../types';

export const Share: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surprise, setSurprise] = useState<SurpriseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await getSurprise(id);
          setSurprise(data);
        } catch (e) {
          console.error("Failed to load surprise", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-magical-50 flex items-center justify-center">Loading magic...</div>;
  if (!surprise) return <div className="min-h-screen bg-magical-50 flex items-center justify-center">Surprise not found.</div>;

  const shareUrl = `${window.location.origin}/#/view/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsapp = () => {
    const text = `Hey ${surprise.receiverName}! I made a special birthday surprise for you. Open this on your phone: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-magical-50 flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
      
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="md" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-magical-100 relative z-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h2 className="text-2xl font-serif text-gray-800 mb-2">It's Ready!</h2>
        <p className="text-gray-600 mb-6">Your surprise for <strong>{surprise.receiverName}</strong> is created.</p>
        
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 break-all text-xs text-gray-500 font-mono mb-4 select-all">
          {shareUrl}
        </div>

        <div className="space-y-3">
          <Button onClick={handleCopy} fullWidth variant={copied ? "secondary" : "primary"}>
            {copied ? "Link Copied!" : "Copy Link"}
          </Button>
          <Button onClick={handleWhatsapp} fullWidth className="bg-green-500 hover:bg-green-600 text-white border-none">
            Share on WhatsApp
          </Button>
          <button 
            onClick={() => navigate(`/view/${id}`)}
            className="text-sm text-magical-600 underline mt-4"
          >
            Preview it yourself
          </button>
        </div>
      </div>
      <AdComponent type="banner" />
    </div>
  );
};