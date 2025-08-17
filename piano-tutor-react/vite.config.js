import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build for production
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          audio: ['tone'],
          state: ['zustand'],
        },
      },
    },
  },
  server: {
    // Development server optimizations
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  test: {
    // Vitest configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
