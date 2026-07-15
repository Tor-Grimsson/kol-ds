#!/usr/bin/env node
/**
 * validate-imports.mjs — the de-fork regression lock (pnpm validate:imports).
 *
 * 2026-07-15 audit P0-3: showcase/src/workshop/ was a vendored fork of two
 * published packages (dashboards byte-drifting, shell materially drifted),
 * shadowing the real deps while the Home banner claimed "rendered live from
 * the packages". The fork is deleted; this gate keeps it deleted:
 *
 *   1. no `showcase/src/workshop/` directory may exist (vendoring package
 *      code under any name there is the failure mode we saw), and
 *   2. no showcase source may import a relative path through a directory
 *      named after a published package (workshop/, dashboards/, shell/,
 *      vendor/) — KOL components come from `@kolkrabbi/*` specifiers only.
 *
 * Showcase-local fixtures/adapters live in src/data/ or demos/_fixtures/.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'showcase/src')
const FORBIDDEN = /from\s+'(\.[^']*\/(workshop|dashboards|shell|vendor)\/[^']*)'/

const errors = []

if (existsSync(join(SRC, 'workshop')))
  errors.push('showcase/src/workshop/ exists — vendored package code is banned (import @kolkrabbi/* instead)')

const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) walk(full)
    else if (/\.(jsx?|tsx?)$/.test(e.name)) {
      for (const [i, line] of readFileSync(full, 'utf8').split('\n').entries()) {
        const m = line.match(FORBIDDEN)
        if (m) errors.push(`${relative(REPO, full)}:${i + 1}  imports '${m[1]}' — use the @kolkrabbi/* package`)
      }
    }
  }
}
walk(SRC)

if (errors.length) {
  console.error(`imports: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('imports: clean (no vendored package paths)')
