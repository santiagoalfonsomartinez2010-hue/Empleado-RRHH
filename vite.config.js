import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración estándar de Vite + React (mismo stack que el empleado de atención al cliente)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
