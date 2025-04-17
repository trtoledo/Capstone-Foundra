import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';
import { HashRouter } from 'react-router-dom';
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Components/Context/AuthContext';

const root = createRoot(document.querySelector('#root'));

root.render(
  <HashRouter>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </HashRouter>
);