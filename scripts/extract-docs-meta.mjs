#!/usr/bin/env node
/**
 * extract-docs-meta — mines component SOURCE for the doc-page meta rows,
 * so D1/D2 render from truth instead of hand-authored data:
 *
 *   typeClasses — kol type classes the component renders text with
 *                 (kol-sans-* / kol-mono-* / kol-helper-* / kol-prose*)
 *   composes    — KOL components it nests (relative imports, named or
 *                 default; + Icon when kol-loader is used; + the same-file
 *                 augments the import scan can't see)
 *   freestyle   — Tailwind font-size/family utilities in source (text-sm,
 *                 text-[13px], font-sans …): the type-conformance sweep.
 *                 Non-blocking; printed as a report.
 *
 * Granularity is per source FILE — multi-export files (MenuItem) share meta.
 * Output: showcase/src/usage/docs-meta.json
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')

/* Same-file composition the import scan can't see. */
const AUGMENT = { Accordion: ['AccordionPanel'] }

function parseExports(indexPath) {
  const out = []
  if (!existsSync(indexPath)) return out
  const txt = readFileSync(indexPath, 'utf8')
  for (const m of txt.matchAll(/export \{ ([^}]*) \} from '(\.\/[^']+)'/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.replace(/default as /, '').trim()
      if (/^[A-Z]\w+$/.test(name)) out.push({ name, src: m[2] })
    }
  }
  return out
}

const TYPE_RE = /\bkol-(?:sans|mono|helper|prose)[a-z0-9-]*\b/g
const FREESTYLE_RE = /\btext-(?:xs|sm|base|lg|\d?xl)\b|\btext-\[\d+px\]|\bfont-(?:sans|serif)\b/g

function mineFile(absPath) {
  const txt = readFileSync(absPath, 'utf8')
  const typeClasses = [...new Set(txt.match(TYPE_RE) || [])].sort()
  const composes = new Set()
  for (const m of txt.matchAll(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+'(\.[^']+)'/g)) {
    if (m[3].endsWith('.css')) continue
    if (m[1]) for (const raw of m[1].split(',')) {
      const name = raw.split(/\bas\b/)[0].trim()
      if (/^[A-Z]/.test(name)) composes.add(name)
    }
    else if (m[2] && /^[A-Z]/.test(m[2])) composes.add(m[2])
  }
  if (/@kolkrabbi\/kol-loader/.test(txt) && /<Icon\b/.test(txt)) composes.add('Icon')
  const freestyle = [...new Set(txt.match(FREESTYLE_RE) || [])].sort()
  return { typeClasses, composes: [...composes], freestyle }
}

const meta = {}
const freestyleReport = []

const roots = [
  { index: join(REPO, 'packages/component/src/index.js'), base: join(REPO, 'packages/component/src') },
  { index: join(REPO, 'packages/framework/src/index.js'), base: join(REPO, 'packages/framework/src') },
]
for (const { index, base } of roots) {
  for (const { name, src } of parseExports(index)) {
    const abs = join(base, src)
    if (!existsSync(abs)) continue
    const m = mineFile(abs)
    if (AUGMENT[name]) m.composes = [...new Set([...m.composes, ...AUGMENT[name]])]
    meta[name] = { typeClasses: m.typeClasses, composes: m.composes }
    if (m.freestyle.length) freestyleReport.push(`${name}: ${m.freestyle.join(', ')}  (${src})`)
  }
}

const out = join(REPO, 'showcase/src/usage/docs-meta.json')
writeFileSync(out, JSON.stringify(meta, null, 2) + '\n')
console.log(`docs-meta: ${Object.keys(meta).length} components → ${out}`)

if (freestyleReport.length) {
  console.log(`\ntype-conformance sweep — ${freestyleReport.length} component(s) using freestyle Tailwind type utilities:`)
  for (const line of freestyleReport) console.log('  · ' + line)
} else {
  console.log('\ntype-conformance sweep: clean — no freestyle type utilities in component source')
}
