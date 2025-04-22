import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import { AuthProvider } from './Components/Context/AuthContext';

const root = createRoot(document.querySelector('#root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div suppressCustomElementsWarning={true}>
          <App />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);