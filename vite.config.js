import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: mode === 'production'
            ? env.API_BASE_URL || 'https://app.ablockofcrypto.com'
            : 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
        '/session': {
          target: mode === 'production'
            ? env.API_BASE_URL || 'https://app.ablockofcrypto.com'
            : 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@lifi') || id.includes('metamask-sdk')) {
                return 'web3-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    }
  };
});



