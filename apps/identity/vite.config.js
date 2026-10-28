import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// An apps/* member: runs locally on `pnpm identity` (the identity reference, plan-2026-10-28-identity W2), and
// publishes into the showcase's output so the current state is viewable at ui.kolkrabbi.io/apps/identity.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'I' }), react(), tailwindcss()],
  base: command === 'build' ? '/apps/identity/' : '/',
  build: { outDir: '../../showcase/dist/apps/identity', emptyOutDir: true },
  // ONE public/ at repo root (ARCHITECTURE §7); not re-emitted in a build
  publicDir: command === 'build' ? false : '../../public',
  resolve: { dedupe: ['react', 'react-dom'] },
  // its own port beside document (5208)
  server: { port: 5209, host: true },
  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its maps with import.meta.glob — prebundling it ships EMPTY maps
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
