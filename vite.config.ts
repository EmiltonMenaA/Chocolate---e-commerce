import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Usar URL desde .env o variable de entorno, por defecto localhost:8000
const apiTarget = process.env.VITE_API_URL || 'http://localhost:8000'

console.log('🔗 API Target:', apiTarget)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/media': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
