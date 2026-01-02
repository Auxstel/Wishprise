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
import { CookieConsent } from './components/CookieConsent';

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
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;

