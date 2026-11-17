import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()], base: './', mode: 'share',
  build: { outDir: 'dist-share', copyPublicDir: false, rollupOptions: { input: 'share.html' } },
});
