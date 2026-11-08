/* MARKDOWN VARIANTS — the one block → class map for both markdown renderers (plan-2026-11-08 W5.1): kol-framework's
 * `MarkdownPage` and kol-content's `PortableTextRenderer` read it, so one style draws the same blocks the same way in
 * both. Only the theme's existing classes; no styling here.
 *
 *   page     the outer inset (MarkdownPage)
 *   root     the blocks' container class
 *   proj     the numbered document's class (only the sheet draws the number gutter)
 *   sheet    the note numbers written as text (`.fnn`; a prose `ol` counts its own)
 *   maxWidth the article's measure
 *   chapters `site` has no article: PageHero, the Chapters and a PageSection per chapter, its blocks under `root` */
const MARKDOWN_VARIANTS = {
  research: { page: 'kol-page', root: 'kol-sheet', proj: 'proj', sheet: true, maxWidth: 980 },
  article: { page: 'kol-page', root: 'kol-prose', maxWidth: 980 },
  /* the brand guide's ground, the fg-02 wash SiteLayout's `pageWash` lays under brand pages — painted here so the page reads
   * without the frame, through `--kol-shell-page-wash` (what is left to paint): inside SiteLayout it is `transparent`, so
   * the plane's wash is the only one, never two translucent layers (2026-11-08) */
  site: { page: 'bg-[color:var(--kol-shell-page-wash,var(--kol-fg-02))]', root: 'kol-prose mt-12', chapters: { label: 'Overview', title: 'Chapters' } },
}

export default MARKDOWN_VARIANTS
