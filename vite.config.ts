import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-three': ['three'],
          'vendor-firebase': ['firebase/app', 'firebase/analytics'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  }
});