#!/usr/bin/env node
/**
 * validate-native-title.mjs — DS chrome shows the DS `Tooltip`, never the browser's (pnpm validate:native-title).
 *
 * The law (native-title-tooltips-in-ds-components, kol-client-olina 2026-09-22; widened 2026-09-26 —
 * user, on kol-shell's settings gear: "looks like every tooltip popover are browser generated?").
 * A native `title` draws the OS tooltip, after the OS delay, in the OS font, a few pixels from a
 * control that shows the DS one. The 0.217.0 sweep fixed the media pages' controls and stopped
 * there, so kol-shell's gear and rail kept theirs. A rule that has to be remembered is not a rule.
 *
 *   T1  No `title=` attribute on an intrinsic element (`<div>`, `<button>`, `<span>` …) or on a
 *       component that forwards it to the DOM (`Button`, `IconFrame`) inside packages/component,
 *       packages/framework or packages/shell. Wrap the control in `Tooltip label=…` and keep its
 *       `aria-label`.
 *
 * NOT a violation: a `title` PROP on a component that renders it as text (`PageHeader title`,
 * `SettingsPanel title`, …) — those are headings, not hints. `<iframe title>` is the frame's
 * accessible name and is required. A line may carry `title-ok: <reason>` for a genuine exception.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FORWARDS = new Set(['Button', 'IconFrame'])
const EXEMPT_TAGS = new Set(['iframe'])

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (e.endsWith('.jsx')) out.push(p)
  }
  return out
}

const errors = []
let seen = 0
for (const pkg of ['component', 'framework', 'shell']) {
  for (const f of walk(join(ROOT, 'packages', pkg, 'src'))) {
    const src = readFileSync(f, 'utf8')
    const lines = src.split('\n')
    for (const m of src.matchAll(/\stitle=[{"']/g)) {
      /* the tag this attribute sits on: the last `<Name` opened before it */
      const before = src.slice(0, m.index + 1)
      const tags = [...before.matchAll(/<([A-Za-z][\w.]*)(?=[\s>/])/g)]
      const tag = tags.at(-1)?.[1]
      if (!tag) continue
      const intrinsic = /^[a-z]/.test(tag)
      if (!(intrinsic || FORWARDS.has(tag)) || EXEMPT_TAGS.has(tag)) continue
      seen++
      const line = before.split('\n').length
      if (/title-ok:/.test(lines[line - 1]) || /title-ok:/.test(lines[line - 2] ?? '')) continue
      errors.push(`${relative(ROOT, f)}:${line}  <${tag} title=…> draws the browser tooltip — wrap it in \`Tooltip\` (T1)`)
    }
  }
}

if (errors.length) {
  console.error(`native-title: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log("native-title: clean (no native title on DS chrome)")
