#!/usr/bin/env node
/**
 * validate-headings.mjs — the H2 nav-label lock (pnpm validate:headings).
 *
 * The law is written at `.kol/docs-framework/01-conventions.md` → "H2 — the
 * navigable unit" (user ruling 2026-08-01):
 *
 *     "An H2 is a NAV LABEL, not a sentence. 1–2 words. No dates, no
 *      parentheticals, no sentences, no numbering."
 *
 * WHY IT EXISTS. Every `##` in a vault doc becomes a row in the reader's right
 * rail, in a rail-width column. Nobody was writing headings for that column, so
 * `The opacity scale (the signature)` and `Content-width tiers (2026-07-28)`
 * wrapped to three lines each and the rail stopped being scannable — which is
 * the only thing a table of contents is for. 165 of 255 H2s broke it on the day
 * the rule was written.
 *
 * The check is on the HEADING, deliberately, not on the rail's rendering.
 * Truncating in the component would have hidden the bad heading and kept it —
 * the document would still read as a stack of claims, and the next doc would
 * copy it. A rule that only the renderer knows is not a rule.
 *
 * H3 is NOT checked: it is body structure, not a nav row.
 *
 * `type: playbook` is SKIPPED WHOLESALE. The playbook archetype requires
 * numbered step sections (`## 0. Prerequisites` … `## N. Verification`), and a
 * step is an instruction, not a nav label — `## 2. Add a changeset` cannot be
 * two words and still be a step. Two archetypes, two rules; the gate must not
 * quietly demolish one to satisfy the other.
 *
 * Scope: the docs/ vault only. `.kol/` is agent state and does not render.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')
const MAX_WORDS = 2

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
let checked = 0

for (const file of walk(VAULT)) {
  const rel = relative(REPO, file)
  const src = readFileSync(file, 'utf8')
  /* Playbooks are exempt — see the header. Matched on the frontmatter field,
   * not the path, so moving a playbook cannot silently enrol it. */
  if (/^type:\s*playbook\s*$/m.test(src)) continue
  const lines = src.split('\n')
  let inFence = false

  for (const [i, line] of lines.entries()) {
    /* A `## ` inside a fenced block is sample content, not a heading — the
     * conventions doc itself quotes bad headings as examples. */
    if (/^\s*```/.test(line)) { inFence = !inFence; continue }
    if (inFence) continue

    const m = line.match(/^##\s+(.+?)\s*$/)
    if (!m) continue
    checked++

    const raw = m[1]
    /* Strip inline code ticks and emphasis before counting — `**Foo**` and
     * `` `foo` `` are one word, not decoration that inflates the count. */
    const text = raw.replace(/[`*_]/g, '').trim()
    const at = `${rel}:${i + 1}`

    if (/\(\d{4}-\d{2}-\d{2}\)|\b\d{4}-\d{2}-\d{2}\b/.test(text)) {
      errors.push(`${at}  date in an H2 — put it in the body or in \`updated:\`\n      ${text}`)
      continue
    }
    if (/\(.*\)/.test(text)) {
      errors.push(`${at}  parenthetical in an H2 — split it or move it to the body\n      ${text}`)
      continue
    }
    if (/^\d+[.)]\s/.test(text)) {
      errors.push(`${at}  numbered H2 — the order is the order\n      ${text}`)
      continue
    }
    if (/[.?!]$/.test(text) || /\s[—–]\s/.test(text)) {
      errors.push(`${at}  H2 written as a sentence — a nav label has no clause\n      ${text}`)
      continue
    }

    /* Connectors join a pair into one label — `Radius & shadows` is two
     * words, not three. They are punctuation wearing a space. */
    const words = text.split(/\s+/).filter((w) => w && !/^[&+/·]$/.test(w)).length
    if (words > MAX_WORDS) {
      errors.push(`${at}  H2 is ${words} words (max ${MAX_WORDS}) — it is a rail row, not a claim\n      ${text}`)
    }
  }
}

if (errors.length) {
  console.error(`headings: ${errors.length} violation(s) of ${checked} H2s\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`headings: clean (${checked} H2s, all nav labels)`)
