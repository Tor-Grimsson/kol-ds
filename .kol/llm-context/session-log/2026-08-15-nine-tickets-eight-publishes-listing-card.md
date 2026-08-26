# Session: nine tickets closed, eight publish waves, ListingCard born

**Date:** 2026-08-15
**Agent:** Grim (Opus 5)
**Summary:** The lobby processed to zero THREE times as consumer sessions kept filing — nine tickets closed same-day across six packages, ArticleCard reconciled/renamed to ListingCard on the consumer's returned spec, the @source manifest fixed for pnpm, kol-shell's rail icons resolved, and the exhibit-section system moved into kol-workshop.

## Changes Made

### Published (all registry-verified, 19 gates clean before each wave)

| Package | From → To | What |
|---|---|---|
| kol-component | 0.38.0 → **0.43.0** | `sideEffects: false` · MediaLibrary accept-widening (BREAKING default flip) + four bucket rules · Avatar `src` photo · FeaturedCarousel reconciled + `EmblaNav` minted · FeatureSplit grew `flip`/`titleSize`/`mediaAspect`/`mediaHover` · `AudioPlayer` atom |
| kol-content | 0.4.1 → **0.7.0** | ArticleHeader reconciled (authorImage/srcSet/tagSize) · ArticleCard readmore+seams (0.6.0) · readmore geometry corrected (0.6.1) · **renamed `ListingCard`** per the returned spec, readmore DROPPED, clamps conformed (0.7.0) |
| kol-theme | 0.41.0 → **0.42.2** | FeatureSplit `is-hoverable` zoom (0.42.0) · kol-shell `@source` line (0.42.1) · **pnpm twin-line manifest fix** (0.42.2) |
| kol-framework | 0.20.0 → **0.20.1** | `.kol-embla-btn` glyph centring + `.is-inline` controls |
| kol-workshop | 0.21.0 → **0.22.0** | Exhibit-section system (6 exports: ExhibitOverview/Page/Sidebar/Card/LinkCard + useExhibitToc) |
| kol-icons | 0.16.0 → **0.17.0** | `rack` minted into device/ from kol-monitor's shelf; `nav-library`→`library`, `nav-settings`→`settings-01` mapped. Inventory 199 · 27 |

### Tickets closed (lobby inbox → done/, resolutions appended, receipts synced)

1. **ComponentSideEffectsField** (kol-monitor) — verified truthful before declaring (zero CSS imports in src/).
2. **media-library-non-av-blindness** (kol-r2b2) — accept widens; extension-first kinds, resolution-set folding, HLS folding, system-count; audio component deliberately deferred as a taxonomy call.
3. **WorkshopExhibitSystem** (kol-website) — three page archetypes shipped as TWO components (showcase + prose page were never structurally different); rail-block drift fixed on recreation via RailSection.
4. **ArticleHeaderReconcile** (kol-website) — verdict: the package was already canon; the 220-line diff was Sanity plumbing + casing violations shed on purpose. Three real gaps crossed; Avatar fixed at the atom.
5. **FeaturedCarouselReconcile** (kol-website) — never a fork, two engines (framer-motion index vs embla; theirs had no drag). Five capabilities crossed back; CarouselNavigation superseded by `EmblaNav` (the literal `‹›` glyphs were the fork's reason to exist).
6. **SectionSplit** (kol-website) — **NOT built**: FeatureSplit already ships the anatomy; grew flip (order-based, not flex-row-reverse — one-column stacks below 901px)/titleSize/mediaHover. Core design question ruled: per-site type classes do NOT thread — one role, one class (§5 cascade law).
7. **ArticleCard** (kol-website) — mostly already built; `readmore` + REPLACE-only type seams added. readmore's invented geometry (text-glyph arrow, w-[88px]) caught by the user, corrected to mini's-row-in-a-border same day (0.6.1).
8. **KolSourcesPnpmResolution** (kol-mirror) — under pnpm EVERY manifest path resolved to nothing (realpath into .pnpm store). Twin lines per package: flat path + five-up store walk, measured against kol-mirror's live store. Dependency-edge and per-package-CSS directions rejected.
9. **ListingCardSpec** (kol-website, answering our ArticleCardSizeSpec filing) — scope WIDE, renamed ListingCard (ArticleCard aliases until next major), readmore dropped ("read more" is a context, not a size), two clamp deltas fixed. Stated deviation: WorkCard NOT aliased — different prop contract, aliasing breaks /work.

Plus **AudioPlayer** (kol-r2b2's follow-up filing) — atom beside HlsVideo, inverted intent, no compact variant (entry forbade speculative build).

### Also

- Root artifacts cleared → `_tmp/2026-08-15-root-artifacts/`; chess migration brief (2026-07-09, superseded — chess became its own package) → `.kol/llm-context/`.
- `ArticleCardSizeSpec` filed to kol-website (the geometry/scope/naming ask) — answered same-day by ListingCardSpec; receipt closed 🟢.
- Ledger drift repaired twice (rows missing for parallel-session filings); SHIPPED-PACKAGES synced every wave.
- classification.js: Exhibit five + EmblaNav + AudioPlayer + ListingCard registered; ArticleCard exempted as alias.

## Current State

### Working
- Lobby queue **0** · outbox **0 live** (ArticleCardSizeSpec answered + closed). Repo == npm on all 15 packages.
- The pnpm manifest fix means pnpm consumers get ALL twelve packages' utilities back, not just kol-shell's.

### Known Issues
- ⚠️ **kol-workshop's exhibit system + kol-shell both ship unexercised** — no showcase surface, no adopting app has rendered either.
- ⚠️ `ListingCard`'s full family convergence (WorkCard/WorkListItem onto the neutral name) is deliberately deferred to the next major — recorded in the package barrel.
- ⚠️ Process faults this session, named by the user: parked the rail icons instead of finishing ("never again do you park — you FINISH jobs"); invented readmore geometry instead of reusing mini's (text-glyph arrow hours after minting EmblaNav to kill exactly that). Both corrected same-day, both are the pattern to not repeat.
- Showcase demo files still named ArticleCard* — ride the alias until the next major.

## Next Steps
1. Showcase surfaces for kol-shell + the exhibit system (both still unrendered anywhere).
2. Adoption waves are the consumers': kol-monitor (sideEffects patch drop, icon name swaps, shell set), kol-mirror (@source workaround delete), kol-website (ListingCard, FeatureSplit sections, exhibit re-declare, ArticleHeader/FeaturedCarousel retirement), kol-r2b2 (MediaLibrary + AudioPlayer bumps).
3. Next major: ArticleCard alias removal + WorkCard/WorkListItem name convergence.
