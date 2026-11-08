import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// An apps/* member: Folio from kol-website record (src/folio), verbatim, on src/fixture (plan-2026-11-05-folio W1).
// Runs on `pnpm folio`; publishes into the showcase's output at ui.kolkrabbi.io/apps/folio.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'Fo' }), react(), tailwindcss()],
  base: command === 'build' ? '/apps/folio/' : '/',
  server: { port: 5217, host: true },
  build: { outDir: '../../showcase/dist/apps/folio', emptyOutDir: true },
  publicDir: command === 'build' ? false : '../../public',
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
    include: ['@kolkrabbi/kol-component > embla-carousel-react'],
    // kol-icons builds its map with import.meta.glob — prebundling it ships an EMPTY icon map
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
