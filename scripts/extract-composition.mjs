#!/usr/bin/env node
/**
 * extract-composition — for every block and set, derive the FULL component
 * manifest from source: EVERY published KOL component it uses (walked
 * TRANSITIVELY into the package sources, so nested components a set only
 * uses indirectly still show up), which showcase-local parts compose it,
 * and which external deps it pulls.
 *
 * Scanner-first (the repo doctrine): the slug pages render this file; nothing
 * is hand-authored, so the list can't drift from the code.
 *
 * Transitivity: a set imports `ArticleCard` from the package — the scanner
 * resolves that to packages/component/src/molecules/ArticleCard.jsx (via the
 * barrels) and walks INTO it, so `Figure`, `Button`, `Image`, … that
 * ArticleCard composes all land in the manifest too. This is why a set slug
 * shows a long list of every component in use, not just the handful the set
 * file names directly.
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
import { parseBarrelExports } from './lib/parse-barrel.mjs'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'showcase/src')

/* every published package, derived — a new package can't silently fall out
 * of the walk (2026-07-15 audit P2-3: the hand list was missing styleguide) */
const KOL_PKGS = readdirSync(join(REPO, 'packages'))
  .map((d) => {
    try { return JSON.parse(readFileSync(join(REPO, 'packages', d, 'package.json'), 'utf8')).name }
    catch { return null }
  })
  .filter(Boolean)

/* Resolve a relative import to a real file (mirrors Vite's resolution). */
function resolveImport(fromFile, spec) {
  const base = resolve(dirname(fromFile), spec)
  for (const candidate of [base, `${base}.jsx`, `${base}.js`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

/* All import + re-export statements of a module: [{ spec, names }]. */
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

/* name -> package source file, built from EVERY package barrel via the shared
 * parser (scripts/lib/parse-barrel.mjs — same enumeration as the roster and
 * the validate:roster gate). Lets a `@kolkrabbi/*` import be walked
 * transitively into the real component. Replaces the 4-barrel hand list that
 * silently skipped the domain packages (2026-07-15 audit P2-3). */
const EXPORT_MAP = {}
for (const dir of readdirSync(join(REPO, 'packages'))) {
  const src = join(REPO, 'packages', dir, 'src')
  const entry = join(src, 'index.js')
  if (!existsSync(entry)) continue
  const files = {}
  const collect = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name)
      if (e.isDirectory() && e.name !== 'node_modules') collect(full)
      else if (e.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
    }
  }
  collect(src)
  for (const { name, src: ref } of parseBarrelExports(files)) {
    const target = resolveImport(entry, ref)
    if (target && !(name in EXPORT_MAP)) EXPORT_MAP[name] = target
  }
}

const isConst = (n) => /^[A-Z0-9_]+$/.test(n)       // GRAPHICS, CANVAS_VIRTUAL_W → data, not a component
const isComponent = (n) => /^[A-Z]/.test(n) && !isConst(n)

/* Area label for a showcase-local file — the composition groups by this. */
function areaOf(file) {
  const rel = relative(SRC, file).replace(/\\/g, '/')
  const parts = rel.split('/')
  if (parts[0] === 'workshop') return parts.slice(0, 2).join('/')
  return parts[0]
}

const inPkg = (f) => f.replace(/\\/g, '/').includes('/packages/')

/* Walk one entry transitively — INTO the package sources — and collect the manifest. */
function scan(entry) {
  const kol = new Set()
  const external = new Set()
  const localParts = {} // area -> Set of showcase-local component names (.jsx)
  const support = new Set() // hooks/utils (local .js modules + lowercase package exports)
  const visited = new Set()
  const queue = [entry]

  while (queue.length) {
    const file = queue.pop()
    if (visited.has(file)) continue
    visited.add(file)
    const fromPkg = inPkg(file)

    for (const { spec, names } of importsOf(file)) {
      if (KOL_PKGS.includes(spec)) {
        // published KOL import — record every name, then walk into its source
        for (const n of names) {
          if (isComponent(n)) kol.add(n)
          else if (!isConst(n)) support.add(n) // useTilt, resolveCssVar, getEmbedUrl…
          const target = EXPORT_MAP[n]
          if (target) queue.push(target)
        }
      } else if (spec.startsWith('.')) {
        if (spec.endsWith('.css')) continue
        const target = resolveImport(file, spec)
        if (!target) continue
        const name = (target.split('/').pop() || '').replace(/\.(jsx|js)$/, '')
        if (target !== entry) {
          if (fromPkg) {
            // inside the package: relative imports ARE nested KOL components/utils
            if (target.endsWith('.jsx') && isComponent(name)) kol.add(name)
            else if (!/^index$/.test(name) && !isConst(name)) support.add(name)
          } else if (target.endsWith('.jsx')) {
            const area = areaOf(target)
            ;(localParts[area] ||= new Set()).add(name)
          } else if (!/^index$/.test(name)) {
            support.add(name)
          }
        }
        queue.push(target)
      } else if (!spec.startsWith('@kolkrabbi/') && spec !== 'react' && spec !== 'react-dom') {
        external.add(spec)
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
console.log(`composition: blocks: ${Object.keys(result.blocks).length} · sets: ${Object.keys(result.sets).length} → showcase/src/usage/composition.json`)
