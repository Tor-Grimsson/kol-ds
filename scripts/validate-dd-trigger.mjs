#!/usr/bin/env node
/**
 * validate-dd-trigger.mjs — the Dropdown trigger has REST AND OPEN, nothing else.
 *
 * THE LAW (2026-07-15, re-called 2026-08-09, 2026-08-28, and again 2026-08-30
 * after the user counted "50-100 times"): a `.kol-dd-trigger` gets no :hover,
 * no :active, no pressed state. Rest and open.
 *
 * WHY A GATE. The law was written twice in kol-components-molecules.css and
 * enforced by hand in kol-components-atoms.css, where all eight `.kol-btn-*`
 * variants carry `:not(.kol-dd-trigger)`. The tone rules in the OTHER file did
 * not — so the law held everywhere except `tone="sunken"`, which is the tone
 * the settings pages use. It was reported repeatedly and re-broken repeatedly,
 * including by the fix for a different sunken bug on 2026-08-30, because
 * whoever checked looked in the atoms sheet and the offending rule was in
 * molecules.
 *
 * A trigger carries `.kol-btn`. Any `.kol-btn…:hover` rule therefore matches it
 * unless it says otherwise. That is the trap, and hand-discipline has now lost
 * to it four times.
 *
 * THE RULE
 *   T1  no selector may put `.kol-btn` (or `.kol-dd-trigger`) into a :hover,
 *       :active or pressed state without excluding `.kol-dd-trigger`.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const THEME = join(ROOT, 'packages/theme')
const CHECK = process.argv.includes('--check')

const STATE = /:hover|:active|kol-btn-pressed/
const violations = []

for (const file of readdirSync(THEME).filter((f) => f.endsWith('.css'))) {
  const src = readFileSync(join(THEME, file), 'utf8')
  const noComments = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  noComments.split(/(?<=\})/).forEach((chunk) => {
    const sel = chunk.split('{')[0]
    if (!sel || !STATE.test(sel)) return
    for (const one of sel.split(',')) {
      const s = one.trim()
      if (!s || !STATE.test(s)) continue
      const touches = /\.kol-btn(?![\w-])/.test(s) || /\.kol-dd-trigger/.test(s)
      if (!touches) continue
      if (/:not\([^)]*\.kol-dd-trigger[^)]*\)/.test(s)) continue
      const line = noComments.slice(0, noComments.indexOf(one)).split('\n').length
      violations.push({ file: `packages/theme/${file}`, line, sel: s.replace(/\s+/g, ' ') })
    }
  })
}

console.log(`dd-trigger: ${violations.length} violation(s)${violations.length ? '' : ' — rest and open, nothing else'}\n`)
for (const v of violations) console.log(`  T1  ${v.file}:${v.line}\n      ${v.sel}\n      → add :not(.kol-dd-trigger)`)
if (CHECK && violations.length) process.exit(1)
