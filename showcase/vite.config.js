import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import { devFavicon, loaderApp } from '@kolkrabbi/kol-framework/vite'

// https://vite.dev/config/
export default defineConfig({
  // mdx MUST precede react: it compiles .mdx → JSX, which react then transforms.
  // `providerImportSource` lets MDXProvider inject the shared component map, so
  // a doc gets <Preview>, <ApiTable> etc. without importing them per file.
  plugins: [devFavicon({ label: 'K' }), loaderApp({ graphic: '../packages/icons/src/kol-icon-set-identity/kol-ds/kol-ds.svg' }), 
    /* include: .mdx ONLY — the plugin also claims .md by default, which turns
       every `?raw` markdown import (the docs vault, the lobby queue) into a
       compiled module and breaks the markdown engine downstream. */
    /* remark-gfm (the showcase review W10, 2026-09-30): MDX is CommonMark, which has no tables — every
     * `| … |` table in a guide printed as one line of pipes. GFM adds tables, strikethrough and task lists. */
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react', include: /\.mdx$/, remarkPlugins: [remarkGfm] }) },
    react(),
    svgr(),
    tailwindcss(),
  ],
  // ONE public/ at repo root (repo rule, 2026-07-15) — every app points at it
  // via publicDir instead of keeping its own copy to hunt down.
  publicDir: '../public',
  // Workspace hoisting can leave two physical React copies in the tree
  // (root vs app node_modules), which crashes at runtime with a null
  // dispatcher. Force a single react / react-dom copy.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
