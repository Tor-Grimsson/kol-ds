import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  // Workspace hoisting can leave two physical React copies in the tree
  // (root vs app node_modules), which crashes at runtime with a null
  // dispatcher. Force a single react / react-dom copy.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: true,
  },
})
