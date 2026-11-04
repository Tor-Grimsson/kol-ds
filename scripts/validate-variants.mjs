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
 *       THE FLOAT LAW (float-operational W3, 2026-11-04 — 24-float-system.md § Roles): on a float control the
 *       primary role IS `tone="inverted"`, so `<Button variant="float" tone="inverted">` is legal by the rule, not by
 *       file. Only the literal pair counts; `variant={x ? 'float' : …}` is still the caller's to allowlist.
 *
 *   V3  `<Button variant>` is never one of the six tone-duplicates (primary · secondary · outline ·
 *       ghost · grey · control) — deprecated 2026-10-01; the ground is `tone`.
 *
 * Button's allowed set is read from its `KNOWN` list plus its early-return `variant === '…'` branches (`bare`).
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
  'packages/styleguide/src/LayoutType.jsx': 'the article board\'s callout button, carried class for class from kol-atlas apps/lab (the Figma Article reference draws it inverted, full radius) — LayoutGroup 2026-10-31',
  'packages/component/src/molecules/Modal.jsx': 'the dialog OK — primary is the dark ground since tone-is-the-ground-axis, so OK drew the same as Cancel',
  'apps/catalog/src/App.jsx': 'the floating Variants button — Round 16 drew it inverted over the page',
  'packages/shell/src/HubHome.jsx': 'the masthead\'s round button — the catalog\'s Variants button, inverted over the page (user 2026-10-23: "a component like apps/catalog")',
  'showcase/src/blocks/feature-showcase.jsx': 'site hero — the second CTA of a pair',
  'showcase/src/cards/split-image-right.jsx': 'site section — the second CTA of a pair',
  'showcase/src/cards/split-image-left.jsx': 'site section — the second CTA of a pair',
  'showcase/src/cards/split-centered.jsx': 'site section — the second CTA of a pair',
  'showcase/src/cards/split-image-top.jsx': 'site section — the second CTA of a pair',
  'showcase/src/sets/section-set.jsx': 'site section — the second CTA of a pair',
  'showcase/src/previews/FeatureSplit.jsx': 'site section — the second CTA of a pair',
  'showcase/src/previews/SectionSplit.jsx': 'site section — the second CTA of a pair',
  'packages/component/src/molecules/PanelsMenu.jsx': 'the row\'s primary action (Show) is the float primary role, inverted (float-everything W4 row 57, 2026-11-04)',
}

/* V3 (2026-10-01): the six Button variants that were tones under a second name — deprecated
 * aliases, so nothing in this repo passes them any more */
const TONE_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'grey', 'control']

function allowed(file) {
  const src = readFileSync(join(ROOT, file), 'utf8')
  const known = src.match(/const KNOWN = \[([^\]]*)\]/)
  /* KNOWN plus any early-return branch (`variant === 'bare'` returns before KNOWN is read) */
  const set = new Set([...src.matchAll(/variant === '([\w-]+)'/g)].map((m) => m[1]))
  if (known) return new Set([...known[1].matchAll(/'([\w-]+)'/g)].map((m) => m[1]).concat('control', ...set))
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

/* the float law: a float control's primary is the inverted tone (V2 exempt) */
const floatPrimary = (attrs) => /\bvariant="float"/.test(attrs)

/* SELF-CHECK (W3 acceptance): the rule passes a float primary and still fails a non-float inverted — runs every time */
const V2 = (attrs) => /\btone="inverted"/.test(attrs) && !floatPrimary(attrs)
if (V2(' variant="float" tone="inverted" size="md"') || !V2(' tone="inverted" size="sm"') || !V2(' variant="accent" tone="inverted"')) {
  console.error('variants: self-check failed — the float-law exemption is wrong'); process.exit(1)
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
      /* V2 follows the ground to where it lives now: `tone="inverted"` is the same fill */
      if (name === 'Button' && V2(m[1]) && !ALLOWED_INVERTED[relative(ROOT, f)]) {
        errors.push(`${relative(ROOT, f)}:${src.slice(0, m.index).split('\n').length}  <Button tone="inverted"> — the inverted fill; drop it (inherits the tone, else primary) or allowlist the file with a reason (V2)`)
      }
      const v = m[1].match(/\bvariant="([\w-]+)"/)
      if (!v) continue
      seen++
      const line = src.slice(0, m.index).split('\n').length
      if (!ok.has(v[1])) {
        errors.push(`${relative(ROOT, f)}:${line}  <${name} variant="${v[1]}"> — not a variant (has: ${[...ok].join(' · ')}) (V1)`)
      } else if (name === 'Button' && TONE_VARIANTS.includes(v[1])) {
        errors.push(`${relative(ROOT, f)}:${line}  <Button variant="${v[1]}"> — a deprecated alias of a tone; pass tone="${v[1] === 'secondary' ? 'inverted' : v[1] === 'control' ? 'ghost' : v[1]}" (V3)`)
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
