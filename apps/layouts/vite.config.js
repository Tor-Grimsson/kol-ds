import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// An apps/* member: runs locally on `pnpm layouts` (LayoutsAndWebsiteLayout 2026-10-28), and publishes into the showcase's
// output at ui.kolkrabbi.io/apps/layouts. Its pages are the showcase's previews, mounted inside each frame.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'L' }), react(), tailwindcss()],
  base: command === 'build' ? '/apps/layouts/' : '/',
  build: { outDir: '../../showcase/dist/apps/layouts', emptyOutDir: true },
  // ONE public/ at repo root (ARCHITECTURE §7); not re-emitted in a build
  publicDir: command === 'build' ? false : '../../public',
  // opentype.js is kol-foundry's optional peer: resolve it from this app, which installs it
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom', 'opentype.js'] },
  // its own port beside resume (5211)
  server: { port: 5212, host: true },
  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its maps with import.meta.glob — prebundling it ships EMPTY maps
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
