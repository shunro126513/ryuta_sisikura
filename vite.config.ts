import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
  // 画像(約240MB)はビルド時にコピーしない。prerender が dist/images をリンクする(ディスク節約)。デプロイ時は実体を含めること。
  build: { copyPublicDir: false, sourcemap: false },
  ssr: { noExternal: ['@radix-ui/themes'] },
  server: { port: 5173 },
  preview: { port: 4173 },
  appType: 'mpa',
});
