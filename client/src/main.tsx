import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ← Tailwind CSSの読み込み
import ScriptRunnerForm from './components/ScriptRunnerForm';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
