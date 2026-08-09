#!/usr/bin/env node
/**
 * validate-tags.mjs — tags have to discriminate (pnpm validate:tags).
 *
 * The law (user 2026-08-02): *"we need to make sure each page has the tags to
 * map out 'This page'"*. Tags are not decoration — they feed the rail's Tags
 * section and the node graph, and both are only useful if a tag PARTITIONS.
 *
 * WHAT WAS WRONG. The vault failed at both ends at once:
 *
 *   domain/design-system   72 of 78 docs   92%
 *   20 of 29 tags          exactly 1 doc
 *
 * A tag on 92% of the vault draws an edge between every pair of pages and tells
 * the reader nothing; a tag with one member connects nothing at all. Eighteen
 * docs carried a single tag, and for twelve of them that tag was the 92% one —
 * effectively untagged while passing any "has tags" check.
 *
 * `domain/design-system` was deleted rather than redistributed. It is the
 * vault's own name: every page in `docs/documentation/` is about the design
 * system, which is exactly why it said nothing.
 *
 * THE FOUR RULES
 *
 *   T1  Every doc carries at least 2 tags.
 *   T2  Every tag sits in the closed namespace set (docs-framework 03).
 *   T3  No `domain/` tag covers more than half the vault.
 *   T4  No tag has exactly one member.
 *
 * T3 is scoped to `domain/` on purpose. That axis exists to CLUSTER, so a
 * domain tag on most of the vault is the original defect returning. `audience/`
 * is a FILTER — there are two audiences and every page has one, so it is
 * supposed to cover about half. Holding it to T3 would ban a working axis.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')

/* The closed set — `.kol/docs-framework/03-tag-taxonomy.md`. A tag outside it
 * is not a new idea, it is a typo. Adding one means editing that doc first. */
const NAMESPACES = new Set([
  'project', 'domain', 'audience', 'provider', 'integration',
  'pattern', 'brand', 'editor', 'archive', 'framework',
])

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === '_files' || name === '_assets') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const errors = []
const counts = new Map()
const files = walk(VAULT)

for (const file of files) {
  const rel = relative(REPO, file)
  const fm = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  if (!fm) continue

  const block = fm[1].match(/^tags:\n((?:\s+-\s.+\n?)+)/m)
  const tags = block ? [...block[1].matchAll(/-\s*(\S+)/g)].map((m) => m[1]) : []

  if (tags.length < 2) {
    errors.push(`${rel}  ${tags.length} tag(s), needs 2 — one tag is a label, two is a position`)
  }
  for (const t of tags) {
    counts.set(t, (counts.get(t) ?? 0) + 1)
    if (!NAMESPACES.has(t.split('/')[0])) {
      errors.push(`${rel}  \`${t}\` is outside the closed namespace set — add the namespace to docs-framework 03 first, or use an existing one`)
    }
  }
}

const half = files.length / 2
for (const [tag, n] of counts) {
  if (tag.startsWith('domain/') && n > half) {
    errors.push(`\`${tag}\` covers ${n}/${files.length} docs — a domain tag on most of the vault clusters nothing. Split it into real subjects.`)
  }
  if (n === 1) {
    errors.push(`\`${tag}\` has exactly 1 doc — a tag with one member connects nothing. Fold it into a subject that has siblings, or give it one.`)
  }
}

if (errors.length) {
  console.error(`tags: ${errors.length} violation(s) across ${files.length} docs\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`tags: clean (${files.length} docs, ${counts.size} tags, every one shared and none over half)`)
