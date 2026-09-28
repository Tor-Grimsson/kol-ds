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
 *       packages/framework, packages/shell, packages/workshop or packages/design-editor (editor audit 2026-09-27). Wrap the control in `Tooltip label=…` and keep its
 *       `aria-label`.
 *
 *   T1b The same `title`, SPREAD: an object carrying a `title:` key that is spread onto an intrinsic
 *       element (`<button {...shared}>`). ThemeToggle shipped its native tip this way beside the DS
 *       one for months — T1 read `title=` attributes only, so the gate passed a blind spot
 *       (showcase refinement 2026-09-28).
 *
 *   T2  In packages/design-editor, packages/workshop and packages/framework (widened 2026-09-28), an
 *       icon-only control shows a `Tooltip` — an `IconFrame` is icon-only by definition (editor inspector rebuild,
 *       2026-09-27 — user: "wrong icons … but i cant say what they are called because missing
 *       tooltips"). Flags a `Button iconOnly`, or a `<button>` whose only content is glyphs, that no
 *       `<Tooltip>` encloses — and `data-kol-tip`, an attribute nothing reads. A `SegmentedToggle`
 *       cell is covered by the component itself (a glyph label shows its `ariaLabel`).
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
for (const pkg of ['component', 'framework', 'shell', 'workshop', 'design-editor']) {
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

/* T1b — a `title:` key in an object spread onto an intrinsic element */
function objectBody(src, open) {
  let depth = 0
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1)
  }
  return ''
}
for (const pkg of ['component', 'framework', 'shell', 'workshop', 'design-editor']) {
  for (const f of walk(join(ROOT, 'packages', pkg, 'src'))) {
    const src = readFileSync(f, 'utf8')
    const lines = src.split('\n')
    for (const m of src.matchAll(/\{\.\.\.(\w+)\}/g)) {
      const before = src.slice(0, m.index)
      const tag = [...before.matchAll(/<([A-Za-z][\w.]*)(?=[\s>/])/g)].at(-1)?.[1]
      if (!tag || !/^[a-z]/.test(tag) || EXEMPT_TAGS.has(tag)) continue
      const decl = new RegExp(`(?:const|let)\\s+${m[1]}\\s*=\\s*\\{`).exec(src)
      if (!decl) continue
      const body = objectBody(src, decl.index + decl[0].length - 1)
      if (!/(^|[\s,{])['"]?title['"]?\s*:/.test(body)) continue
      const line = before.split('\n').length
      if (/title-ok:/.test(lines[line - 1]) || /title-ok:/.test(lines[line - 2] ?? '')) continue
      errors.push(`${relative(ROOT, f)}:${line}  <${tag} {...${m[1]}}> spreads a \`title\` — the browser tooltip again (T1b)`)
    }
  }
}

/* T2 — the opening tag's end: the first `>` outside braces and quotes */
function tagEnd(src, i) {
  let depth = 0, q = null
  for (; i < src.length; i++) {
    const c = src[i]
    if (q) { if (c === q && src[i - 1] !== '\\') q = null; continue }
    if (c === '"' || c === "'" || c === '`') q = c
    else if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return i
  }
  return -1
}
const insideTooltip = (before) => before.lastIndexOf('<Tooltip') > before.lastIndexOf('</Tooltip>')
const tipOk = (lines, line) => /tip-ok:/.test(lines[line - 1]) || /tip-ok:/.test(lines[line - 2] ?? '')
for (const f of ['design-editor', 'workshop', 'framework'].flatMap((pkg) => walk(join(ROOT, 'packages', pkg, 'src')))) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  const at = (i) => src.slice(0, i).split('\n').length
  for (const m of src.matchAll(/data-kol-tip=/g)) {
    const line = at(m.index)
    if (!tipOk(lines, line)) errors.push(`${relative(ROOT, f)}:${line}  data-kol-tip draws nothing — wrap the control in \`Tooltip\` (T2)`)
  }
  for (const m of src.matchAll(/<(Button|button|IconFrame)(?=[\s>])/g)) {
    const end = tagEnd(src, m.index + 1)
    if (end < 0) continue
    const open = src.slice(m.index, end + 1)
    let mute = false
    if (m[1] === 'IconFrame') mute = /\sonClick=|\shref=/.test(open)
    else if (m[1] === 'Button') mute = /\siconOnly[=\s]/.test(open)
    else if (!open.endsWith('/>') && /aria-label=/.test(open)) {
      const close = src.indexOf('</button>', end)
      const body = close < 0 ? '' : src.slice(end + 1, close)
      /* glyphs only: nothing left once the elements and expressions are stripped, and at least one Icon */
      const bare = body.replace(/<[^>]*>/g, '').replace(/\{[^{}]*\}/g, '').trim()
      mute = /<Icon[\s>]/.test(body) && bare === '' && !/\{(children|label)\}/.test(body)
    }
    if (!mute || insideTooltip(src.slice(0, m.index))) continue
    const line = at(m.index)
    if (tipOk(lines, line)) continue
    errors.push(`${relative(ROOT, f)}:${line}  icon-only <${m[1]}> with no Tooltip (T2)`)
  }
}

if (errors.length) {
  console.error(`native-title: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log("native-title: clean (no native title on DS chrome, attribute or spread; every icon-only control in the editor, the workshop shell and the framework has a Tooltip)")
