import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'calculator',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'calculator/index.html',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'calculator/components'),
    },
  },
  plugins: [react()],
});
