#!/usr/bin/env node
/**
 * validate-no-middots.mjs — no `·` in kol-styleguide's shipped copy (pnpm validate:no-middots).
 *
 * The law (StyleguideNoMiddots, kol-website 2026-11-04 — the user: "NO FUCKING BULLETS IN TITLES").
 * A label's two parts take a comma, a value list takes spans with a gap. Comments are exempt.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'packages', 'styleguide', 'src')

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx?|mjs)$/.test(e)) out.push(p)
  }
  return out
}

/* blank comments out, keeping newlines so line numbers hold; `://` is a URL, not a comment */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(?<!:)\/\/.*$/gm, '')

const errors = []
for (const f of walk(SRC)) {
  strip(readFileSync(f, 'utf8')).split('\n').forEach((line, i) => {
    if (line.includes('·')) errors.push(`${relative(ROOT, f)}:${i + 1}`)
  })
}

if (errors.length) {
  console.error(`no-middots: ${errors.length} violation(s)\n${errors.join('\n')}`)
  process.exit(1)
}
console.log('no-middots: 0 violations')
