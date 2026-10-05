import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const SRC = fileURLToPath(new URL('../../packages/design-editor/src', import.meta.url))

// An apps/* member: runs locally on `pnpm generator` (the generator alone, 2026-10-05), and publishes into the showcase's output at ui.kolkrabbi.io/apps/generator.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [react(), svgr(), tailwindcss()],

  base: command === 'build' ? '/apps/generator/' : '/',

  build: {
    // Built after the showcase, whose emptyOutDir would otherwise wipe this folder.
    outDir: '../../showcase/dist/apps/generator',
    emptyOutDir: true,
    // the editor is one ~4MB application; the warning says nothing new
    chunkSizeWarningLimit: 8000,
  },

  // ONE public/ at repo root (ARCHITECTURE §7) — dev only; the showcase build already emits it.
  publicDir: command === 'build' ? false : '../../public',

  resolve: {
    dedupe: ['react', 'react-dom'],
    // THE SOURCE, not dist/. design-editor is the one BUILT package (ARCHITECTURE §4) and its
    // `exports` point at dist — which would mean a build between every edit and the app. The
    // alias gives this app the same live link every other app has to its package.
    alias: [
      { find: /^@kolkrabbi\/design-editor$/, replacement: SRC + '/index.jsx' },
      { find: /^@kolkrabbi\/design-editor\/core$/, replacement: SRC + '/core.jsx' },
      { find: /^@kolkrabbi\/design-editor\/(generators|effects|motion)$/, replacement: SRC + '/packs/$1.js' },
    ],
  },

  // its own port after labs (5199)
  server: { port: 5200 },

  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its map with import.meta.glob — prebundling ships an EMPTY icon map.
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
