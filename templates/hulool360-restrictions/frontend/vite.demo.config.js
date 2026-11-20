import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the self-contained browser demo (simulated server) into dist-demo/.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist-demo', emptyOutDir: true, rollupOptions: { input: 'browser-demo.html' } },
});
