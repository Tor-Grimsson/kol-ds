/* The names each set ships — keys only, no SVG text, so this costs nothing to import. Icon.jsx reads it to learn
 * WHICH set a name belongs to before fetching that set's chunk (1.5, plan-2026-10-28-identity); index.js builds the
 * grouped indexes from the same globs. A keys-only `import.meta.glob` (no `eager`) is a map of lazy importers that
 * nobody calls — only `Object.keys` is read. */
const names = (mods, keep = () => true) => {
  const s = new Set()
  for (const path of Object.keys(mods)) {
    const parts = path.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    if (keep(name, parts.pop())) s.add(name)
  }
  return s
}
export const INTERFACE_NAMES = names(import.meta.glob('./kol-icon-set-interface/**/*.svg'))
export const SIGNAL_NAMES = names(import.meta.glob('./kol-icon-set-signal/**/*.svg'))
export const IDENTITY_NAMES = names(import.meta.glob('./kol-icon-set-identity/*/*.svg'), (name, folder) => name === folder)

/* interface decides a name both sets drew (2026-08-28: `chevron-*`, `nav-*`, `dith-flow`, `ptrn-checker`, `ptrn-dot`
 * were left out of signal rather than shipped to collide); identity last */
export const setOf = (name) => (INTERFACE_NAMES.has(name) ? 'interface' : SIGNAL_NAMES.has(name) ? 'signal' : IDENTITY_NAMES.has(name) ? 'identity' : null)
