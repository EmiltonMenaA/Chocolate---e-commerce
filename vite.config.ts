import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.VITE_API_URL || 'http://localhost:8000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
        '/media': {
          target: apiTarget,
          changeOrigin: true,
        },
    },
  }
})
