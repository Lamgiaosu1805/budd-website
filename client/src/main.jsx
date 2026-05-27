import React from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CMSProvider } from './contexts/CMSContext.jsx';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <CMSProvider>
          <App />
        </CMSProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
