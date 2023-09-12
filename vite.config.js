import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from "node:process"

const PORT = process.env.PORT || 8080

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api" : `http://localhost:${PORT}`
    }
  }
})
