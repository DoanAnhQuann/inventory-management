import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    env: {
      TZ: 'Asia/Ho_Chi_Minh',
    },
  },
  server: {
    port: 3000,
    open: true,
    // Proxy gọi API sang backend, tránh lỗi CORS khi dev.
    // Bật lại khi backend đã chạy:
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
