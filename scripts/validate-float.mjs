#!/usr/bin/env node
/**
 * validate-float.mjs — a float component reads the float spec, never a literal (pnpm validate:float).
 *
 * THE LAW: docs/documentation/04-compositions/25-float-spec.md (plan-2026-11-12-float-system W1.3). The spec names the
 * module widths, the label column, the chevron per control size and the label-beside-a-control row; each is a
 * `--kol-float-*` token in kol-theme or a component (LabeledControl). The user, 2026-11-12: *"WHAT CONTROLS THE WIDTH of
 * regular and compact??? where do the numbers come from??? 352 and 272??"* · *"why is input fixed width? 115, but only
 * sometimes?"* · *"SOME IDIOT tried to put label on the slider instead of using a fucking LABELEDCONTROL"*.
 *
 * SCOPE: every file that renders float chrome (`variant="float"`, a `kol-float-*` class, or the editor's float chrome)
 * in kol-component, kol-shell and kol-dashboards, plus design-editor's `float/`, `generate/` and the Labs float view.
 * Comments are blanked first, so a doc line that quotes a number is not a hit.
 *
 * THE RULES
 *   F1  module width   a 272 · 352 · 384 width literal — read `--kol-float-module-w` / `-wide`
 *   F2  label column   a float label (`kol-float-hint|label|panel`) with a `w-[Npx]`, or `labelWidth={N}` on a float
 *                      LabeledControl — read `--kol-float-label-w`
 *   F3  chevron        a chevron IconLoader in float context with a numeric `size`, or sized by the glyph token —
 *                      read `--kol-float-chev-{sm,md,lg}`
 *   F4  fixed input    an Input with a `w-[Npx]` width — an input fills its cell, a number box sizes in `ch`
 *   F5  own label      a float label span naming a control's label, followed by the control, outside LabeledControl;
 *                      or a float Slider given a `label` (Slider float is track and thumb only)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIRS = ['packages/component/src', 'packages/shell/src', 'packages/dashboards/src', 'packages/design-editor/src/editor/float', 'packages/design-editor/src/editor/generate']
const EXTRA = ['packages/design-editor/src/editor/labs/FloatLabs.jsx']
const FLOAT = /variant="float"|variant=\{float|kol-float-|useChrome\(\)|ChromeContext/

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.jsx?$/.test(e)) out.push(p)
  }
  return out
}
/* blank comments, keep newlines so line numbers hold; `://` is a URL, not a comment */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(?<!:)\/\/.*$/gm, '').replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, (m) => m.replace(/[^\n]/g, ' '))

