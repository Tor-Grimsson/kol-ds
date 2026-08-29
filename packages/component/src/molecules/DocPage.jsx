import DocFrontmatter from './DocFrontmatter.jsx'

/* taxonomy-ok: molecule — nests DocFrontmatter (relative). */

/**
 * DocPage — ONE plate for every document (DocPageAndKindShowcase, kol-r2b2
 * 2026-08-27, user ruling): markdown · text · code · JSON · YAML render on the
 * same page. Where it sits decides its presentation, in kol-theme (≥0.75.0):
 *
 *   in `.kol-overlay`                 an A-series page — 85vh tall, 85vh / √2 wide,
 *                                     `max-width: calc(100vw − 10rem)` (the arrow gutter),
 *                                     `fg-04`, radius sm, padding 24, scrolls inside
 *   in `.kol-column-browser-preview`  the same document zoomed 0.5 on the frame, padding 24
 *
 * The code block INSIDE the page is transparent, borderless and full width, so
 * YAML scales like JSON; prose is bounded by the page, not by its own measure.
 * `KindPreview` reaches for this for every document kind, so consumers pass
 * nothing; `frontmatter` (markdown only) renders `DocFrontmatter` above the body.
 *
 * @param {Object}    frontmatter  parsed frontmatter, or null
 * @param {ReactNode} children     the prose or the code block
 */
export default function DocPage({ frontmatter, className = '', children }) {
  return (
    <div className={`kol-doc-page ${className}`.trim()}>
      {frontmatter && <DocFrontmatter metadata={frontmatter} />}
      {children}
    </div>
  )
}
