import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Create } from './screens/Create';
import { Share } from './screens/Share';
import { Receiver } from './screens/Receiver';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        <Route path="/share/:id" element={<Share />} />
        <Route path="/view/:id" element={<Receiver />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
