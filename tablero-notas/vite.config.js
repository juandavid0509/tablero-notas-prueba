import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api/metrics': {
        target: 'http://lambda_metrics:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/metrics/, '/metrics')
      },
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true,
      },
    },
  },
}); 