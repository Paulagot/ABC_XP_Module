import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: mode === 'production'
          ? 'https://app.ablockofcrypto.com'
          : 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
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
}));



