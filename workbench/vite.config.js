import tailwindcss from '@tailwindcss/vite'

// Ladle bundles its own Vite (v6) and handles JSX/React itself — we only add
// what KOL needs on top: Tailwind v4 processing, and the single-React-copy fix.
// Plain object (not defineConfig) to stay decoupled from Ladle's Vite version.
export default {
  plugins: [tailwindcss()],
  // Workspace hoisting can leave two React copies in the tree, which crashes at
  // runtime with a null dispatcher. Force one copy. (Same fix as showcase.)
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // KOL theme references brand fonts at absolute /fonts/* paths. Serve the
  // showcase's existing font files (no ~17MB duplication) instead of a local copy.
  publicDir: '../showcase/public',
}
