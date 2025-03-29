// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      react(),
      AutoImport({
        imports: [
          {
            'jspdf': ['jsPDF'],
            'jspdf-autotable': ['autoTable'],
          },
        ],
      }),
      visualizer({
        filename: './dist/stats.html', // Output file location
        open: true, // Automatically open the file in your browser after build
        gzipSize: true, // Show gzip sizes in the chart
        brotliSize: true, // Show brotli sizes (optional, if you use brotli compression)
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: mode === 'production'
            ? env.API_BASE_URL || 'https://app.ablockofcrypto.com'
            : 'https://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/session': {
          target: mode === 'production'
            ? env.API_BASE_URL || 'https://app.ablockofcrypto.com'
            : 'https://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 500,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@lifi') || id.includes('metamask-sdk')) {
                return 'web3-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});



