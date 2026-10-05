import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const SRC = fileURLToPath(new URL('../../packages/design-editor/src', import.meta.url))

// An apps/* member: runs locally on `pnpm editor-hub` (kol-fxr's shell and pages on this repo's
// packages, 2026-10-03), and publishes into the showcase's output at ui.kolkrabbi.io/apps/editor-hub.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [react(), svgr(), tailwindcss()],

  base: command === 'build' ? '/apps/editor-hub/' : '/',

  build: {
    // Built after the showcase, whose emptyOutDir would otherwise wipe this folder.
    outDir: '../../showcase/dist/apps/editor-hub',
    emptyOutDir: true,
    // the editor is one ~4MB application; the warning says nothing new
    chunkSizeWarningLimit: 8000,
  },

  // ONE public/ at repo root (ARCHITECTURE §7) — dev only; the showcase build already emits it.
  publicDir: command === 'build' ? false : '../../public',

  resolve: {
    dedupe: ['react', 'react-dom'],
    // THE SOURCE, not dist/ — apps/editor's aliases. kol-fxr also imports the built stylesheet;
    // from source that is the lib sheet `core.jsx` already pulls in, so the import is a no-op.
    alias: [
      { find: /^@kolkrabbi\/design-editor$/, replacement: SRC + '/index.jsx' },
      { find: /^@kolkrabbi\/design-editor\/style\.css$/, replacement: SRC + '/index.lib.css' },
    ],
  },

  // its own port beside mixer-hub (5197). `/media` is kol-fxr's own dev proxy: the CDN sends no
  // CORS headers, so a cross-origin load taints every filtered and exported canvas. Deployed, the
  // root vercel.json carries the same rewrite.
  server: {
    port: 5198,
    proxy: {
      '/media': { target: 'https://r2.kolkrabbi.io', changeOrigin: true, rewrite: (p) => p.replace(/^\/media/, '') },
    },
  },

  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its map with import.meta.glob — prebundling ships an EMPTY icon map.
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
