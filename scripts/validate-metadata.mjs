#!/usr/bin/env node
/**
 * validate-metadata.mjs — the frontmatter shape lock (pnpm validate:metadata).
 *
 * The law (user ruling 2026-08-01), in his words:
 *
 *     "in fronrtmatter Title is Foundations and 'token system' is a
 *      description."
 *     "this is uneccesary, there needs to be a limit, 6-8 words or whatever.
 *      meta data is not for babling wihtout limits."
 *
 * WHY IT EXISTS. Frontmatter renders — every field is a row in the reader's
 * metadata panel, in a fixed two-column box. Nobody was writing for that box:
 * 56 of 56 vault descriptions ran past 8 words (the worst was 82), and 36 of 56
 * titles carried an em-dash clause that was a description wearing the title's
 * row. `Foundations — the token system` printed one fact as two, and the
 * description beside it ran off the right edge of the panel.
 *
 * THE THREE RULES
 *
 *   M1  A title is a NAME. No ` — ` clause — the clause is the description.
 *   M2  A description is <= 8 words. Metadata is a label, not a paragraph.
 *   M3  Sentence case. A title and a description start with a capital.
 *   M4  `created` is present. The panel had only `updated`, so no doc had an
 *       age; backfilled from file birth time, the one honest source available.
 *
 * Same shape as validate-headings.mjs and for the same reason: the check is on
 * the SOURCE, not on the renderer. Truncating in the panel would have hidden
 * the babble and kept it, and the next doc would have copied it.
 *
 * SCOPE, STATED OUT LOUD. Hard-fails on the `docs/` vault. The component MDX
 * surface (showcase/src/docs/components/*.mdx) shares the contract but its
 * descriptions are MINED from package JSDoc by extract-descriptions.mjs — a
 * hand-rewrite there is overwritten on the next regen, so the fix is in the
 * package source. Those are COUNTED and printed, never silently skipped: a
 * gate that hides what it does not enforce reads as "covered" when it is not.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')
const MDX_DIR = join(REPO, 'showcase/src/docs/components')
const MAX_WORDS = 8

/* Lowercase by design, not by sloppiness — a brand spells its own name. */
const LOWERCASE_PROPER = /^(shadcn|npm|pnpm|gsap|opentype|embla|chess\.js|kol-|@kolkrabbi)/

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === '_files' || name === '_assets') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const unquote = (v) => v.trim().replace(/^["'](.*)["']$/, '$1').trim()
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length

const errors = []
let checked = 0

for (const file of walk(VAULT)) {
  const rel = relative(REPO, file)
  const src = readFileSync(file, 'utf8')
  const fm = src.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) continue
  checked++

  const title = (fm[1].match(/^title:\s*(.+)$/m) || [])[1]
  const desc = (fm[1].match(/^description:\s*(.+)$/m) || [])[1]

  if (title) {
    const t = unquote(title)
    /* An en/em dash with spaces around it is a clause. A hyphenated word
     * (`design-system`, `shadcn ⇄ KOL`) is not — hence the spacing. */
    if (/\s[—–]\s/.test(t)) {
      errors.push(`${rel}  M1 title carries a clause — the part after the dash is the description\n      title: ${t}`)
    }
    if (/^[a-z]/.test(t) && !LOWERCASE_PROPER.test(t)) {
      errors.push(`${rel}  M3 title is not sentence case\n      title: ${t}`)
    }
  }

  if (!/^created:\s*\d{4}-\d{2}-\d{2}\s*$/m.test(fm[1])) {
    errors.push(`${rel}  M4 no \`created:\` date — a doc with only \`updated\` has no age`)
  }

  if (desc) {
    const d = unquote(desc)
    const w = wordCount(d)
    if (w > MAX_WORDS) {
      errors.push(`${rel}  M2 description is ${w} words (max ${MAX_WORDS}) — it is a label, not a paragraph\n      ${d.slice(0, 90)}…`)
    }
    if (/^[a-z]/.test(d) && !LOWERCASE_PROPER.test(d)) {
      errors.push(`${rel}  M3 description is not sentence case\n      ${d.slice(0, 90)}`)
    }
  }
}

/* The counted, un-enforced surface — see SCOPE in the header. */
let mdxOver = 0
let mdxTotal = 0
if (existsSync(MDX_DIR)) {
  for (const name of readdirSync(MDX_DIR)) {
    if (!name.endsWith('.mdx')) continue
    mdxTotal++
    const d = readFileSync(join(MDX_DIR, name), 'utf8').match(/description:\s*"([^"]*)"/)
    if (d && wordCount(d[1]) > MAX_WORDS) mdxOver++
  }
}

if (errors.length) {
  console.error(`metadata: ${errors.length} violation(s) across ${checked} vault docs\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`metadata: clean (${checked} vault docs — titles are names, descriptions <= ${MAX_WORDS} words)`)
if (mdxOver) {
  console.log(`metadata: ${mdxOver} of ${mdxTotal} component MDX descriptions exceed ${MAX_WORDS} words — mined from package JSDoc, fix at the source (not enforced here)`)
}
