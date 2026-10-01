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
 *   M5  A phase-log entry's title fits its rail row: <= 3 words, <= 22 characters,
 *       no leading "The"; `+` `&` `/` join a pair and are not words (the H2 law's
 *       connectors). The Development rail clipped six of ten titles (user,
 *       2026-09-30: "we dont want clipping … make some title rule").
 *
 *   M6  A description is a SUMMARY, not a feature list (user, 2026-09-30: *"description is a
 *       SHORT summary of what is here IN FEW WORDS.. not an opportunity to list arrays"* — and his
 *       example, *"Search engine, custom built for wide use-cases"*). No `·` `;` `—` `–` `(`, and
 *       at most one comma.
 *
 * EVERY SURFACE, since the same day (the showcase review W5). M2 and M6 used to hold the vault
 * alone while package, home, component, set, block and card descriptions ran to paragraphs — 136
 * of them. Now: the vault, `showcase/src/homes/`, the component MDX `meta`, every package.json,
 * and the `meta` of every set, block and card. The component MDX descriptions are AUTHORED (the
 * frontmatter sync keeps an existing value), so they are fixed in the file.
 *
 * Same shape as validate-headings.mjs and for the same reason: the check is on
 * the SOURCE, not on the renderer. Truncating in the panel would have hidden
 * the babble and kept it, and the next doc would have copied it.
 *
 * SCOPE: the vault gets all six rules; every other surface gets M2 and M6 (below).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')
const MDX_DIR = join(REPO, 'showcase/src/docs/components')
const MAX_WORDS = 8
/* M6 — a list wears one of these, or two commas */
const isList = (d) => /[·;—–(]/.test(d) || (d.match(/,/g) || []).length >= 2

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
    if (rel.includes('operations/09-phase-log/') && !/\/INDEX\.md$/.test(rel)) {
      const words = t.split(/\s+/).filter((x) => !/^[+&/]$/.test(x)).length
      if (words > 3 || t.length > 22 || /^The\s/.test(t)) {
        errors.push(`${rel}  M5 phase-log title does not fit its rail row (<= 3 words, <= 22 chars, no leading "The")\n      title: ${t}`)
      }
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
    if (isList(d)) errors.push(`${rel}  M6 description is a list, not a summary\n      ${d.slice(0, 90)}`)
  }
}

/* EVERY OTHER SURFACE — M2 and M6 (W5, 2026-09-30) */
const described = []
const fmDescription = (src) => {
  const fm = src.match(/^---\n([\s\S]*?)\n---/)
  const d = fm && fm[1].match(/^description:\s*(.+)$/m)
  return d ? unquote(d[1]) : null
}
const objDescription = (src) => {
  const m = src.match(/description:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)\1/)
  return m ? m[2].replace(/\\(.)/g, '$1') : null
}
const listDir = (dir, ext) => (existsSync(join(REPO, dir)) ? readdirSync(join(REPO, dir)).filter((n) => n.endsWith(ext)).map((n) => `${dir}/${n}`) : [])
for (const rel of listDir('showcase/src/homes', '.md')) described.push([rel, fmDescription(readFileSync(join(REPO, rel), 'utf8'))])
for (const rel of listDir('showcase/src/docs/components', '.mdx')) described.push([rel, objDescription(readFileSync(join(REPO, rel), 'utf8'))])
for (const dir of ['sets', 'blocks', 'cards']) for (const rel of listDir(`showcase/src/${dir}`, '.jsx')) described.push([rel, objDescription(readFileSync(join(REPO, rel), 'utf8'))])
for (const d of readdirSync(join(REPO, 'packages'))) {
  const rel = `packages/${d}/package.json`
  if (existsSync(join(REPO, rel))) described.push([rel, JSON.parse(readFileSync(join(REPO, rel), 'utf8')).description ?? null])
}
/* the component descriptions generated from each component's own header comment (extract-descriptions)
 * — the first sentence after `Name —` is the summary, so it answers to the same two rules */
const GEN = join(REPO, 'showcase/src/usage/descriptions.json')
if (existsSync(GEN)) {
  for (const [name, v] of Object.entries(JSON.parse(readFileSync(GEN, 'utf8')))) {
    described.push([`${name} (its header comment's first sentence)`, typeof v === 'string' ? v : v?.description])
  }
}
for (const [rel, d] of described) {
  if (!d) continue
  const w = wordCount(d)
  if (w > MAX_WORDS) errors.push(`${rel}  M2 description is ${w} words (max ${MAX_WORDS})\n      ${d.slice(0, 90)}…`)
  if (isList(d)) errors.push(`${rel}  M6 description is a list, not a summary\n      ${d.slice(0, 90)}`)
}

if (errors.length) {
  console.error(`metadata: ${errors.length} violation(s) across ${checked} vault docs\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`metadata: clean (${checked} vault docs + ${described.length} other descriptions — names, and summaries of <= ${MAX_WORDS} words)`)
