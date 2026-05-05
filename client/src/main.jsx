import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1C1811',
            color: '#FAF3E0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            padding: '12px 16px',
            borderRadius: '999px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
