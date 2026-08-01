/**
 * chapter-pages.js — THE editorial map: pages that belong to a vault chapter
 * but are not markdown files inside it.
 *
 * The 2026-07-31 ruling: **a page is a slot.** A chapter is not "markdown" or
 * "React" — it holds pages, and each page declares how it renders. Foundations
 * is chapter 01 of Documentation; its five authored docs are pages, and the
 * three live React pages that read values straight off the installed theme are
 * ALSO pages in that chapter. Neither copy is demoted and nothing merges.
 *
 * Plain data, zero imports — so `scripts/extract-manifest.mjs` (Node) and
 * `vault.js` (Vite) read the SAME file. A second copy of this map in the
 * generator was the obvious shortcut and would have drifted the first time a
 * route moved; see docs/operations/04-content-pipeline/02-taxonomy.md.
 *
 * Keyed by chapter folder name under its category root.
 */
/* EMPTY BY USER RULING 2026-08-01. App routes are not vault content. Mixing
 * live React pages into a chapter made the Documentation tree stop matching
 * `docs/documentation/` on disk — eight rows under a folder holding five files
 * — which is unreadable when the whole point of the tree is to mirror the
 * vault. The tree shows markdown, nothing else.
 *
 * The routes still exist, still render and still answer search; they are simply
 * not listed as chapter content. Where they belong is a separate decision.
 *
 * The map and `chapterOfPath` stay so re-admitting a page is one line. */
export const CHAPTER_PAGES = {}

/* The chapter a slot-page lives in, by route — so a surface can ask which
 * chapter claims it without the caller re-scanning the map. */
export const chapterOfPath = (path) => {
  for (const [chapter, pages] of Object.entries(CHAPTER_PAGES)) {
    if (pages.some((p) => p.path === path)) return chapter
  }
  return null
}
