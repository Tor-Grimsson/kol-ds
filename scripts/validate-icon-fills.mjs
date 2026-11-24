#!/usr/bin/env node
/**
 * validate-icon-fills.mjs — a line icon is drawn in live strokes, not fills (pnpm validate:icon-fills).
 *
 * The rule (18.6, 2026-11-20; docs/documentation/02-icons/02-loader.md § Rules): line icons are live 1.5 strokes on the
 * 24 grid; a solid source is redrawn or rejected, never scaled in and called fitted; a solid icon is a named solid cut.
 * This fails on any shape with a fill (its own, inherited, or SVG's default black when nothing says none) in an
 * interface or signal icon that is not a named solid cut: a `-solid` file.
 * Masks, clip paths and defs are not drawing and are skipped.
 *
 * scripts/icon-fills-baseline.json holds `allowed` (name → why the fill is deliberate) and `baseline` (the offenders
 * the set had when the check was written, 2026-11-20). Only a NEW offender fails; a baseline name that is clean now is
 * listed so it can come off. `--write-baseline` rewrites the baseline to today's offenders.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { drawings, filledShapes } from './icon-set.mjs'

const BASELINE = join(dirname(fileURLToPath(import.meta.url)), 'icon-fills-baseline.json')
const offenders = []
for (const d of drawings().values()) {
  if (d.set !== 'interface' && d.set !== 'editor' && d.set !== 'signal') continue
  if (d.name.endsWith('-solid')) continue
  const hits = filledShapes(d.svg)
  if (hits.length) offenders.push({ name: d.name, hits, file: d.path.split("/packages/")[1] })
}

let file = { allowed: {}, baseline: [] }
try { file = JSON.parse(readFileSync(BASELINE, 'utf8')) } catch { /* none yet */ }

if (process.argv.includes('--write-baseline')) {
  file.baseline = offenders.map((o) => o.name).filter((n) => !file.allowed[n]).sort()
  writeFileSync(BASELINE, JSON.stringify(file, null, 2) + '\n')
  console.log(`icon-fills: baseline written, ${file.baseline.length} icon(s) → scripts/icon-fills-baseline.json`)
  process.exit(0)
}

const known = new Set([...Object.keys(file.allowed), ...file.baseline])
const fresh = offenders.filter((o) => !known.has(o.name))
const cleared = file.baseline.filter((n) => !offenders.some((o) => o.name === n))
if (cleared.length) console.log(`icon-fills: ${cleared.length} baseline icon(s) now clean, take them off the baseline: ${cleared.join(', ')}`)
if (fresh.length) {
  console.error(`icon-fills: ${fresh.length} violation(s) — a line icon with a filled shape\n`)
  for (const o of fresh) console.error(`  packages/${o.file}  ${o.hits.length} filled ${[...new Set(o.hits)].join(', ')}`)
  console.error('\n  Redraw the filled parts as live 1.5 strokes on the 24 grid, or register the icon as a solid cut: name it')
  console.error('  `<name>-solid` (the plain name stays the line drawing; solid is its variant).')
  console.error('  A fill that is deliberate (a dot) goes in `allowed` in scripts/icon-fills-baseline.json with its reason.')
  process.exit(1)
}
console.log(`icon-fills: clean (${offenders.length} on the baseline or allowed, 0 new)`)
