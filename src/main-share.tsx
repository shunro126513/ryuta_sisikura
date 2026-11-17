import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import './styles/tokens.css';
import './styles/theme.css';
import './styles/site.css';
import App from './App';

// 共有用(Artifact)ビルド: アドレスバーのパスを使えないため、ページ内ルーティング(MemoryRouter)で動かす
createRoot(document.getElementById('root')!).render(
  <StrictMode><MemoryRouter initialEntries={['/']}><App /></MemoryRouter></StrictMode>
);
