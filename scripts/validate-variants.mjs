#!/usr/bin/env node
/**
 * validate-variants.mjs — a component is only ever given a variant it has (pnpm validate:variants).
 *
 * Why (editor audit 2026-09-27, finding #11 of the editor review): the design editor passed
 * `SegmentedToggle variant="ghost"` and `variant="primary"`. Neither exists, the component does not
 * complain, and both fell back to the default — the outlined strip — beside `filled` and `tonal`
 * strips on the same panel. The user saw five toggle looks and read it as inline styling.
 *
 *   V1  `<SegmentedToggle variant="…">` names a variant the component handles. The allowed set is
 *       READ from the component (`variant === '…'` branches, plus its default), so a new variant
 *       needs no edit here.
 *
 *   V2  `<Button variant="secondary">` — the inverted fill (the text colour as fill) — only where
 *       ALLOWED_INVERTED names the file with a reason. User, 2026-09-29: *"the inverted tone
 *       button, which I have said numerous times NOT to default, the default is fucking called
 *       primary"*. An unset variant inherits the wrapper's tone, else primary — that is the default.
 *
 * Button's allowed set is read from its `KNOWN` list (it has no `variant === '…'` branches).
 * Only literal values are checked; an expression (`variant={v}`) is the caller's to get right.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/* component → its source; add a row to cover another component */
const COMPONENTS = {
  SegmentedToggle: 'packages/component/src/atoms/SegmentedToggle.jsx',
  Button: 'packages/component/src/atoms/Button.jsx',
}

/* file → why the inverted Button is right there. A site hero's second CTA is the one case. */
const ALLOWED_INVERTED = {
  'showcase/src/blocks/hero-full-bleed.jsx': 'site hero — the second CTA of a pair',
  'showcase/src/blocks/feature-showcase.jsx': 'site hero — the second CTA of a pair',
  'showcase/src/sets/section-set.jsx': 'site section — the second CTA of a pair',
  'showcase/src/demos/FeatureSplit.jsx': 'site section — the second CTA of a pair',
  'showcase/src/demos/SectionSplit.jsx': 'site section — the second CTA of a pair',
}

function allowed(file) {
  const src = readFileSync(join(ROOT, file), 'utf8')
  const known = src.match(/const KNOWN = \[([^\]]*)\]/)
  if (known) return new Set([...known[1].matchAll(/'([\w-]+)'/g)].map((m) => m[1]).concat('control'))
  const set = new Set([...src.matchAll(/variant === '([\w-]+)'/g)].map((m) => m[1]))
  const def = src.match(/variant = '([\w-]+)'/)
  if (def) set.add(def[1])
  return set
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e === '_tmp' || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (e.endsWith('.jsx')) out.push(p)
  }
  return out
}

const files = [...walk(join(ROOT, 'packages')), ...walk(join(ROOT, 'apps')), ...walk(join(ROOT, 'showcase', 'src'))]
const errors = []
let seen = 0
for (const [name, file] of Object.entries(COMPONENTS)) {
  const ok = allowed(file)
  const tag = new RegExp(`<${name}\\b((?:[^>]|=>)*?)\\/?>`, 'gs')
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    for (const m of src.matchAll(tag)) {
      const v = m[1].match(/\bvariant="([\w-]+)"/)
      if (!v) continue
      seen++
      const line = src.slice(0, m.index).split('\n').length
      if (!ok.has(v[1])) {
        errors.push(`${relative(ROOT, f)}:${line}  <${name} variant="${v[1]}"> — not a variant (has: ${[...ok].join(' · ')}) (V1)`)
      } else if (name === 'Button' && v[1] === 'secondary' && !ALLOWED_INVERTED[relative(ROOT, f)]) {
        errors.push(`${relative(ROOT, f)}:${line}  <Button variant="secondary"> — the inverted fill; drop the variant (inherits the tone, else primary) or allowlist the file with a reason (V2)`)
      }
    }
  }
}

if (errors.length) {
  console.error(`variants: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`variants: clean (${seen} literal variants, all real)`)
