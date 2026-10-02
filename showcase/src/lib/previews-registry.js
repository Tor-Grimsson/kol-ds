/**
 * One-file previews — the shadcn model, adapted to Vite.
 *
 * Each preview is a real file in ../previews/<Component>.jsx (default export). We glob
 * the folder twice:
 *   - as modules → the Component to RENDER (Preview tab)
 *   - as ?raw     → the file's exact source string to SHOW (Code tab)
 * So the preview and the code are literally the same file — they can't drift.
 * import.meta.glob is the auto-index (no build step, like shadcn's registry).
 * This is the single preview source of truth (the old render + hand-typed `code`
 * lib/previews.jsx has been retired).
 */

const modules = import.meta.glob('../previews/*.jsx', { eager: true })
const sources = import.meta.glob('../previews/*.jsx', { eager: true, query: '?raw', import: 'default' })

const keyOf = (path) => (path.split('/').pop() || '').replace('.jsx', '')

export const PREVIEWS = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    keyOf(path),
    // `stage` is the preview's presentation preset (see lib/PreviewStage.jsx);
    // omitted → 'hug'. `Card` is an optional slim single-specimen export the
    // /components index prefers over the full preview — small cards show ONE
    // canonical instance, the component page keeps full variant coverage.
        /* `variants` (2026-08-01) / `sizes` (2026-08-09): a preview exporting a string
       array gets a picker in PreviewCard's toolbar and receives the active one
       as its `variant` / `size` prop — the axes preview in place instead of
       needing a preview file each. */
    { name: keyOf(path), Component: mod.default, Card: mod.Card || null, source: sources[path], stage: mod.stage || 'hug', variants: mod.variants || null, tones: mod.tones || null, sizes: mod.sizes || null, states: mod.states || null,
      /* `frame` (2026-10-01): a page-sized component — a rail fixed to the window, a 100vh scaffold, an
       * overlay — previews in an iframe on its own bare route, so it is confined to the preview
       * instead of sitting over the showcase. A number sets the frame's height. */
      frame: mod.frame || false },
  ]),
)
