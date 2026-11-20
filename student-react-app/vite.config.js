import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // During development, requests to /api/... are forwarded to FastAPI.
    // The browser only ever talks to port 5173, so there are no CORS problems.
    //   /api/students  ->  http://127.0.0.1:8000/students
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
