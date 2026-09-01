// @kolkrabbi/kol-content — the CMS content system: /stack (blog editorial) +
// /work (portfolio). Two Sanity content streams sharing one home. Data is
// consumer-injected (portable text / project docs). The shared primitives
// (ContentFilters, DropdownTagFilter, ShellSearchOverlay, GalleryCarousel,
// Avatar, Tag) stay in @kolkrabbi/kol-component — this package depends on them.
// CSS ships in @kolkrabbi/kol-theme (.kol-prose + component sheets).

// ── Stack (blog / editorial) ──────────────────────────────────────────────
export { default as StackHero } from './StackHero.jsx'
export { default as ArticleHeader } from './ArticleHeader.jsx'
/* DROPPED 2026-08-30 (ContentSetRetirement step 3): `ListingCard` / its
 * `ArticleCard` alias, `WorkCard` and `WorkListItem`. All three were absorbed
 * into kol-component's ContentCard/ContentRow — `variant="article"` and
 * `variant="showcase"` — and the sweep showed no repo in the estate still
 * imported them. Sources quarantined to `_tmp/2026-08-30-content-set-exports/`,
 * not deleted. */
export { default as PortableTextRenderer, slugify } from './PortableTextRenderer.jsx'
export { default as AuthorLine } from './AuthorLine.jsx'
export { default as ShareButtons } from './ShareButtons.jsx'
export { default as SourcesReferences } from './SourcesReferences.jsx'

// ── Work (portfolio / project) ────────────────────────────────────────────
export { default as WorkViewToggle } from './WorkViewToggle.jsx'
export { default as ParallaxShelf } from './ParallaxShelf.jsx'
export { default as ScrollDriftGallery } from './ScrollDriftGallery.jsx'
