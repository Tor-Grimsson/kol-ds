import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// An apps/* member: runs locally on `pnpm presentation` (the presentation tool alone on the fixture, 2026-09-27), and publishes into the
// showcase's output so the current state is viewable at ui.kolkrabbi.io/apps/presentation.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],

  // The slug only exists in the built output. In dev the app is served at `/`
  // on its own port, so `pnpm presentation` stays an ordinary localhost root.
  base: command === 'build' ? '/apps/presentation/' : '/',

  build: {
    // Vercel's outputDirectory is showcase/dist, so the app lands inside it
    // under its slug. Root build order runs the showcase FIRST — its own
    // emptyOutDir would wipe this folder if the order were reversed.
    outDir: '../../showcase/dist/apps/presentation',
    emptyOutDir: true,
  },

  // ONE public/ at repo root (ARCHITECTURE §7). In dev this app is alone on its
  // port and needs /fonts/ served, so it points at the root copy. In a build it
  // must NOT re-emit it — the showcase's build already put those assets at the
  // domain root, and copying 17MB of fonts into a subfolder duplicates them.
  publicDir: command === 'build' ? false : '../../public',

  // Workspace hoisting can leave two physical React copies in the tree, which
  // crashes at runtime with a null dispatcher. Force one.
  resolve: { dedupe: ['react', 'react-dom'] },

  // its own port beside media-shell (5175) and shell (5176), so they run at once
  server: { port: 5178 },

  optimizeDeps: {
    // The DS packages ship raw JSX, so vite's scanner doesn't crawl them for
    // bare imports — their CJS deps then reach the browser un-interop'd in dev.
    // The `>` form reaches them through kol-component; pnpm doesn't hoist, so
    // the bare names don't resolve from here and would be silently skipped.
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its map with import.meta.glob — a Vite source macro the
    // dep optimizer doesn't run, so prebundling it ships an EMPTY icon map.
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
