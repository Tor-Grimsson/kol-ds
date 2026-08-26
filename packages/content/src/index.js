// @kolkrabbi/kol-content — the CMS content system: /stack (blog editorial) +
// /work (portfolio). Two Sanity content streams sharing one home. Data is
// consumer-injected (portable text / project docs). The shared primitives
// (ContentFilters, DropdownTagFilter, ShellSearchOverlay, GalleryCarousel,
// Avatar, Tag) stay in @kolkrabbi/kol-component — this package depends on them.
// CSS ships in @kolkrabbi/kol-theme (.kol-prose + component sheets).

// ── Stack (blog / editorial) ──────────────────────────────────────────────
export { default as StackHero } from './StackHero.jsx'
export { default as ArticleHeader } from './ArticleHeader.jsx'
/* ListingCard — THE listing card for any content type (ListingCardSpec ruling,
 * 2026-08-15: names the role, not the content). ArticleCard is its alias until
 * the next major. WorkCard/WorkListItem keep their own anatomy for now — the
 * spec converges the family on the neutral NAME; folding WorkCard's distinct
 * prop contract (type/year/description) into this one is a separate design
 * pass, and aliasing it today would break every /work consumer. */
export { default as ListingCard, default as ArticleCard } from './ListingCard.jsx'
export { default as PortableTextRenderer, slugify } from './PortableTextRenderer.jsx'
export { default as AuthorLine } from './AuthorLine.jsx'
export { default as ShareButtons } from './ShareButtons.jsx'
export { default as SourcesReferences } from './SourcesReferences.jsx'

// ── Work (portfolio / project) ────────────────────────────────────────────
export { default as WorkCard } from './WorkCard.jsx'
export { default as WorkListItem } from './WorkListItem.jsx'
export { default as WorkViewToggle } from './WorkViewToggle.jsx'
export { default as ParallaxShelf } from './ParallaxShelf.jsx'
export { default as ScrollDriftGallery } from './ScrollDriftGallery.jsx'
