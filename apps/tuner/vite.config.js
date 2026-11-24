import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// An apps/* member: runs locally on `pnpm tuner` (kol-tuner's lab, W27.3 2026-11-18). Its build lands in the showcase's
// output at /apps/tuner, like its siblings; it is not in the root build chain yet.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'T' }), react(), tailwindcss()],
  base: command === 'build' ? '/apps/tuner/' : '/',
  build: { outDir: '../../showcase/dist/apps/tuner', emptyOutDir: true },
  // ONE public/ at repo root (ARCHITECTURE §7); not re-emitted in a build
  publicDir: command === 'build' ? false : '../../public',
  resolve: { dedupe: ['react', 'react-dom'] },
  // its own port after kolbox (5219)
  server: { port: 5220, host: true },
  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its maps with import.meta.glob — prebundling it ships EMPTY maps
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
