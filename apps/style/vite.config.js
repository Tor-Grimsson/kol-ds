import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// kolbox's parts import the editor engine by its source alias (apps/editor/vite.config.js); the board renders those
// parts from their source (the engine's kolbox folder, apps/editor's host parts), so the same aliases live here, and svgr for the engine's one `?react` logo.
const DE_SRC = fileURLToPath(new URL('../../packages/design-editor/src', import.meta.url))

// An apps/* member: runs locally on `pnpm style` (style A beside style B, FloatingStyleAndSignInDemos 2026-10-30), and publishes into the
// showcase's output so the current state is viewable at ui.kolkrabbi.io/apps/style.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'S' }), react(), svgr(), tailwindcss()],

  // The slug only exists in the built output. In dev the app is served at `/`
  // on its own port, so `pnpm style` stays an ordinary localhost root.
  base: command === 'build' ? '/apps/style/' : '/',

  build: {
    // Vercel's outputDirectory is showcase/dist, so the app lands inside it
    // under its slug. Root build order runs the showcase FIRST — its own
    // emptyOutDir would wipe this folder if the order were reversed.
    outDir: '../../showcase/dist/apps/style',
    emptyOutDir: true,
  },

  // ONE public/ at repo root (ARCHITECTURE §7). In dev this app is alone on its
  // port and needs /fonts/ served, so it points at the root copy. In a build it
  // must NOT re-emit it — the showcase's build already put those assets at the
  // domain root, and copying 17MB of fonts into a subfolder duplicates them.
  publicDir: command === 'build' ? false : '../../public',

  // Workspace hoisting can leave two physical React copies in the tree, which
  // crashes at runtime with a null dispatcher. Force one.
  // The styles board renders Folio's, minimal's and kolbox's own parts from their apps' SOURCE (the way apps/labs aliases
  // into another folder); their bare imports resolve from those apps' own node_modules.
  resolve: {
    // kol-shell's own kol-component link points at a published copy in the store; deduped, every import takes the
    // workspace one (one copy, and the optimizer never tries to bundle the published PdfPage's `?url` worker).
    dedupe: ['react', 'react-dom', 'react-router-dom', '@kolkrabbi/kol-component'],
    alias: [
      { find: /^@folio\/(.*)$/, replacement: fileURLToPath(new URL('../folio/src', import.meta.url)) + '/$1' },
      { find: /^@minimal\/(.*)$/, replacement: fileURLToPath(new URL('../minimal/src', import.meta.url)) + '/$1' },
      { find: /^@kolbox\/(.*)$/, replacement: DE_SRC + '/editor/kolbox/$1' },
      { find: /^@kolbox-host\/(.*)$/, replacement: fileURLToPath(new URL('../editor/src/kolbox', import.meta.url)) + '/$1' },
      { find: /^@design-editor-src\/(.*)$/, replacement: DE_SRC + '/$1' },
      { find: /^@kolkrabbi\/design-editor$/, replacement: DE_SRC + '/index.jsx' },
      { find: /^@kolkrabbi\/design-editor\/core$/, replacement: DE_SRC + '/core.jsx' },
      { find: /^@kolkrabbi\/design-editor\/(generators|effects|motion)$/, replacement: DE_SRC + '/packs/$1.js' },
    ],
  },

  // its own port, so it runs beside the other apps
  server: { host: true, port: 5213 },

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
