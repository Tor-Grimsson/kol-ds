#!/usr/bin/env node
/**
 * validate-placements — every page sits under a frame (LayoutsAndWebsiteLayout, 2026-10-28).
 *
 * A page is a roster organism whose Function is `structure`, plus anything placements.js places. Fails when a page is under
 * no frame and has no NOT_A_PAGE reason, when a placed or exempted name is not a live export, and when `evidence` names a
 * page its frame does not list. Also checks each frame's doc carries the same page table (`--write` rewrites them).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { parseBarrelExports } from './lib/parse-barrel.mjs'
import { writeFileSync } from 'node:fs'
import { pagesTable } from './lib/placements-doc.mjs'
import { fileURLToPath } from 'node:url'
import { TIERS, FUNCTIONS_BY_NAME } from '../showcase/src/nav/classification.js'
import { FRAMES, NOT_A_PAGE, PAGE_INFO } from '../showcase/src/nav/placements.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')

/* the live exports: every name a package's barrels export — the roster gate's own reading (parse-barrel) */
const live = new Set()
for (const dir of readdirSync(join(REPO, 'packages'))) {
  const src = join(REPO, 'packages', dir, 'src')
  if (!existsSync(join(src, 'index.js'))) continue
  const files = {}
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name)
      if (e.isDirectory() && e.name !== 'node_modules') walk(full)
      else if (e.name === 'index.js') files[relative(src, full)] = readFileSync(full, 'utf8')
    }
  }
  walk(src)
  for (const { name } of parseBarrelExports(files)) live.add(name)
}

const errors = []
const placed = new Map()
for (const f of FRAMES) {
  for (const p of f.pages) {
    if (!live.has(p)) errors.push(`ROT          ${f.name.padEnd(14)} ${p}  (placed, but no package exports it)`)
    placed.set(p, [...(placed.get(p) ?? []), f.name])
  }
  for (const e of f.evidence ?? [])
    if (!f.pages.includes(e)) errors.push(`EVIDENCE     ${f.name.padEnd(14)} ${e}  (evidence for a page the frame does not list)`)
}
for (const n of Object.keys(NOT_A_PAGE)) {
  if (!live.has(n)) errors.push(`ROT          NOT_A_PAGE     ${n}  (exempted, but no package exports it)`)
  if (placed.has(n)) errors.push(`BOTH         NOT_A_PAGE     ${n}  (exempted AND placed — pick one)`)
}
const pages = Object.keys(TIERS).filter((n) => TIERS[n] === 'organisms' && FUNCTIONS_BY_NAME[n] === 'structure')
for (const n of pages)
  if (!placed.has(n) && !NOT_A_PAGE[n]) errors.push(`UNPLACED     ${n}  (a page under no frame — add it to a frame in showcase/src/nav/placements.js, or a NOT_A_PAGE reason)`)

/* every placed page says what it is (apps/layouts shows it) */
for (const p of placed.keys()) if (!PAGE_INFO[p]?.purpose) errors.push(`NO INFO      ${p}  (add its package, purpose and where it runs to PAGE_INFO)`)

/* the docs list the same pages: each frame's doc carries its table between the placement marks */
const DOCS = join(REPO, 'docs', 'documentation', '04-compositions')
const block = (id) => new RegExp(`<!-- placements: ${id} -->[\\s\\S]*?<!-- /placements: ${id} -->|<!-- placements: ${id} -->`)
for (const f of FRAMES) {
  const file = join(DOCS, `${f.doc}.md`)
  if (!existsSync(file)) { errors.push(`DOC          ${f.name.padEnd(14)} ${f.doc}.md  (missing)`); continue }
  const text = readFileSync(file, 'utf8')
  const want = pagesTable(f)
  if (!block(f.id).test(text)) { errors.push(`DOC          ${f.name.padEnd(14)} ${f.doc}.md  (no "<!-- placements: ${f.id} -->" mark under a "## Pages" heading)`); continue }
  const now = text.replace(block(f.id), want)
  if (now !== text) {
    if (process.argv.includes('--write')) writeFileSync(file, now)
    else errors.push(`DOC          ${f.name.padEnd(14)} ${f.doc}.md  (its page table differs from placements.js — run with --write)`)
  }
}

if (errors.length) {
  console.error(errors.map((e) => `  ${e}`).join('\n'))
  console.error(`placements: ${errors.length} violation(s)`)
  process.exit(1)
}
console.log(`placements: clean (${pages.length} pages by classification, ${placed.size} placed across ${FRAMES.length} frames)`)
