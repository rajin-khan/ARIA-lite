// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Vite's React plugin
import tailwindcss from '@tailwindcss/vite' // Tailwind CSS v4 Vite plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS plugin
  ],
})