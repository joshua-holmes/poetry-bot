import { defineConfig } from "vitest/config"; // Use vitest/config instead of vite
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts", // Ensures jest-dom is loaded
  },
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000"
      },
      '/ping': {
        target: "http://localhost:3000"
      }
    }
  }
})
