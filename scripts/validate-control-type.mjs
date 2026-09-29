#!/usr/bin/env node
/**
 * validate-control-type.mjs — a control's text size comes from its `size`, never from a class (pnpm validate:control-type).
 *
 * Why (apps review 2026-09-29): every control pairs its height with its type — `size="sm"` is a
 * 26px box AND `kol-mono-12` (01-foundations/09-sizes.md). A type class passed in `className`
 * (`kol-mono-*`, `kol-helper-*`, `text-sm`, `font-*`, `leading-*`) fights the size's own class
 * at equal specificity, so which one wins is load order (ARCHITECTURE §5) — the text no longer
 * matches the box, and the control beside it. The user: *"why do buttons and dropdown or other
 * similar controls use different sizes"*. Want smaller text → pick the smaller `size`.
 *
 *   C1  a DS control (`<Button>` `<Dropdown>` `<Input>` `<SearchInput>` `<Textarea>`
 *       `<SegmentedToggle>` `<IconToggle>` `<ViewToggle>`) given a type class in a literal className.
 *
 * Only literal classNames are read; an expression is the caller's to get right.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTROLS = ['Button', 'Dropdown', 'Input', 'SearchInput', 'Textarea', 'SegmentedToggle', 'IconToggle', 'ViewToggle']
const TYPE = /(?:^|\s)(text-(?:xs|sm|base|lg|[0-9]?xl|\[[^\]\s]+\])|font-(?:thin|light|normal|medium|semibold|bold|mono|sans)|leading-\S+|kol-(?:mono|helper|sans)-[\w-]+)(?=\s|$)/

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
const tag = new RegExp(`<(${CONTROLS.join('|')})\\b((?:[^>]|=>)*?)\\/?>`, 'gs')
const errors = []
let seen = 0
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(tag)) {
    seen++
    const cls = m[2].match(/\bclassName=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/)
    const literal = cls && (cls[1] ?? cls[2] ?? cls[3])
    const hit = literal && literal.match(TYPE)
    if (!hit) continue
    const line = src.slice(0, m.index).split('\n').length
    errors.push(`${relative(ROOT, f)}:${line}  <${m[1]} className="…${hit[1]}…"> — type comes from \`size\`; drop the class or change the size (C1)`)
  }
}

if (errors.length) {
  console.error(`control-type: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`control-type: clean (${seen} controls, type from size)`)
