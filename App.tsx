import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Landing } from './screens/Landing';
import { Create } from './screens/Create';
import { Share } from './screens/Share';
import { Receiver } from './screens/Receiver';
import { PrivacyPolicy } from './screens/PrivacyPolicy';
import { TermsOfService } from './screens/TermsOfService';
import { Contact } from './screens/Contact';
import { About } from './screens/About';
import { ResourceIndex } from './screens/Resources/ResourceIndex';
import { VirtualBirthdayIdeas } from './screens/Resources/VirtualBirthdayIdeas';
import { LongDistanceGuide } from './screens/Resources/LongDistanceGuide';
import { DigitalVsPhysical } from './screens/Resources/DigitalVsPhysical';
import { MessageEtiquette } from './screens/Resources/MessageEtiquette';
import { WhatsappSurpriseIdeas } from './screens/Resources/WhatsappSurpriseIdeas';
import { CookieConsent } from './components/CookieConsent';
import { WhatsappSurprise } from './screens/LandingPages/WhatsappSurprise';
import { LongDistanceBirthday } from './screens/LandingPages/LongDistanceBirthday';
import { NameLanding } from './screens/NameLanding';
import { RelationshipLanding } from './screens/RelationshipLanding';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CookieConsent />
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
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;

