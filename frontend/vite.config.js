import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  //base: './',  👈 Importante para rutas relativas
  build: {
    outDir: 'dist'
  }
})
