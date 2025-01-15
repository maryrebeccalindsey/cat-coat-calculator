import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'calculator',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'calculator/index.html',
    },
  },
  plugins: [react()],
});
