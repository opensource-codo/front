import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const clientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID || // CRA
  import.meta?.env?.VITE_GOOGLE_CLIENT_ID;  // Vite

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
