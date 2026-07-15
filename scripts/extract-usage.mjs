#!/usr/bin/env node
/**
 * extract-usage.mjs — mine real-world component usage from KOL consumer apps.
 *
 * Walks a curated set of consumer projects (the "use cases"), finds every JSX
 * usage of each exported KOL component, and emits:
 *   - docs/documentation/07-usage/<Component>.md    human/LLM reference, one file per component
 *   - showcase/src/usage/usage-index.json   machine-readable, rendered by the gallery
 *
 * Source-available, honest: snippets are copied verbatim from the consumers and
 * attributed by app. No network, no deps.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, basename, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
const DEV = '/Users/biskup/dev/projects'

// --- consumer roots: the real KOL use cases (exclude this repo + the seeds) ---
// kind 'group' = each child folder is its own app; kind 'app' = the root is the app.
// Post-2026-07 rename: consumers live under kol-apps/* + kol-website.
const ROOT_DEFS = [
  { path: 'kol-apps', kind: 'group' },
  { path: 'kol-website', kind: 'app' },
].map((r) => ({ ...r, abs: join(DEV, r.path) }))
const ROOTS = ROOT_DEFS.map((r) => r.abs)

// A missing root means the repo layout moved again — hard-fail so this miner
// can never silently emit an empty index over the real one (2026-07-15 audit:
// nine dead roots produced a "clean" run that would have wiped the data).
for (const r of ROOT_DEFS) {
  if (!existsSync(r.abs)) {
    console.error(`extract-usage: consumer root MISSING: ${r.abs} — fix ROOT_DEFS before mining.`)
    process.exit(1)
  }
}

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite', 'build', '.next', 'coverage'])
const CODE_RE = /\.(jsx|tsx|js|ts)$/

// --- the component registry: EVERY package barrel, via the shared parser -------
// (scripts/lib/parse-barrel.mjs — same enumeration as the showcase roster and
// the validate:roster CI gate, so the three can never disagree.)
const registry = []
{
  const pkgsDir = join(REPO, 'packages')
  for (const dir of readdirSync(pkgsDir)) {
    const src = join(pkgsDir, dir, 'src')
    if (!existsSync(join(src, 'index.js'))) continue
    const files = {}
    const collect = (d) => {
      for (const name of readdirSync(d, { withFileTypes: true })) {
        const full = join(d, name.name)
        if (name.isDirectory() && name.name !== 'node_modules') collect(full)
        else if (name.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
      }
    }
    collect(src)
    const pkg = JSON.parse(readFileSync(join(pkgsDir, dir, 'package.json'), 'utf8')).name
    for (const e of parseBarrelExports(files)) {
      if (!isComponentName(e.name)) continue
      const cat = folderOf(e.src) || (dir === 'framework' ? 'framework' : 'flat')
      registry.push({ name: e.name, pkg, category: cat, src: e.src })
    }
  }
}

// non-component exports we don't hunt for as JSX tags
const NON_JSX = new Set(['ModalProvider', 'PopoverPanel'])
const components = registry.filter((c) => /^[A-Z]/.test(c.name) && !NON_JSX.has(c.name))

// --- walk consumer files -------------------------------------------------------
function* walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) yield* walk(full)
    else if (CODE_RE.test(name)) yield full
  }
}

const files = []
for (const root of ROOTS) for (const f of walk(root)) files.push(f)

// app label = the project folder for the consuming app
function appOf(file) {
  for (const r of ROOT_DEFS) {
    if (!file.startsWith(r.abs + '/')) continue
    if (r.kind === 'app') return basename(r.abs)
    const rest = relative(r.abs, file).split('/')
    return rest[0] || basename(r.abs)
  }
  return basename(dirname(file))
}

// --- match JSX usage -----------------------------------------------------------
function snippetsFor(name, text) {
  const found = []
  const tag = new RegExp(`<${name}\\b`, 'g')
  let m
  while ((m = tag.exec(text)) && found.length < 40) {
    const start = m.index
    // self-closing or open tag end
    const selfClose = text.slice(start).match(new RegExp(`^<${name}\\b[\\s\\S]*?/>`))
    let snip
    if (selfClose) {
      snip = selfClose[0]
    } else {
      const paired = text.slice(start).match(new RegExp(`^<${name}\\b[\\s\\S]*?</${name}>`))
      snip = paired ? paired[0] : (text.slice(start).match(new RegExp(`^<${name}\\b[^>]*>`)) || ['<' + name + '>'])[0]
    }
    if (snip.length <= 700) found.push(snip.trim())
  }
  return found
}

const results = new Map(components.map((c) => [c.name, { ...c, count: 0, apps: new Set(), files: new Set(), candidates: [] }]))

for (const file of files) {
  let text
  try { text = readFileSync(file, 'utf8') } catch { continue }
  const app = appOf(file), rel = relative(DEV, file)
  for (const c of components) {
    if (!text.includes('<' + c.name)) continue
    const snips = snippetsFor(c.name, text)
    if (!snips.length) continue
    const r = results.get(c.name)
    r.count += snips.length
    r.apps.add(app)
    r.files.add(rel)
    if (r.candidates.length < 200) for (const s of snips) r.candidates.push({ app, file: rel, code: s })
  }
}

// pick the 5 most informative, app-diverse, deduped examples
function pickExamples(cands) {
  const score = (c) => (/\w=[{"']/.test(c.code) ? 3 : 0)        // has real props
    + (c.code.includes('\n') ? 1 : 0)                            // multi-line (children)
    + (c.code.length >= 50 && c.code.length <= 480 ? 2 : 0)      // readable size
    - (/\.\.\.\s*\/?>/.test(c.code) ? 3 : 0)                     // penalise <X ... /> placeholders
  const ranked = [...cands].sort((a, b) => score(b) - score(a))
  const out = [], seen = new Set(), apps = new Set()
  for (const pass of [1, 2]) for (const c of ranked) {
    if (out.length >= 5) break
    if (seen.has(c.code)) continue
    if (pass === 1 && apps.has(c.app)) continue   // first pass: one per app for diversity
    out.push(c); seen.add(c.code); apps.add(c.app)
  }
  return out
}
for (const r of results.values()) r.examples = pickExamples(r.candidates)

// --- emit ---------------------------------------------------------------------
const usageDocs = join(REPO, 'docs/documentation/07-usage')
const showcaseUsage = join(REPO, 'showcase/src/usage')
mkdirSync(usageDocs, { recursive: true })
mkdirSync(showcaseUsage, { recursive: true })

const index = []
const sorted = [...results.values()].sort((a, b) => b.count - a.count)

for (const r of sorted) {
  const apps = [...r.apps].sort()
  const entry = {
    name: r.name, pkg: r.pkg, category: r.category,
    count: r.count, apps, files: r.files.size,
    examples: r.examples,
  }
  index.push(entry)

  const md = []
  md.push(`# ${r.name}`)
  md.push('')
  md.push(`- **Package:** \`${r.pkg}\``)
  md.push(`- **Category:** ${r.category}`)
  md.push(`- **Real-world usages found:** ${r.count} across ${r.files.size} files in ${apps.length} apps`)
  md.push(`- **Used in:** ${apps.length ? apps.join(', ') : '— (no consumer usage found)'}`)
  md.push('')
  md.push(`## Import`)
  md.push('')
  md.push('```jsx')
  md.push(`import { ${r.name} } from '${r.pkg}'`)
  md.push('```')
  md.push('')
  if (r.examples.length) {
    md.push(`## Real usage`)
    md.push('')
    for (const ex of r.examples) {
      md.push(`From \`${ex.file}\`:`)
      md.push('')
      md.push('```jsx')
      md.push(ex.code)
      md.push('```')
      md.push('')
    }
  } else {
    md.push('_No consumer usage mined yet — component is published but unused across the scanned apps._')
    md.push('')
  }
  writeFileSync(join(usageDocs, `${r.name}.md`), md.join('\n'))
}

writeFileSync(join(showcaseUsage, 'usage-index.json'), JSON.stringify(index, null, 2))

const withUsage = index.filter((e) => e.count > 0).length
console.log(`scanned ${files.length} files across ${ROOTS.length} roots`)
console.log(`components tracked: ${components.length}  |  with real usage: ${withUsage}`)
console.log(`emitted: docs/documentation/07-usage/*.md (${index.length})  +  showcase/src/usage/usage-index.json`)
console.log('\ntop 15 by usage:')
for (const e of sorted.slice(0, 15)) console.log(`  ${String(e.count).padStart(5)}  ${e.name.padEnd(18)} ${e.apps.size} apps`)
