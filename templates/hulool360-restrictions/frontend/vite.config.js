import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo app only. During `npm run dev`, /api is proxied to the sample ASP.NET host on port 5080.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://127.0.0.1:5080' } },
  build: { outDir: '../backend/samples/SampleHost/wwwroot', emptyOutDir: true },
});
