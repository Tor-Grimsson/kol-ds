/**
 * parse-barrel.mjs — pure barrel-export parser, shared by the roster
 * (showcase/src/lib/roster.js, via Vite ?raw glob), the CI completeness gate
 * (scripts/validate-roster.mjs), and the usage miner (extract-usage.mjs).
 * One parser = the enumeration can never disagree with itself.
 *
 * No node imports — callers supply the file texts:
 *   files: { 'index.js': txt, 'shell/index.js': txt, ... }  (keys relative to src/)
 * Follows `export * from './sub/index.js'` one-or-more levels (kol-workshop).
 */

/* PascalCase and not UPPER_SNAKE (GRAPHICS, ICON_ENTRIES are data, not components) */
export const isComponentName = (n) => /^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n)

/* './atoms/X.jsx' → 'atoms'; './X.jsx' → null (flat package) */
export const folderOf = (src) => (src?.match(/^\.\/(\w[\w-]*)\//) || [])[1] || null

const normalize = (from, ref) => {
  // resolve ref ('./shell/index.js') against the dir of `from` ('index.js' | 'shell/index.js')
  const dir = from.includes('/') ? from.slice(0, from.lastIndexOf('/') + 1) : ''
  return (dir + ref.replace(/^\.\//, '')).replace(/\/\.\//g, '/')
}

export function parseBarrelExports(files, entry = 'index.js', _seen = new Set()) {
  const txt = files[entry]
  if (!txt || _seen.has(entry)) return []
  _seen.add(entry)

  const out = []
  const push = (name, src) => {
    if (!out.some((e) => e.name === name)) out.push({ name, src })
  }
  const prefix = entry.includes('/') ? './' + entry.slice(0, entry.lastIndexOf('/') + 1) : './'

  // default re-exports:  export { default as X } from './atoms/X.jsx'
  for (const m of txt.matchAll(/export \{ default as (\w+)(?:, [^}]*)? \} from '(\.\/[^']+)'/g)) {
    push(m[1], prefix === './' ? m[2] : prefix + m[2].replace(/^\.\//, ''))
  }
  // named re-exports:    export { A, B, C } from './molecules/Y.jsx'
  for (const m of txt.matchAll(/export \{ ([^}]*) \} from '(\.\/[^']+)'/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.replace(/default as /, '').trim()
      if (/^[A-Z]\w+$/.test(name)) push(name, prefix === './' ? m[2] : prefix + m[2].replace(/^\.\//, ''))
    }
  }
  // star re-exports:     export * from './shell/index.js'  → recurse
  for (const m of txt.matchAll(/export \* from '(\.\/[^']+)'/g)) {
    const sub = normalize(entry, m[1])
    for (const e of parseBarrelExports(files, sub, _seen)) push(e.name, e.src)
  }
  return out
}
