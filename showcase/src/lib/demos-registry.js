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
    { Component: mod.default, source: sources[path] },
  ]),
)
