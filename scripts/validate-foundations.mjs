#!/usr/bin/env node
/**
 * validate-foundations.mjs — the token-truth lock (pnpm validate:foundations).
 *
 * 2026-07-15 audit P1-4: the Foundations pages claimed "resolves live from the
 * theme CSS" while surface/state hex and mono/helper px values were hand-copied
 * literals in showcase/src/data/*.js — matching the CSS only until someone
 * edits a token. Those cells now read the loaded CSS (resolveTokenThemed /
 * measureClass); this gate keeps copied values out:
 *
 *   - data/color.js       may not contain hex color literals
 *   - data/typography.js  may not contain size:/lh: px literals, and the
 *                         single-class sans/mono/helper rows may not carry
 *                         weight: literals (prose descendant-selector rows are
 *                         exempt — a class probe can't measure '.kol-prose h1')
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []

const color = readFileSync(join(REPO, 'showcase/src/data/color.js'), 'utf8')
for (const [i, line] of color.split('\n').entries()) {
  if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !line.trim().startsWith('*') && !line.trim().startsWith('//'))
    errors.push(`data/color.js:${i + 1}  hex literal — cells must resolve live (ThemedHex/LiveHex)`)
}

const typo = readFileSync(join(REPO, 'showcase/src/data/typography.js'), 'utf8')
const proseBlock = typo.slice(typo.indexOf('const proseRows'), typo.indexOf(']', typo.indexOf('const proseRows')))
for (const [i, line] of typo.split('\n').entries()) {
  if (line.trim().startsWith('*') || line.trim().startsWith('//')) continue
  if (/\b(size|lh):\s*[\d']/.test(line))
    errors.push(`data/typography.js:${i + 1}  size/lh literal — cells must measure live (LiveClassValue)`)
  else if (/\bweight:\s*\d/.test(line) && !proseBlock.includes(line))
    errors.push(`data/typography.js:${i + 1}  weight literal on a single-class row — measure it (LiveClassValue)`)
}

if (errors.length) {
  console.error(`foundations: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('foundations: clean (no copied token values)')
