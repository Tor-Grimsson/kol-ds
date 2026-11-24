import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { devFavicon } from '@kolkrabbi/kol-framework/vite'

// design-editor's SOURCE. Labs takes one self-contained generator (loops/flow/obstacleFlow.js); the editor
// screen takes the package by name. Its exports point at dist, so both are aliased to src like apps/editor does,
// and `@design-editor-src/*` lands on the SAME files the package entry imports: one copy of every context.
const DE_SRC = fileURLToPath(new URL('../../packages/design-editor/src', import.meta.url))

// An apps/* member: Labs in the minimal style (2026-11-16), run locally with `pnpm --filter minimal dev`.
// Rules: docs/operations/07-apps-tier/01-tier-rules.md
export default defineConfig(({ command }) => ({
  plugins: [devFavicon({ label: 'M' }), react(), svgr(), tailwindcss()],
  base: command === 'build' ? '/apps/minimal/' : '/',
  build: { outDir: '../../showcase/dist/apps/minimal', emptyOutDir: true },
  // ONE public/ at repo root (ARCHITECTURE §7); not re-emitted in a build
  publicDir: command === 'build' ? false : '../../public',
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^@design-editor-src\/(.*)$/, replacement: DE_SRC + '/$1' },
      { find: /^@kolkrabbi\/design-editor$/, replacement: DE_SRC + '/index.jsx' },
      { find: /^@kolkrabbi\/design-editor\/core$/, replacement: DE_SRC + '/core.jsx' },
      { find: /^@kolkrabbi\/design-editor\/(generators|effects|motion)$/, replacement: DE_SRC + '/packs/$1.js' },
    ],
  },
  // its own port after growth (5215) and its neighbours
  server: { port: 5218, host: true },
  // kol-icons builds its maps with import.meta.glob — prebundling it ships EMPTY maps
  // the editor's kol-component and kol-shell arrive as installed source (raw JSX, a `?url` worker import); prebundling
  // them fails on that import, so they are served as source like the workspace packages, and their CommonJS deps are
  // prebundled by name (apps/editor does the same)
  optimizeDeps: {
    exclude: ['@kolkrabbi/kol-icons', '@kolkrabbi/kol-component', '@kolkrabbi/kol-shell'],
    include: [
      '@kolkrabbi/design-editor > @kolkrabbi/kol-component > react-syntax-highlighter',
      '@kolkrabbi/design-editor > @kolkrabbi/kol-component > embla-carousel-react',
    ],
  },
}))
