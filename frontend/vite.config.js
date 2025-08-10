import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // ensures assets load correctly on Vercel
  plugins: [
    tailwindcss(),
  ],
})
