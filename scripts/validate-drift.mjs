#!/usr/bin/env node
/**
 * validate-drift.mjs — the generated-vs-authored lock (pnpm validate:drift).
 *
 * Every doc surface in this repo has two layers: a generator that reads the
 * source, and a hand-authored layer on top. Where those disagree about a FACT,
 * the authored value has been winning silently — so a page could announce a
 * change in prose while its own table still printed the old value. That is
 * exactly what shipped: `ThemeToggle.mdx` documented "the default flipped at
 * 0.10.0" three lines above an `<Api>` row still claiming `fill: subtle`.
 *
 * `mergeApi` now prefers the generated value (component-page-parts.jsx), so the
 * PAGE is correct either way. This gate exists because a merge that silently
 * corrects a wrong value still leaves a wrong value in the file, where the next
 * reader believes it. Two checks:
 *
 *   D1  MDX `<Api rows>` def/type must not contradict api-tables.json
 *   D2  MDX `description` must not contradict descriptions.json
 *
 * Both compare only where the generator HAS a value — a hand-authored row for a
 * prop react-docgen cannot see (`children`, `iconLeft / iconRight`) is not
 * drift, it is the authored layer doing its job.
 *
 * The fix for a hit is to DELETE the authored value, not to retype it: the
 * documented contract (mdx-components.jsx) is that extraction-covered
 * components pass `name` alone and stay drift-free by construction.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const MDX_DIR = join(REPO, 'showcase/src/docs/components')

const readJson = (p) => {
  try { return JSON.parse(readFileSync(join(REPO, p), 'utf8')) } catch { return null }
}
const API = readJson('showcase/src/usage/api-tables.json')
const DESCRIPTIONS = readJson('showcase/src/usage/descriptions.json')

if (!API || !DESCRIPTIONS) {
  console.error('drift: missing generated input — run `pnpm extract:docs` first')
  process.exit(1)
}

/** normalise for comparison: quotes, whitespace and the em-dash placeholder */
const norm = (v) =>
  String(v ?? '').trim().replace(/^['"`]|['"`]$/g, '').replace(/\s+/g, ' ')
const isEmpty = (v) => !v || norm(v) === '' || norm(v) === '—'

/* Pull the `rows={[ … ]}` array out of an <Api …/> tag. The rows are JSON
 * object literals with double-quoted keys (that is how the generator wrote
 * them), so each `{...}` can be JSON.parsed on its own. */
function authoredRows(src) {
  const tag = src.match(/<Api\b[^>]*rows=\{(\[[\s\S]*?\])\}\s*\/>/)
  if (!tag) return []
  return [...tag[1].matchAll(/\{[^{}]*\}/g)].flatMap((m) => {
    try { return [JSON.parse(m[0])] } catch { return [] }
  })
}

function authoredDescription(src) {
  const m = src.match(/^\s{2}description:\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/m)
  return m ? m[2].replace(/\\(.)/g, '$1') : null
}

const errors = []

for (const file of readdirSync(MDX_DIR).filter((f) => f.endsWith('.mdx')).sort()) {
  const name = basename(file, '.mdx')
  const src = readFileSync(join(MDX_DIR, file), 'utf8')
  const rel = `showcase/src/docs/components/${file}`

  /* ── D1 · Api rows ── */
  const gen = new Map((API[name] ?? []).map((r) => [r.prop, r]))
  for (const row of authoredRows(src)) {
    const g = gen.get(row.prop)
    if (!g) continue // docgen can't see it — authored layer's job, not drift
    for (const field of ['def', 'type']) {
      if (isEmpty(row[field]) || isEmpty(g[field])) continue
      if (norm(row[field]) !== norm(g[field])) {
        errors.push(
          `${rel}  <Api> ${row.prop}.${field} = ${norm(row[field])} · source says ${norm(g[field])}` +
          `\n      → delete the authored value; extraction covers this prop`
        )
      }
    }
  }

  /* ── D2 · description ── */
  const authored = authoredDescription(src)
  const generated = typeof DESCRIPTIONS[name] === 'string'
    ? DESCRIPTIONS[name]
    : DESCRIPTIONS[name]?.description
  if (authored && generated && norm(authored) !== norm(generated)) {
    errors.push(
      `${rel}  description differs from the component's own header` +
      `\n      mdx:    ${norm(authored)}` +
      `\n      source: ${norm(generated)}`
    )
  }
}

if (errors.length) {
  console.error(`drift: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('drift: clean (authored facts agree with the source)')
