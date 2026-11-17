import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import './styles/tokens.css';
import './styles/theme.css';
import './styles/site.css';
import App from './App';

const el = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}><App /></BrowserRouter>
  </StrictMode>
);
if (el.hasChildNodes()) hydrateRoot(el, app); else createRoot(el).render(app);
