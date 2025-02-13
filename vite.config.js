import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: mode === 'production'
          ? 'https://app.ablockofcrypto.com'
          : 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'process.env': { ...process.env },
  }
}));