const files = [...DIRS.flatMap((d) => walk(join(ROOT, d))), ...EXTRA.map((f) => join(ROOT, f))]
const hits = []
const lineOf = (src, i) => src.slice(0, i).split('\n').length
const add = (rule, file, src, i, what) => hits.push({ rule, at: `${relative(ROOT, file)}:${lineOf(src, i)}`, what })

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  if (!FLOAT.test(raw)) continue
  const src = strip(raw)
  let m
  /* F1: a line that sets a width (a `width` prop or key, a `W` constant, a `w-[…]` class) and carries one of the numbers */
  src.split('\n').forEach((line, i) => {
    if (!/\bwidth\b|\bW\s*=|\b(?:max-|min-)?w-\[/.test(line)) return
    for (const n of line.match(/(?<![\d.-])(?:272|352|384)(?![\d])/g) ?? []) hits.push({ rule: 'F1', at: `${relative(ROOT, file)}:${i + 1}`, what: n })
  })
  /* F2 */
  /* a label column is a float label with a fixed width that a control follows (a calendar's all-day column is not one) */
  const F2 = /className=["'`{][^"'`]*kol-float-(?:hint|label|panel)[^"'`]*\bw-\[\d+px\][^"'`]*(?=[\s\S]{0,300}?(?:<(?:Input|Dropdown|Slider|ToggleSwitch|TabsRow|SegmentedToggle)\b|\.render\(\)))/g
  while ((m = F2.exec(src))) add('F2', file, src, m.index, m[0].match(/w-\[\d+px\]/)[0])
  const F2b = /<(?:K)?LabeledControl\b[^>]*variant="float"[^>]*labelWidth=\{\d+\}|<(?:K)?LabeledControl\b[^>]*labelWidth=\{\d+\}[^>]*variant="float"/g
  while ((m = F2b.exec(src))) add('F2', file, src, m.index, m[0].match(/labelWidth=\{\d+\}/)[0])
  /* F3: only a chevron in float context — the file is the editor's float chrome, or the six lines above it (with any
   * UPPERCASE class constant they name expanded) carry the float look. A chevron in an app-look branch is not a hit. */
  const consts = Object.fromEntries([...src.matchAll(/const ([A-Z_]{3,}) = (['`])([\s\S]*?)\2/g)].map((c) => [c[1], c[3]]))
  const lines = src.split('\n')
  const wholeFloat = /editor[\\/](?:float|generate)[\\/]|Float[A-Z]?\w*\.jsx$/.test(file)
  const F3 = /<IconLoader\b[^>]*name=["'{][^>]*chevron[^>]*\bsize=\{\d+\}|<IconLoader\b[^>]*\bsize=\{\d+\}[^>]*name=["'{][^>]*chevron/g
  while ((m = F3.exec(src))) {
    const ln = lineOf(src, m.index)
    const ctx = lines.slice(Math.max(0, ln - 7), ln).join('\n').replace(/\b[A-Z_]{3,}\b/g, (k) => consts[k] ?? k)
    if (!wholeFloat && !/kol-float|variant="float"|\bfloat\b/.test(ctx)) continue
    add('F3', file, src, m.index, m[0].match(/size=\{\d+\}/)[0])
  }
  /* …or a chevron sized by the GLYPH token: an indicator is never a glyph (P1, the 18 caret) */
  const F3b = /<IconLoader\b[^>]*name=["'{][^>]*chevron[^>]*\bsize=\{[^}]*--kol-float-ic\b[^}]*\}/g
  while ((m = F3b.exec(src))) add('F3', file, src, m.index, 'var(--kol-float-ic)')
  /* F4 */
  const F4 = /<(?:K)?Input\b[^>]*className=[^>]*?\bw-\[\d+px\][^>]*/g
  while ((m = F4.exec(src))) add('F4', file, src, m.index, m[0].match(/w-\[\d+px\]/g).join(' '))
  /* F5 */
  const F5 = /<(?:K)?Slider\b(?=[^>]*variant="float")[^>]*\slabel=\{?[^\s>]/g
  while ((m = F5.exec(src))) add('F5', file, src, m.index, 'Slider float with a label')
  const F5b = /<span\b[^>]*className=["'`{][^>]*kol-float-(?:hint|label|panel)[^>]*>((?:(?!<\/span>)[\s\S]){0,200}?)<\/span>\s*\}?\s*(?:<[a-z]+[^>]*>\s*)?(?:<(?:Input|Dropdown|Slider|ToggleSwitch|TabsRow|SegmentedToggle)\b|\{\s*r\.render\(\))/g
  while ((m = F5b.exec(src))) {
    if (!/\{[^}]*\b(?:label|name)\b[^}]*\}/.test(m[1])) continue
    add('F5', file, src, m.index, 'a label beside a control, not LabeledControl')
  }
}

const by = (r) => hits.filter((h) => h.rule === r)
console.log(`float: ${hits.length} violation(s)${hits.length ? '' : ' — every float component reads the spec'}\n`)
const NAMES = { F1: 'module width literal', F2: 'label column literal', F3: 'chevron size literal', F4: 'fixed input width', F5: 'label drawn outside LabeledControl' }
for (const r of ['F1', 'F2', 'F3', 'F4', 'F5']) {
  const list = by(r)
  if (!list.length) continue
  console.log(`  ${r}  ${NAMES[r]} (${list.length})`)
  for (const h of list) console.log(`      ${h.at}  ${h.what}`)
}
if (hits.length) process.exit(1)
