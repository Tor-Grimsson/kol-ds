#!/usr/bin/env node
/**
 * extract-api — generates the component API tables from SOURCE via
 * react-docgen, killing the last hand-authored drift surface
 * (component-docs.js api arrays were maintained by hand).
 *
 * Emits showcase/src/usage/api-tables.json:
 *   { ComponentName: [ { prop, type, def, desc } ] }
 *
 * The showcase merges these with DOC_DATA's authored rows — authored
 * descriptions win (docgen only sees per-prop JSDoc, which most KOL
 * components don't carry), generated rows win on existence + defaults.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, builtinResolvers } from 'react-docgen'

const resolver = new builtinResolvers.FindAllDefinitionsResolver()

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')

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

const typeOf = (p) =>
  p.tsType?.raw ?? p.tsType?.name ?? p.flowType?.name ?? p.type?.name ?? '—'

const tables = {}
/* Provenance (2026-07-30 user ruling): every component page must print WHERE
 * its source lives — "a component without an origin is a puzzle piece in a
 * pile". name → repo-relative source path, emitted beside the api tables. */
const sources = {}
let filesParsed = 0, failed = []

/* Every UI package is scanned, not just component + framework (2026-07-30).
 * The two-root list silently starved the showcase's <Api> of every component
 * that lives elsewhere — Icon (kol-icons), HlsVideo/PriceDisplay (kol-store),
 * TypeSample/TypeSpecCard (kol-foundry) rendered an empty props table. Roots
 * are discovered so a new package is covered the day it lands; the clients
 * tier is plain ESM with no React to parse (ARCHITECTURE §3). */
const NON_UI = new Set(['media-client', 'scrape', 'theme'])
const roots = readdirSync(join(REPO, 'packages'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !NON_UI.has(d.name))
  .map((d) => ({
    pkg: d.name,
    index: join(REPO, 'packages', d.name, 'src/index.js'),
    base: join(REPO, 'packages', d.name, 'src'),
  }))
  .filter((r) => existsSync(r.index))
for (const { index, base } of roots) {
  const byFile = new Map()
  for (const e of parseExports(index)) {
    if (!byFile.has(e.src)) byFile.set(e.src, [])
    byFile.get(e.src).push(e.name)
  }
  for (const [src, names] of byFile) {
    const abs = join(base, src)
    if (!existsSync(abs)) continue
    for (const n of names) sources[n] ??= abs.replace(`${REPO}/`, '')
    let docs
    try {
      docs = parse(readFileSync(abs, 'utf8'), { filename: abs, resolver })
      filesParsed++
    } catch (err) {
      failed.push(`${src}: ${err.message.split('\n')[0]}`)
      continue
    }
    for (const doc of docs) {
      /* Match the doc to its export: displayName when present, else the
       * single-export file's name. Multi-export files without displayNames
       * fall back to positional pairing. */
      const name =
        names.includes(doc.displayName) ? doc.displayName
        : names.length === 1 ? names[0]
        : names[docs.indexOf(doc)] ?? null
      if (!name || !doc.props) continue
      tables[name] = Object.entries(doc.props).map(([prop, p]) => ({
        prop,
        type: typeOf(p),
        def: p.defaultValue?.value ?? '—',
        desc: (p.description || '').trim(),
      }))
    }
  }
}

const out = join(REPO, 'showcase/src/usage/api-tables.json')
writeFileSync(out, JSON.stringify(tables, null, 2) + '\n')
const srcOut = join(REPO, 'showcase/src/usage/component-sources.json')
writeFileSync(srcOut, JSON.stringify(sources, null, 2) + '\n')
console.log(`api-tables: ${Object.keys(tables).length} components from ${filesParsed} files → ${out}`)
console.log(`sources: ${Object.keys(sources).length} components → ${srcOut}`)
if (failed.length) {
  console.log(`\nunparsable (${failed.length}):`)
  for (const f of failed) console.log('  · ' + f)
}
