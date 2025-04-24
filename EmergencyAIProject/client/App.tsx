import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadKnowledge from './src/pages/UploadKnowledge';
import RequestResponseView from './src/components/RequestResponseView';
import History from './pages/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadKnowledge />} />
      <Route path="/analysis" element={<RequestResponseView />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;