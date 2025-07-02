import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-phone-input-2/lib/style.css';


const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="394098351951-m1phm54qlot94uht1patlnfgr5qhj5dk.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

