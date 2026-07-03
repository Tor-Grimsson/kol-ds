#!/usr/bin/env node
/**
 * extract-composition — for every block and set, derive the FULL component
 * manifest from source: which published KOL components it uses (transitively),
 * which showcase-local parts compose it, and which external deps it pulls.
 *
 * Scanner-first (the repo doctrine): the slug pages render this file; nothing
 * is hand-authored, so the list can't drift from the code.
 *
 * Output: showcase/src/usage/composition.json
 *   { blocks: { <key>: { kol: [..], local: { '<area>': [..] }, support: [..], external: [..] } },
 *     sets:   { ... } }
 *
 * Runs as part of `pnpm extract:docs`.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'showcase/src')

const KOL_PKGS = ['@kolkrabbi/kol-component', '@kolkrabbi/kol-loader', '@kolkrabbi/kol-framework']

/* Resolve a relative import to a real file (mirrors Vite's resolution). */
function resolveImport(fromFile, spec) {
  const base = resolve(dirname(fromFile), spec)
  for (const candidate of [base, `${base}.jsx`, `${base}.js`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

/* All import statements of a module: [{ spec, names }] — names = named + default specifiers. */
function importsOf(file) {
  const txt = readFileSync(file, 'utf8')
  const out = []
  const re = /import\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*['"]([^'"]+)['"]/g
  for (const m of txt.matchAll(re)) {
    const names = []
    if (m[1]) names.push(m[1])
    if (m[2]) for (const n of m[2].split(',')) {
      const name = n.trim().split(/\s+as\s+/).pop().trim()
      if (name) names.push(name)
    }
    out.push({ spec: m[3], names })
  }
  // side-effect imports (css etc.)
  for (const m of txt.matchAll(/import\s*['"]([^'"]+)['"]/g)) out.push({ spec: m[1], names: [] })
  // re-export barrels: export { default as X, Y } from './mod' / export * from './mod'
  for (const m of txt.matchAll(/export\s+(?:\*|\{([^}]*)\})\s*from\s*['"]([^'"]+)['"]/g)) {
    const names = []
    if (m[1]) for (const n of m[1].split(',')) {
      const name = n.trim().split(/\s+as\s+/).pop().trim()
      if (name && name !== 'default') names.push(name)
    }
    out.push({ spec: m[2], names })
  }
  return out
}

/* Area label for a local file — the composition list groups by this. */
function areaOf(file) {
  const rel = relative(SRC, file).replace(/\\/g, '/')
  const parts = rel.split('/')
  if (parts[0] === 'workshop') return parts.slice(0, 2).join('/')
  return parts[0]
}

/* Walk one entry transitively; collect the manifest. */
function scan(entry) {
  const kol = new Set()
  const external = new Set()
  const localParts = {} // area -> Set of component names (.jsx)
  const support = new Set() // local .js modules (hooks/utils/data)
  const visited = new Set()
  const queue = [entry]

  while (queue.length) {
    const file = queue.pop()
    if (visited.has(file)) continue
    visited.add(file)

    for (const { spec, names } of importsOf(file)) {
      if (KOL_PKGS.includes(spec)) {
        names.forEach((n) => kol.add(n))
      } else if (spec.startsWith('.')) {
        if (spec.endsWith('.css')) continue
        const target = resolveImport(file, spec)
        if (!target) continue
        const name = (target.split('/').pop() || '').replace(/\.(jsx|js)$/, '')
        if (target !== entry) {
          if (target.endsWith('.jsx')) {
            const area = areaOf(target)
            ;(localParts[area] ||= new Set()).add(name)
          } else if (!/^index$/.test(name)) {
            support.add(name)
          }
        }
        queue.push(target)
      } else if (!spec.startsWith('@kolkrabbi/') && spec !== 'react' && spec !== 'react-dom') {
        external.add(spec.startsWith('react-') && spec !== 'react-router-dom' ? spec : spec)
      }
    }
  }

  return {
    kol: [...kol].sort(),
    local: Object.fromEntries(Object.entries(localParts).map(([k, v]) => [k, [...v].sort()]).sort()),
    support: [...support].sort(),
    external: [...external].sort(),
  }
}

const result = {}
for (const kind of ['blocks', 'sets']) {
  result[kind] = {}
  for (const f of readdirSync(join(SRC, kind)).filter((f) => f.endsWith('.jsx'))) {
    result[kind][f.replace('.jsx', '')] = scan(join(SRC, kind, f))
  }
}

const out = join(SRC, 'usage/composition.json')
writeFileSync(out, JSON.stringify(result, null, 2))
const counts = Object.entries(result).map(([k, v]) => `${k}: ${Object.keys(v).length}`).join(' · ')
console.log(`composition: ${counts} → ${relative(REPO, out)}`)
