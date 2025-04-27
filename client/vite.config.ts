import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5001,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/ai': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    },
    hmr: {
      overlay: true,
      clientPort: 5001
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  publicDir: '../data',
})
