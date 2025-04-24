
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadKnowledge from './pages/UploadKnowledge';
import History from './pages/History';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg p-4">
          <div className="container mx-auto flex gap-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Upload</Link>
            <Link to="/history" className="text-blue-600 hover:text-blue-800">History</Link>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<UploadKnowledge />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
