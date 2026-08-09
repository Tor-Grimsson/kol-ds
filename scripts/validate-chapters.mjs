#!/usr/bin/env node
/**
 * validate-chapters.mjs — three pages earns a folder (pnpm validate:chapters).
 *
 * The law (user ruling 2026-08-01): *"every folder should minimum have 3
 * documents, thats the minimum requirement for a folder ownership"* — and,
 * asked whether the index counts: *"no index does not"*.
 *
 * So: a chapter needs **3 markdown files BESIDE its `INDEX.md`** — and it needs
 * that `INDEX.md` (user ruling 2026-08-01: *"multiple folders are without
 * INDEX.md, its a rule, there needs to be one, and its always the first page,
 * obviously its a toc"*). Five chapters had none, including three of the
 * largest: a reader arriving at a folder of ten files got no door and no
 * ordering, and the rail had nothing to point its category row at.
 *
 * WHY IT EXISTS. Seven of thirteen chapters were short, and three of them
 * — `01-release`, `02-workbench`, `05-brand` — contained nothing at all except
 * their own index. A folder holding one file is not a chapter; it is a document
 * that grew a directory, and the rail renders it as a group of one whose label
 * repeats its parent's. The vault's whole grammar is category → chapter → page,
 * and a chapter with no pages breaks the middle rung while looking correct in
 * every listing.
 *
 * It also cuts the other way: a folder that cannot reach three pages is telling
 * you its subject belongs inside a sibling. That is a real answer, not a
 * failure — fold it rather than padding it.
 *
 * Scope: `docs/<category>/<chapter>/`. A category root is not a chapter, and
 * `.kol/` is agent state that does not render.
 */
import { readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const VAULT = join(REPO, 'docs')
const MIN = 3

const mdUnder = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === '_files' || name === '_assets') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) mdUnder(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const errors = []
let checked = 0

for (const category of readdirSync(VAULT)) {
  const catPath = join(VAULT, category)
  if (category.startsWith('.') || !statSync(catPath).isDirectory()) continue

  for (const chapter of readdirSync(catPath)) {
    const chPath = join(catPath, chapter)
    if (chapter.startsWith('.') || !statSync(chPath).isDirectory()) continue
    checked++

    const rel = relative(REPO, chPath)

    /* EVERY folder carries an index — it is the chapter's first page and its
     * table of contents. Checked at this level AND on nested subfolders, since
     * a subfolder a reader can open is a folder a reader can arrive at. */
    if (!readdirSync(chPath).some((f) => /^index\.md$/i.test(f))) {
      errors.push(`${rel}  no INDEX.md — every folder needs one; it is the first page and the chapter's contents`)
    }
    for (const sub of readdirSync(chPath)) {
      const subPath = join(chPath, sub)
      if (sub.startsWith('.') || sub.startsWith('_') || !statSync(subPath).isDirectory()) continue
      if (!readdirSync(subPath).some((f) => /^index\.md$/i.test(f))) {
        errors.push(`${relative(REPO, subPath)}  no INDEX.md — a subfolder a reader can open is a folder a reader can arrive at`)
      }
    }

    /* A chapter's own subfolders fold into it — the taxonomy has three levels,
     * so a nested folder is an authoring convenience, not a fourth rung. */
    const pages = mdUnder(chPath).filter((f) => !/\/index\.md$/i.test(f))

    /* NO ROW REPEATS ITS OWN CHAPTER (2026-08-02). `08-breakpoints/01-breakpoints`
     * rendered as `Breakpoints › Breakpoints`, and the index row rendered as
     * `Overview › Overview` inside `00-overview` — a row named after its parent
     * says nothing and reads as a mistake. The rail derives both labels from the
     * filename, so the collision is checkable here rather than noticed in a
     * screenshot. `About` is the index row's label precisely because no chapter
     * can be called that. */
    const railLabel = (name) => {
      const w = name.replace(/^\d+-/, '').replace(/\.md$/i, '').replace(/-/g, ' ')
      return w.charAt(0).toUpperCase() + w.slice(1)
    }
    const chapterLabel = railLabel(chapter)
    for (const f of pages) {
      if (railLabel(f.split('/').pop()) === chapterLabel) {
        errors.push(`${relative(REPO, f)}  renders as \`${chapterLabel} › ${chapterLabel}\` — a row must not repeat its chapter's name. Rename the file for what the page IS.`)
      }
    }
    if (pages.length < MIN) {
      errors.push(
        `${rel}  ${pages.length} page(s) beside INDEX, needs ${MIN} — a folder holding fewer is a document that grew a directory. Split it if it has three subjects; fold it into a sibling if it does not.`
      )
    }
  }
}

if (errors.length) {
  console.error(`chapters: ${errors.length} violation(s) across ${checked} chapters\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`chapters: clean (${checked} chapters, every one has an INDEX and ${MIN}+ pages beside it)`)
