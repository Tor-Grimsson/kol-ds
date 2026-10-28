import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// An apps/* member: runs locally on `pnpm print` (the print tool, PdfToolsFromStudio 2026-10-28), and
// publishes into the showcase's output so the current state is viewable at ui.kolkrabbi.io/apps/print.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'P' }), react(), tailwindcss()],
  base: command === 'build' ? '/apps/print/' : '/',
  build: { outDir: '../../showcase/dist/apps/print', emptyOutDir: true },
  // ONE public/ at repo root (ARCHITECTURE §7); not re-emitted in a build
  publicDir: command === 'build' ? false : '../../public',
  resolve: { dedupe: ['react', 'react-dom'] },
  // its own port beside identity (5209)
  server: { port: 5210, host: true },
  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its maps with import.meta.glob — prebundling it ships EMPTY maps
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
