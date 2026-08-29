# Session: The section family, the retirement system, twenty-two tickets

**Date:** 2026-08-27 (session ran 2026-08-26 → 27)
**Agent:** Claude (Grim)
**Summary:** One long inbox run after the three-ticket log: the whole section family built and shipped with pixel parity, a real deprecation system with its first sweep, and every ticket that landed closed with receipts — component 0.68.1 → 0.85.0, theme 0.52.1 → 0.58.1, framework 0.24.0 → 0.27.1.

## Changes Made

### Files Modified
- `packages/component/src/molecules/SectionText.jsx` — label · headline · body · actions; `headlineSize` roles, `headlineCase`, `slotClass`/`slotStyle` seams; eyebrow uppercase by contract (`.kol-section-text-eyebrow`, `kol-helper-12 text-meta`).
- `packages/component/src/organisms/SectionHero.jsx` — variants `media` / `split`; presets full/80/60/40; `justify`, `veil`, `foot` + `overlap`, media array = carousel, text-only hero, `panelProps`, `theme`; literal `SPLIT_HEIGHTS` (runtime-built Tailwind classes are never emitted).
- `packages/component/src/organisms/SectionSplit.jsx` · `SectionCards.jsx` · `SectionCta.jsx` · `SectionFaq.jsx` · `sectionHeights.js` — one min-height ladder (`full` · `80` · `60` default · `40`); split's media frame bounded by the rung (`--kol-section-h` − 2·`--kol-section-py`); `align`, `mediaClip`, `itemClassName`/`itemStyle`; inner cap = the `--kol-container-max` ladder (100% → 1400 @1024 → 1600 @1280 → 1800 @1920).
- `packages/component/src/hooks/useSectionTheme.js` — `theme="inverse|light|dark"` on hero · split · cards via `data-theme` + the 0.52.0 subtree scopes.
- `packages/component/src/molecules/SectionCardItem.jsx` (was `CardFeatureItem`) · `organisms/InspectorSection.jsx` (was `Section`) — renamed into the family; old names are `@deprecated` aliases.
- `packages/component/src/organisms/SettingsPanel.jsx` · `MediaLibrary.jsx` · `ContentCard.jsx` · `ContentRow.jsx` · `ContentText.jsx` · `FeaturedCarousel.jsx` · `atoms/HlsVideo.jsx` · `utilities/FullscreenOverlay.jsx` · `OverlayGlassPanel.jsx` — kol-r2b2's SettingsPanel + prefix-scoped MediaLibrary page; catalog `expanded`; work row `thumbSquare`; carousel `is-full` + active video; focus trap; glass `padding`.
- `packages/framework/src/SideNav.jsx` · `AppShell.jsx` · `ThemeToggle.jsx` · `kol-framework.css` — `hairline` rail, `bg-surface-tertiary` content surface, toggle label names the target, full-width carousel slide.
- `packages/theme/*` — `.kol-section-*` chrome, eyebrow uppercase, hero veil; **one outline border on every control: `--kol-oq-08`** (button outline, control/toggle/icon-frame outline, seg shell + dividers, dropdown panel); fluid chess coordinates (`container-type: inline-size`).
- `packages/workshop/src/shell/ShellLayout.jsx` — `ShellContentWidthContext` (`canvas` / `shell` / `none`); `showcase/src/pages/Home.jsx` sets `none`. Width is the page's decision, not a shell law.
- `docs/operations/01-release/04-retirements.md` + `scripts/validate-retirements.mjs` (`pnpm retirements`, 21st gate) — the retirement ledger: R1 every alias has a row / no ghost rows · R2 drop when no repo imports · R3 fail at 30 days unimported. First sweep: 20 aliases (`FoundryCTA` unimported → drops at 30 days; `MenuPopover` 55 days, kept alive by one showcase import).
- `docs/documentation/04-compositions/12-section-system.md` · `01-foundations/05-layout-systems.md` § Page-chosen width · `03-typography.md` § Casing (the "no text-transform ever" law retired — casing is a ROLE) · `03-components/05-control-chrome.md` (oq-08) · `06-content-card-system.md` § Retirement · mdx pages 2.67.0–2.77.0 · `showcase/src/sets/section-set.jsx` (`/sets/preview/section-set`) · `nav/classification.js`.
- `lobby/INDEX.md` — 22 tickets closed since the last log (SettingsPanel · MediaLibraryReconcile · FeaturedCarouselFullWidth · FrameworkComponentPeer · SectionSet · SectionHeroRound2 · SectionHeroCarouselSeams · SectionTextLabelVoice · SectionSplitMediaClip · SectionCtaEditorial · SectionRevealSeams · ChessBoardFluidCoordinates · SectionHeroNoOverrides · sidenav-rail-hairline · appshell-content-surface · SectionHeroSplitHeight · SectionThemeInverse · ThemeToggleLabelTarget · SectionSplitHeight · SectionHeightLadder · SectionHeightForty · SectionSplitMediaBounded); `inbox/ContentSetRetirement.md` filed as the standing tracker.
- `public/fonts/` — `git mv` to kebab case done by the user (index tracked `Right-Grotesk/` capitalised); 105 dead files in `_tmp/2026-08-26-fonts-quarantine/`; section originals in `_tmp/2026-08-26-section-set-originals/`.
- Bulletin (`~/.dotfiles/…/LLM_RULES.md`) — 08-26 font-folder `git mv` recipe; 08-27 Content Set variant map (old card → `ContentCard`/`ContentRow` variant + purpose).

### Features Added/Removed
- Section family: `SectionText` · `SectionHero` · `SectionSplit` · `SectionCards` · `SectionCardItem` · `SectionCta` · `SectionFaq` · `InspectorSection`; `FullBleedHero` · `FeatureSplit` · `FeaturesCardSection` · `CtaGlobal` · `FoundryCTA` · `FeaturedCarousel` · `Section` · `CardFeatureItem` retired to aliases.
- Retirement system (ledger + gate + sweep) — deprecation can no longer go silent.
- `SettingsPanel` organism (drawer / overlay); `MediaLibrary variant="page"` = FileList's prefix-scoped render.

## Current State

### Working
- All 21 gates green at every publish; every ticket measured headless before its receipt (Vite 5199 + kol-website's Playwright with the cached headless shell 1234; Ladle 61234 for the workbench).
- Rulings this session, scoped to their surface (NOT laws): width is the page's call; casing is a role (eyebrow + split-hero headline uppercase); one outline border `oq-08` (opaque — fg stacks multiply); one inner cap ladder; one height ladder; variants = named bundles of defaults; the composition is "the card", its parts "card items".

### Known Issues
- The showcase nests framework chrome in `components.components`, under every theme rule — pre-existing, needs a ruling.
- Split/FAQ carry side padding while cards/CTA don't at narrow widths; the `40` rung leaves a 144px media frame under lg padding (128 a side) — if low rungs want less air, that's the padding's ticket.
- kol-studio and kol-chess are not in the lobby registry — receipts hand-written to their `lobby/outbox/`.
- `pnpm validate | tail` masks exit codes (shipped workshop 0.24.0 with a red gate; 0.24.1 fixed it). Always read the gate line first.

## Next Steps
1. `ContentSetRetirement` stays in the queue until every consumer swaps (kol-website · kol-studio · kol-r2b2 · kol-monitor/mirror/fxr for `GridCard`) and the exports drop; the R3 gate enforces the clock.
2. Consumers bump onto component 0.85.0 / theme 0.58.1 / framework 0.27.1 and swap the section aliases.
3. Rule on the showcase's nested `components.components` layer.
