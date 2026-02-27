import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is a build tool that's faster than traditional webpack
// It serves files natively during development (no bundling wait)
export default defineConfig({
  plugins: [react()],
  base: '/',  // Absolute paths — required for BrowserRouter deep links
})
