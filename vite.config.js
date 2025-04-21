import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9001,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'Components': path.resolve(__dirname, './src/client/components/'),
      'Utils': path.resolve(__dirname, './src/client/utils/utils'),
      'Hooks': path.resolve(__dirname, './src/client/hooks/hooks'),
    },
  },
}); 