/**
 * One-file demos — the shadcn model, adapted to Vite.
 *
 * Each demo is a real file in ../demos/<Component>.jsx (default export). We glob
 * the folder twice:
 *   - as modules → the Component to RENDER (Preview tab)
 *   - as ?raw     → the file's exact source string to SHOW (Code tab)
 * So the preview and the code are literally the same file — they can't drift.
 * import.meta.glob is the auto-index (no build step, like shadcn's registry).
 * This is the single demo source of truth (the old render + hand-typed `code`
 * lib/demos.jsx has been retired).
 */

const modules = import.meta.glob('../demos/*.jsx', { eager: true })
const sources = import.meta.glob('../demos/*.jsx', { eager: true, query: '?raw', import: 'default' })

const keyOf = (path) => (path.split('/').pop() || '').replace('.jsx', '')

export const DEMOS = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    keyOf(path),
    // `stage` is the demo's presentation preset (see lib/DemoStage.jsx);
    // omitted → 'hug'. `Card` is an optional slim single-specimen export the
    // /components index prefers over the full demo — small cards show ONE
    // canonical instance, the component page keeps full variant coverage.
        /* `variants` (2026-08-01): a demo exporting a string array gets a picker in
       PreviewCard's toolbar and receives the active one as its `variant` prop —
       variants preview in place instead of needing a demo file each. */
    { Component: mod.default, Card: mod.Card || null, source: sources[path], stage: mod.stage || 'hug', variants: mod.variants || null },
  ]),
)
