import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Landing } from './screens/Landing';
import { CookieConsent } from './components/CookieConsent';

// Lazy-load all non-landing routes for code splitting
const Create = lazy(() => import('./screens/Create').then(m => ({ default: m.Create })));
const Share = lazy(() => import('./screens/Share').then(m => ({ default: m.Share })));
const Receiver = lazy(() => import('./screens/Receiver').then(m => ({ default: m.Receiver })));
const PrivacyPolicy = lazy(() => import('./screens/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./screens/TermsOfService').then(m => ({ default: m.TermsOfService })));
const Contact = lazy(() => import('./screens/Contact').then(m => ({ default: m.Contact })));
const About = lazy(() => import('./screens/About').then(m => ({ default: m.About })));
const AiWishes = lazy(() => import('./screens/AiWishes').then(m => ({ default: m.AiWishes })));
const PosterGenerator = lazy(() => import('./screens/PosterGenerator').then(m => ({ default: m.PosterGenerator })));
const GiftSuggestions = lazy(() => import('./screens/GiftSuggestions').then(m => ({ default: m.GiftSuggestions })));
const SpaceBirthday = lazy(() => import('./screens/SpaceBirthday').then(m => ({ default: m.SpaceBirthday })));
const ResourceIndex = lazy(() => import('./screens/Resources/ResourceIndex').then(m => ({ default: m.ResourceIndex })));
const VirtualBirthdayIdeas = lazy(() => import('./screens/Resources/VirtualBirthdayIdeas').then(m => ({ default: m.VirtualBirthdayIdeas })));
const LongDistanceGuide = lazy(() => import('./screens/Resources/LongDistanceGuide').then(m => ({ default: m.LongDistanceGuide })));
const DigitalVsPhysical = lazy(() => import('./screens/Resources/DigitalVsPhysical').then(m => ({ default: m.DigitalVsPhysical })));
const MessageEtiquette = lazy(() => import('./screens/Resources/MessageEtiquette').then(m => ({ default: m.MessageEtiquette })));
const WhatsappSurpriseIdeas = lazy(() => import('./screens/Resources/WhatsappSurpriseIdeas').then(m => ({ default: m.WhatsappSurpriseIdeas })));
const WhatsappSurprise = lazy(() => import('./screens/LandingPages/WhatsappSurprise').then(m => ({ default: m.WhatsappSurprise })));
const LongDistanceBirthday = lazy(() => import('./screens/LandingPages/LongDistanceBirthday').then(m => ({ default: m.LongDistanceBirthday })));
const NameLanding = lazy(() => import('./screens/NameLanding').then(m => ({ default: m.NameLanding })));
const RelationshipLanding = lazy(() => import('./screens/RelationshipLanding').then(m => ({ default: m.RelationshipLanding })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
    <div className="w-12 h-12 border-4 border-magical-500/20 border-t-magical-500 rounded-full animate-spin"></div>
    <p className="font-serif italic text-magical-300">Loading the magic...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CookieConsent />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<Create />} />
            <Route path="/share/:id" element={<Share />} />
            <Route path="/view/:id" element={<Receiver />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* Targeted Landing Pages */}
            <Route path="/whatsapp-birthday-surprise" element={<WhatsappSurprise />} />
            <Route path="/long-distance-birthdays" element={<LongDistanceBirthday />} />
            <Route path="/birthday-wishes-for/my/:relationship" element={<RelationshipLanding />} />
            <Route path="/birthday-wishes-for/:name" element={<NameLanding />} />

            {/* New Tools */}
            <Route path="/ai-wishes" element={<AiWishes />} />
            <Route path="/poster" element={<PosterGenerator />} />
            <Route path="/gifts" element={<GiftSuggestions />} />
            <Route path="/space-birthday" element={<SpaceBirthday />} />

            {/* Resources / Blog */}
            <Route path="/resources" element={<ResourceIndex />} />
            <Route path="/resources/virtual-birthday-ideas-2026" element={<VirtualBirthdayIdeas />} />
            <Route path="/resources/long-distance-birthday-guide" element={<LongDistanceGuide />} />
            <Route path="/resources/digital-vs-physical-cards" element={<DigitalVsPhysical />} />
            <Route path="/resources/birthday-message-etiquette" element={<MessageEtiquette />} />
            <Route path="/resources/whatsapp-birthday-surprise-ideas" element={<WhatsappSurpriseIdeas />} />
            
            {/* Catch-all for debugging */}
            <Route path="*" element={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">404 - Page Not Found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
