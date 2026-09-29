import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

const SRC = fileURLToPath(new URL('../../packages/design-editor/src', import.meta.url))

// An apps/* member: runs locally on `pnpm panels` (parameter panels alone, apps review §6c-5,
// 2026-09-29), and publishes into the showcase's output at ui.kolkrabbi.io/apps/panels.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [react(), svgr(), tailwindcss()],

  base: command === 'build' ? '/apps/panels/' : '/',

  build: {
    // Built after the showcase, whose emptyOutDir would otherwise wipe this folder.
    outDir: '../../showcase/dist/apps/panels',
    emptyOutDir: true,
    chunkSizeWarningLimit: 8000,
  },

  // ONE public/ at repo root (ARCHITECTURE §7) — dev only; the showcase build already emits it.
  publicDir: command === 'build' ? false : '../../public',

  resolve: {
    dedupe: ['react', 'react-dom'],
    // `design-editor-src/…` — the editor's SOURCE, by name. The panels are the editor's own
    // internals (AutoControls, BindDot, the schemas), which the package does not export: this is
    // a dev app iterating on them, not a consumer, so it reads them where they live — the same
    // live link apps/editor has — and says so in every import.
    alias: [{ find: /^design-editor-src\//, replacement: SRC + '/' }],
  },

  // its own port after apps/studio (5190)
  server: { port: 5191 },

  optimizeDeps: {
    include: [
      '@kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/kol-component > embla-carousel-react',
    ],
    // kol-icons builds its map with import.meta.glob — prebundling ships an EMPTY icon map.
    exclude: ['@kolkrabbi/kol-icons'],
  },
}))
