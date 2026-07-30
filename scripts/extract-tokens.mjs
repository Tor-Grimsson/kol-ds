#!/usr/bin/env node
/**
 * extract-tokens.mjs — the other half of the reference graph.
 *
 * extract-usage.mjs mines COMPONENT edges. This mines TOKEN and CLASS edges:
 * every `--kol-*` custom property and `.kol-*` class, resolved to the file that
 * DEFINES it, weighted by how much each consumer leans on it.
 *
 * Emits:
 *   - showcase/src/usage/token-index.json   machine-readable, rendered by /references
 *   - docs/documentation/07-usage/_tokens.md a single human/LLM reference
 *
 * THE DERIVATION RULE
 *
 *   An edge exists only if changing or deleting A would change or break B.
 *
 * This extractor reads only what a file USES, so it can only ever emit derivation
 * edges. `--kol-red-300` and `--kol-red-400` can never edge to each other — neither
 * uses the other — and no threshold needs tuning to prevent it. Both edge to the
 * ramp file that defines them, which is the correct parent. Co-use on one page is
 * the page's edge, not theirs.
 *
 * Weights, computed and never declared (a self-rated graph looks authoritative
 * while lying):
 *   2  used 3+ times in one file
 *   1  used once or twice — "an element referenced within a component"
 *
 * No network, no deps. Mirrors extract-usage.mjs's walk and its hard-fail on a
 * missing root (2026-07-15: nine dead roots produced a "clean" run).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, basename, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
const DEV = '/Users/biskup/dev/projects'

const ROOT_DEFS = [
  { path: 'kol-apps', kind: 'group' },
  { path: 'kol-website', kind: 'app' },
].map((r) => ({ ...r, abs: join(DEV, r.path) }))

for (const r of ROOT_DEFS) {
  if (!existsSync(r.abs)) {
    console.error(`extract-tokens: consumer root MISSING: ${r.abs} — fix ROOT_DEFS before mining.`)
    process.exit(1)
  }
}

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite', 'build', '.next', 'coverage', '_tmp'])
const SCAN_RE = /\.(jsx|tsx|js|ts|css|scss|mdx)$/
const VAR = /--kol-[a-z0-9]+(?:-[a-z0-9]+)*/g
const CLS = /\bkol-[a-z0-9]+(?:-[a-z0-9]+)*\b/g
const DEFINE_VAR = /^\s*(--kol-[a-z0-9-]+)\s*:/gm
const DEFINE_CLS = /^\s*\.(kol-[a-z0-9-]+)/gm

// Concern is read from the NAME first, then the defining file — no new taxonomy for
// anyone to maintain. The name wins because `--kol-surface-primary` is chrome no
// matter which file happens to declare it, and a file-only rule put 287 of 460 nodes
// into "other" on the first run.
const NAME_CONCERNS = [
  [/^(fg|bg|color|accent|brand|swatch|palette|hue|tint|shade|ink)\b/, 'color'],
  [/^(font|type|text|prose|mono|sans|serif|helper|leading|tracking|weight)\b/, 'type'],
  [/^(bp|breakpoint|screen|viewport)\b/, 'breakpoint'],
  [/^(spacing|space|pad|gap|grid|rail|width|max|col|row|stack|combo|layout|inset)\b/, 'layout'],
  [/^(nav|sidenav|shell|sidebar|header|topnav|footer|menu|toc|drawer)\b/, 'nav'],
  [/^(surface|border|radius|opacity|opaque|oq|elevation|shadow|z|ring|control|btn|chrome|blur)\b/, 'chrome'],
]
const FILE_CONCERNS = [
  [/color|brand-color|swatch|palette/, 'color'],
  [/typograph|type-|font|mono/, 'type'],
  [/breakpoint|responsive/, 'breakpoint'],
  [/layout|grid|spacing|rail/, 'layout'],
  [/nav|shell|sidebar|header/, 'nav'],
  [/chrome|control|surface|border|opacity|opaque|elevation|radius/, 'chrome'],
]
const concernOf = (name, file) => {
  const stem = name.replace(/^--kol-|^kol-/, '')
  return NAME_CONCERNS.find(([rx]) => rx.test(stem))?.[1]
    || FILE_CONCERNS.find(([rx]) => rx.test(basename(file)))?.[1]
    || 'component'   // component-scoped styling: a real category, not a failure to classify
}

function* walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) yield* walk(full)
    else if (SCAN_RE.test(name)) yield full
  }
}

// --- 1 · the definitions: what the graph can point AT --------------------------
const defs = new Map()   // name -> { file, concern, kind }
for (const dir of ['packages/theme', 'packages/framework']) {
  const abs = join(REPO, dir)
  if (!existsSync(abs)) continue
  for (const file of walk(abs)) {
    if (!file.endsWith('.css')) continue
    const text = readFileSync(file, 'utf8')
    const rel = relative(REPO, file)
    for (const m of text.matchAll(DEFINE_VAR)) {
      if (!defs.has(m[1])) defs.set(m[1], { file: rel, concern: concernOf(m[1], file), kind: "token" })
    }
    for (const m of text.matchAll(DEFINE_CLS)) {
      if (!defs.has(m[1])) defs.set(m[1], { file: rel, concern: concernOf(m[1], file), kind: "class" })
    }
  }
}

