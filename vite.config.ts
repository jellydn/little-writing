import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/little-writing/',
  root: './',
  publicDir: './public',
  build: {
    outDir: './dist',
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env': JSON.stringify(process.env),
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
