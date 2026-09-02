#!/usr/bin/env node
/**
 * validate-consumption.mjs — the showcase held to the DS's own law
 * (pnpm validate:consumption).
 *
 * `docs/documentation/00-overview/04-full-consumption.md` gives every consumer
 * six greps; a repo is on KOL when all six come back empty. Until 2026-09-02
 * nobody ran them on THIS repo's showcase, and it failed them: a hand-rolled
 * filter row on the Components catalog (the exact anatomy of the organism it
 * ships), a local SegGroup on the icons page, inline `var(--kol-oq-08)` where
 * `border-oq-08` exists, a raw `z-[1]`, Tailwind's `font-mono`. User:
 * "that's crazy — ds showcase breaks ds rules? we must fix that". Fixed, and
 * this gate keeps it fixed.
 *
 * SCOPE — the showcase's OWN pages and chrome: `src/pages`, `src/lib`,
 * `src/nav`. NOT `demos/`, `sets/`, `blocks/`, `usage/`: those exist to show
 * raw code and copy-paste sources, and the raw code is the point.
 *
 * Three of the six checks apply here (1 is package deps — the showcase renders
 * every pack; 3 is `:root` bindings — sanctioned; 4 is forks — the roster gate
 * already owns that):
 *
 *   C2  `var(--kol-*)` in JSX where a CLASS exists — colour, opacity and
 *       surface tokens (`--kol-fg-*`, `--kol-oq-*`, `--kol-surface-*`,
 *       `--kol-auto*`). The layout law's own idiom is exempt: `--kol-content-*`,
 *       `--kol-pad-*`, `--kol-radius-*`, `--kol-z-*`, `--kol-spacing-*`,
 *       `--kol-font-family-*` (no family class exists), gradients, and
 *       `--kol-palette-*` (data colours handed to chart props, not styling).
 *   C5  hand-rolled chrome: raw `z-[N]`, `rgba(0,0,0`, `bg-black/` scrims.
 *   C6  freestyle type: Tailwind `text-xs…2xl` / `text-[Npx]` / `font-sans|mono`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'showcase/src')
const SCOPE = ['pages', 'lib', 'nav'].map((d) => join(SRC, d))

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx|js)$/.test(f)) out.push(p)
  }
  return out
}

const EXEMPT_TOKEN = /var\(--kol-(content|pad|radius|z|spacing|font-family|palette|reveal|card-|dd-|shell-)/
/* comments carry no chrome — a line that is a comment, or the comment segments
 * inside a line (`{/* … *\/}` in JSX), are stripped before the checks run */
const stripComments = (line) => line.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
const errors = []
let files = 0
for (const dir of SCOPE) for (const file of walk(dir)) {
  files++
  const rel = relative(REPO, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((raw, i) => {
    const at = `${rel}:${i + 1}`
    if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(raw)) return
    const line = stripComments(raw)
    for (const m of line.matchAll(/var\(--kol-[a-z0-9-]+/g)) {
      if (EXEMPT_TOKEN.test(m[0])) continue
      if (/gradient\(/.test(line)) continue
      errors.push(`C2  ${at}  ${m[0]}) in JSX — a class exists for this token (bg-/text-/border- fg·oq·surface)`)
    }
    if (/\bz-\[\d+\]/.test(line)) errors.push(`C5  ${at}  raw z-[N] — the --kol-z-* ladder, or a later sibling`)
    if (/rgba\(0,\s*0,\s*0|bg-black\//.test(line)) errors.push(`C5  ${at}  a hand-rolled scrim — .kol-overlay-scrim`)
    if (/\btext-(xs|sm|base|lg|xl|2xl|\[\d+px\])\b|\bfont-(sans|serif|mono)\b/.test(line)) errors.push(`C6  ${at}  freestyle type — a kol-mono-* / kol-helper-* / kol-sans-* class`)
  })
}

if (errors.length) {
  console.error(`consumption: ${errors.length} violation(s) across ${files} showcase files\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`consumption: clean (${files} showcase files — pages · lib · nav — pass checks 2, 5 and 6)`)