// --- 2 · the usages: who derives from them -------------------------------------
const sources = [
  ...ROOT_DEFS.map((r) => ({ abs: r.abs, kind: r.kind, base: DEV })),
  { abs: join(REPO, 'packages'), kind: 'app', base: DEV },
  { abs: join(REPO, 'showcase'), kind: 'app', base: DEV },
]

const appOf = (file) => {
  for (const r of ROOT_DEFS) {
    if (!file.startsWith(r.abs + '/')) continue
    if (r.kind === 'app') return basename(r.abs)
    return relative(r.abs, file).split('/')[0] || basename(r.abs)
  }
  return file.startsWith(REPO + '/') ? 'kol-ds-ui' : basename(dirname(file))
}

const results = new Map()
const ensure = (name) => {
  if (!results.has(name)) {
    const d = defs.get(name)
    results.set(name, {
      name, kind: d.kind, definedIn: d.file, concern: d.concern,
      count: 0, weighted: 0, apps: new Set(), edges: [],
    })
  }
  return results.get(name)
}

let scanned = 0
for (const src of sources) {
  for (const file of walk(src.abs)) {
    let text
    try { text = readFileSync(file, 'utf8') } catch { continue }
    scanned++
    const rel = relative(DEV, file)
    const app = appOf(file)
    const counts = new Map()
    for (const rx of [VAR, CLS]) {
      for (const m of text.matchAll(rx)) {
        const name = m[0]
        if (!defs.has(name)) continue                 // unknown: not a node
        if (defs.get(name).file === relative(REPO, file)) continue   // self-definition
        counts.set(name, (counts.get(name) || 0) + 1)
      }
    }
    for (const [name, uses] of counts) {
      const r = ensure(name)
      const stars = uses >= 3 ? 2 : 1
      r.count += uses
      r.weighted += stars
      r.apps.add(app)
      r.edges.push({ file: rel, app, uses, stars })
    }
  }
}
for (const r of results.values()) r.edges.sort((a, b) => b.stars - a.stars || b.uses - a.uses)

// --- 3 · emit ------------------------------------------------------------------
const showcaseUsage = join(REPO, 'showcase/src/usage')
const usageDocs = join(REPO, 'docs/documentation/07-usage')
mkdirSync(showcaseUsage, { recursive: true })
mkdirSync(usageDocs, { recursive: true })

const index = [...results.values()]
  .sort((a, b) => b.weighted - a.weighted)
  .map((r) => ({
    name: r.name, kind: r.kind, definedIn: r.definedIn, concern: r.concern,
    count: r.count, weighted: r.weighted, apps: [...r.apps].sort(),
    edgeCount: r.edges.length, edges: r.edges.slice(0, 40),
  }))

writeFileSync(join(showcaseUsage, 'token-index.json'), JSON.stringify(index, null, 2))

const weights = index.map((e) => e.weighted).filter(Boolean).sort((a, b) => a - b)
const median = weights.length ? weights[Math.floor(weights.length / 2)] : 0
const threshold = Math.max(median * 3, 2)
const byConcern = index.reduce((a, e) => (a[e.concern] = (a[e.concern] || 0) + 1, a), {})

const md = ['# Tokens & classes — the reference graph', '',
  'Generated by `pnpm extract:tokens`. Every row is a node the design system can point at;',
  'every edge is a file that would change or break if the node changed. Siblings on one ramp',
  'never edge to each other — the extractor reads only what a file *uses*.', '',
  `- **Nodes defined:** ${defs.size}  |  **referenced:** ${index.length}`,
  `- **Canon threshold:** ${threshold}★ (3× the median of ${median}) — ${index.filter((e) => e.weighted >= threshold).length} over`,
  `- **By concern:** ${Object.entries(byConcern).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`,
  '', '## Most load-bearing', '', '| ★ | edges | node | concern | defined in |', '|---|---|---|---|---|']
for (const e of index.slice(0, 40)) {
  md.push(`| ${e.weighted} | ${e.edgeCount} | \`${e.name}\` | ${e.concern} | \`${e.definedIn}\` |`)
}
md.push('')
writeFileSync(join(usageDocs, '_tokens.md'), md.join('\n'))

console.log(`scanned ${scanned} files`)
console.log(`nodes defined: ${defs.size}  |  referenced: ${index.length}  |  unreferenced: ${defs.size - index.length}`)
console.log(`weighted median ${median} | canon threshold ${threshold} (3x median)`)
console.log(`by concern: ${Object.entries(byConcern).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`)
console.log(`emitted: showcase/src/usage/token-index.json  +  docs/documentation/07-usage/_tokens.md`)
console.log('\ntop 15 by weighted inbound:')
for (const e of index.slice(0, 15)) {
  console.log(`  ${String(e.weighted).padStart(5)}★ ${e.name.padEnd(34)} ${String(e.edgeCount).padStart(4)} edges  ${e.concern}`)
}
