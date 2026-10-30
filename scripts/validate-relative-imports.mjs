#!/usr/bin/env node
/**
 * validate-relative-imports — every relative import in a raw-source package names its file, extension and all
 * (WebsiteFrameDuplicateModules, kol-website 2026-10-28).
 *
 * Packages ship raw source (ARCHITECTURE §4) and apps keep them out of Vite's prebundle, so Vite serves each file by the
 * URL it was imported with: `./WorkViewContext` and `./WorkViewContext.jsx` become two modules, and a provider and its
 * hook end up holding two different contexts — in dev only; a build merges them. design-editor is exempt: it ships
 * built. `--write` resolves each bare import to the file on disk and adds the extension.
 *
 * CONTEXTS, too (WebsiteFrameContextStillSplit, 2026-10-29): extensions are not enough on Vite 5, which versions a
 * barrel's re-exports (`?v=`) but not the package's inner imports — two URLs, two modules, again. Every `createContext`
 * in a raw-source package is made once on a global key, `globalThis[Symbol.for('@kolkrabbi/<pkg>/<Name>')] ??= …`, so a
 * second copy of the module hands back the first one's context.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXEMPT = new Set(['design-editor'])
const write = process.argv.includes('--write')
const RE = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]+)\2/g
const HAS_EXT = /\.(jsx?|mjs|cjs|css|json|svg|png|jpe?g|webp|md|txt|woff2?|ttf)(\?[\w=&-]+)?$/

const walk = (d, out = []) => {
  for (const n of readdirSync(d)) {
    if (n === 'node_modules' || n.startsWith('.')) continue
    const p = join(d, n)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx?|mjs)$/.test(n)) out.push(p)
  }
  return out
}
const resolveFile = (from, spec) => {
  const base = join(dirname(from), spec)
  for (const ext of ['.jsx', '.js', '.mjs']) if (existsSync(base + ext)) return spec + ext
  for (const ext of ['/index.js', '/index.jsx']) if (existsSync(base + ext)) return spec + ext
  return null
}

const errors = []
let fixed = 0
for (const pkg of readdirSync(join(REPO, 'packages'))) {
  const src = join(REPO, 'packages', pkg, 'src')
  if (EXEMPT.has(pkg) || !existsSync(src)) continue
  for (const file of walk(src)) {
    const text = readFileSync(file, 'utf8')
    let changed = false
    const next = text.replace(RE, (m, lead, q, spec) => {
      if (HAS_EXT.test(spec)) return m
      const to = resolveFile(file, spec)
      if (!to) { errors.push(`UNRESOLVED   ${relative(REPO, file)}  ${spec}`); return m }
      if (!write) { errors.push(`NO EXT       ${relative(REPO, file)}  ${spec}  → ${to}`); return m }
      changed = true; fixed++
      return `${lead}${q}${to}${q}`
    })
    if (changed) writeFileSync(file, next)
    for (const [i, line] of text.split('\n').entries())
      if (/createContext\(/.test(line) && !/(\?\?|\|\|)=\s*(React\.)?createContext\(/.test(line) && !/^\s*(\*|\/\/)/.test(line))
        errors.push(`BARE CONTEXT ${relative(REPO, file)}:${i + 1}  (make it once: globalThis[Symbol.for('@kolkrabbi/kol-${pkg}/<Name>')] ??= createContext(…))`)
  }
}
if (write && fixed) console.log(`relative-imports: wrote ${fixed} extension(s)`)
if (errors.length) {
  console.error(errors.map((e) => `  ${e}`).join('\n'))
  console.error(`relative-imports: ${errors.length} violation(s)`)
  process.exit(1)
}
console.log('relative-imports: clean (every relative import names its file; every context is made once on a global key)')
