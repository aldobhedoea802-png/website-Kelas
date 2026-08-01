import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/website-Kelas/', // ← ini penting agar path asset benar di GitHub Pages
  build: {
    outDir: 'dist', // default Vite, biarkan
  },
});