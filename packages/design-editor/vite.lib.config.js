import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// Library build — emits the embeddable @kolkrabbi/design-editor package
// (dist/design-editor.js + dist/design-editor.css). The standalone app build
// stays in vite.config.js (the deploy target); the two never overlap.
//   pnpm build:lib
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  /* no app public/ in a library build — with it the tarball was 122 MB / 278 files (kol-fxr, 2026-09-03) */
  publicDir: false,
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    /* The cut (deconstruction T5, 2026-09-27): the full editor at the root, the core without
     * packs at ./core, and one entry per pack. Modules shared between entries land in shared
     * chunks — the seam (editor/packs.js) is ONE instance, which is what lets a pack imported
     * from its own subpath register into the core the host mounted. */
    lib: {
      entry: {
        'design-editor': 'src/index.jsx',
        core: 'src/core.jsx',
        generators: 'src/packs/generators.js',
        effects: 'src/packs/effects.js',
        motion: 'src/packs/motion.js',
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'design-editor',
    },
    // One stylesheet the consumer imports, not per-chunk fragments.
    cssCodeSplit: false,
    rollupOptions: {
      // Singletons the host must own a single copy of. React (+ router) share
      // one instance or the DS peer-deps crash with a null dispatcher; the
      // @kolkrabbi/* JS stays the host's so editor and host use ONE DS build.
      // ponytail: DS *CSS* is still bundled into design-editor.css (self-
      // contained visuals) — a host also importing kol-theme gets idempotent
      // duplicate custom-props. Externalize the css too if that ever matters.
      external: [/^react($|\/|-)/, /^@kolkrabbi\//],
    },
  },
})
