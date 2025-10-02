import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for mobile performance
    target: 'es2015',
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
    // Reduce chunk size for better mobile loading
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Optimize dev server for mobile testing
    host: true,
    port: 5173,
  },
  // Enable compression
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
