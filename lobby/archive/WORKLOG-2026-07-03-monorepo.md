# Lobby build — phases & worklog

Companion to [INDEX.md](INDEX.md). Scoped 2026-07-03 from a full read of all 78 specs, verified against the live package roster. This is the operative doc: work lands as one-line entries in the **Change log**, bugs get tagged rows in the **Bug ledger** the moment they surface — review reads this file.

## Decisions (locked 2026-07-03)

- **`@kol/*` (monorepo) = the original KOL DS.** This repo rebuilds under `@kolkrabbi/*` — spec deps that point at monorepo components are prerequisites built here, placed in phases below.
- **Motion deps adopted:** `gsap` (+ScrollTrigger) and `framer-motion` — peer deps on kol-component, real deps in showcase/workbench.
- **`hls.js` adopted** (HLS `.m3u8` streaming video — the B2 CDN video pipeline; HlsVideo + video cards/heroes need it).
- **`opentype.js`** (font-binary parser) isolated to the foundry phase only.
- **Reduced-motion is a DS-wide rule:** one shared `usePrefersReducedMotion` gate; every effect/animated component ships gated. No source has this — added on every recreate.
- **Big families build as SETS** (chess/metrics pattern: import in full → `/sets/:slug`, promote only the generic primitives to packages, flag adaptations in-code): **stack (blog CMS) · work (CMS) · prints (store) · foundry · editor**.
- Sanity-shaped code is **de-Sanitized on recreate**: flat props in, no CDN builders, no `_type` sniffing.
- Stale specs skipped (see Skip list) — no time spent on dead code.

## Definition of done (per component)

Component + workbench story + showcase demo/registry entry + changeset (joins the held batch) + one line in the Change log. Sets additionally: `/sets/:slug` page + `pnpm extract:docs` regen.

---

## Phases

Status: ☐ queued · ◐ in progress · ☑ done · ✕ skipped

### P0 — Deps + shared primitives (everything downstream composes these)

| Item | Action | Status |
|---|---|---|
| gsap + ScrollTrigger, framer-motion, hls.js | added as kol-component **required peers** + showcase/workbench deps | ☑ |
| `usePrefersReducedMotion` | new hook, `component/hooks` | ☑ |
| `useTilt` | one tilt hook (kills 3 forks: TiltCard/InteractiveImage/BentoCard) | ☑ |
| `resolveCssVar` + `isLight` | + `resolveCssColor`; in `hooks/cssVar.js` (taxonomy has no utils folder) | ☑ |
| **MediaViewer** | ONE fullscreen paged viewer on FullscreenOverlay — internal ~20-line paging (arrows/swipe/wrap), NOT embla (`ponytail:` note in source) | ☑ |
| **OverlayGlassPanel** | glass content card — dedupes 4× inline; dep of every hero | ☑ |
| **Figure** | figure/label/aspect/caption shell; caption chrome ported to kol-theme (uppercase dropped per casing rule) | ☑ |
| **EmptyState** | Placeholder spec, renamed; props generalized to eyebrow/title/body/footer | ☑ |

### P1 — Clean singles + Button enhancements ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| HlsVideo | atom; hls.js attach + Safari-native fallback | ☑ |
| PriceDisplay | atom; **formatPrice bug FIXED** — honors `currency`/`locale` (ledger #1) | ☑ |
| SpecList | molecules/ (nests Divider — taxonomy overrode spec's "atom") | ☑ |
| TabsRow | molecule; real tablist ARIA + roving tabindex + arrow keys added | ☑ |
| RotaryDial | atoms/ (nests nothing); Pointer Events + keyboard a11y added | ☑ |
| ErrorBoundary | organism; `homeHref` prop, `import.meta.env.DEV` gate, fallback render-prop | ☑ |
| DocsToc | atoms/; `rootMargin` prop default = source value (ledger #13 closed) | ☑ |
| TypeSample / TypeSpecCard / ProsePreview | all atoms/; uppercase dropped ×3; Right Grotesk default → sans token | ☑ |
| Button: `iconComponent` seam | additive; zero change to existing callers | ☑ |
| Button: `pressed` + **ShapeDropdown** | aria-pressed + `.kol-btn-pressed`; ShapeDropdown molecule on usePopover | ☑ |
| CurveOverlay | atoms/; `--ui-warning` → `--kol-accent-primary`; useId'd SVG ids | ☑ |
| FeatureSplit | organism + `.kol-feature-split-*` CSS; fullBleed now opt-in prop | ☑ |
| AssetGrid | atom; zero CSS — pure Tailwind grid map | ☑ |

### P2 — Shell set + framework reconciles (merge, don't duplicate) ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| PageSection | MERGE → framework PageSection (already exists; spec was blind to it) | ☑ |
| Footer | ENHANCE → PortalFooter (generalize; brand + link slots) | ☑ |
| ShellLayout | MERGE richer orchestrator into AppShell | ☑ |
| ShellSidebar | MERGE seams into SideNav | ☑ |
| SearchInput | prerequisite atom (ShellHeader/SearchOverlay/WorkViewToggle need it) | ☑ |
| ShellHeader | build after SearchInput; brand slot replaces KolWordmark/Logomark; reconcile ThemeToggle | ☑ |
| ShellDrawer | NEW edge-drawer primitive (Esc + focus-trap + reduced-motion slide) | ☑ |
| ShellSearchOverlay | NEW ⌘K palette (arrow-nav + focus-trap) | ☑ |

### P3 — Layout / marketing organisms ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| Hero family reconcile | FullBleedHero = base (vs BrandHero/SubPageHero); StackHero folds in `variant="tall"`; StudioHero = video variant, not a file | ☑ |
| FramedMediaBand | molecule; dedupes 5× inline | ☑ |
| FeaturesCardSection + CardFeatureItem | organism + child; dedupes 3 impls; Buttons in a flex row (no ButtonGroup atom — YAGNI) | ☑ |
| CtaGlobal | organism; drop mailto/copy hardcodes | ☑ |
| NewsletterBand | organism; endpoint → prop, drop doc-wide IntersectionObserver | ☑ |
| BentoCard | organism; HlsVideo + useTilt + `<Media src>` sniffer | ☑ |
| FeaturedCarousel | rebuilt on DS Carousel + OverlayGlassPanel (convergence target absent here) — last in phase | ☑ |

### P4 — Effects (all reduced-motion gated) ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| TiltCard | on useTilt (framer) | ☑ |
| AnimatedTitle | gsap ScrollTrigger | ☑ |
| TextPressure | collapse 3 source variants → 1; variable-font asset contract | ☑ |
| AsciiCursor | singleton overlay | ☑ |
| ColorLoader + LoaderOverlay | LoaderOverlay = compose FullscreenOverlay; ColorLoader on TextPressure, cursor system dropped | ☑ |

### P5 — Color kit ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| SpectrumControls | promote all 3 pickers whole (HSV math is the payload); fix SVG id collision (ledger #9) | ☑ |
| SwatchControls | collapse internal FramedSwatch → ColorSwatch; `swap`/`eyedrop` icons added | ☑ |
| **ColorInputRow** | ONE component absorbs ColorField + SwatchRow; drop dead `edited` prop | ☑ |
| ColorRamp (+ Ramp merged) | on ColorSwatch + resolveCssVar | ☑ |
| SpectrumGrid | live CSS-var matrix, shares resolver | ☑ |

### P6 — SET: stack (blog CMS) → `/sets/stack` ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| ArticleCard family | 3 specs (6 source files, byte-identical dupes) → ONE component, `size=default\|hero\|mini`; fg-token placeholder wins | ☑ |
| ArticleHeader | de-Sanitize; use Avatar atom | ☑ |
| ImageBlock / VideoBlock | on Figure shell | ☑ |
| PortableTextRenderer | renderer + block registry; one map (source has two) | ☑ |
| StackHero | on P3 hero base | ☑ |
| Set page | full composition, real content, manifest regen | ☑ |

### P7 — SET: work (CMS) → `/sets/work` ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| WorkCard | on TiltCard; index-driven heights | ☑ |
| WorkListItem | row twin, shared project bag; `href` added, dead `isActive` resolved (ledger #4) | ☑ |
| WorkViewToggle | sliding-pill toggle + search; context → controlled props | ☑ |
| GalleryCarousel | COMPOSE: DS Carousel + MediaViewer (drops hand-rolled Embla, ledger #11) | ☑ |
| ParallaxShelf | ENHANCE Carousel: expose emblaApi + parallax/direction/hide-controls | ☑ |
| Set page | grid/list toggle + shelf + detail gallery, real content | ☑ |

### P8 — SET: prints (store) → `/sets/prints` ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| ProductDetailLayout | pure slot skeleton (media/price/specs/tabs/actions); PayPal/`print.*`/routing dropped; uses PriceDisplay/SpecList/TabsRow/QuantityInput | ☑ |
| DiagonalMarqueeRiver | gsap; `renderItem` slot; add resize remeasure (ledger #10) | ☑ |
| ScrollDriftGallery | gsap ScrollTrigger; reduced-motion fallback | ☑ |
| Set page | PDP + both galleries, real print content | ☑ |

### P9 — SET: foundry → `/sets/foundry` ☑ (2026-07-03)

| Item | Action | Status |
|---|---|---|
| opentype.js + FontLoader | in; merge the two metrics renderers into one MetricsOverlay | ☑ |
| Missing primitives | GlyphGrid · GlyphCategory · StylesGrid · FontPreviewItemAlt · VariableFontDisplay (the absent `@kol/ui/foundry` layer) | ☑ |
| SpecimenSectionHeader | from FoundrySection — 5 sections mount under it, build first | ☑ |
| `useAxisAnimation` | hook: ping-pong rAF, reduced-motion gated | ☑ |
| GlyphMetricsGrid / GlyphMetricsSection / VariableFontSection / TypefaceHero / TypefaceStyleSection / FontPreviewSection / FoundryCharacterSets | the sections; light-theme fix on CharacterSets (ledger #3); TypeScaleSection ships as a recipe in the set docs, not a component | ☑ |
| Set page | full specimen composition | ☑ |

### P10 — SET: editor → `/sets/editor` ☑ (2026-07-03)

Chess-apparatus pattern: full import into showcase sets, NOT a package — generic parts (TabsRow, EmptyState, SpectrumControls family, ColorInputRow, Button enhancements) were already promoted in P1/P5. Package promotion later only if a consumer demands it.

| Item | Action | Status |
|---|---|---|
| Canvas + SelectionOverlay | interlocked — 1080-virtual-px coordinate contract, move together | ☑ |
| EditorShell | 2-rail layout + panel registry | ☑ |
| AlignmentGrid | cells on DS Button quiet/iconOnly; 6 `align-*` glyphs added to Icon | ☑ |
| Set page | working editor composition | ☑ |

---

## Skip list (stale — not built)

| Spec | Why |
|---|---|
| InteractiveImage | orphaned in source, imported nowhere |
| RouteLoader | source is a `() => null` no-op |
| ChapterNavigation | zero consumers; DocsToc covers the TOC family |
| TypeScaleSection | thin PageSection+Table wrapper → recipe, not component |
| StudioHero (as file) | dead code; survives as FullBleedHero video variant |

---

## Change log

Format: `date · component · what landed · notable adaptations`. One line each.

- 2026-07-03 · **deps** · framer-motion/gsap/hls.js as kol-component REQUIRED peers (one barrel = one dep graph; subpath exports are the escape hatch if peers get heavy — review flag) · showcase+workbench install clean.
- 2026-07-03 · **usePrefersReducedMotion / useTilt / cssVar utils** · useTilt exposes raw motionValues for the grounded variant · utils live in `hooks/cssVar.js` — closed folder set has no utils/.
- 2026-07-03 · **EmptyState** (atom) · renamed from Placeholder (AssetPlaceholder collision); props → eyebrow/title/body/footer; source `uppercase` dropped.
- 2026-07-03 · **OverlayGlassPanel** (atom) · verbatim glass look (80% color-mix + 1px blur) as props with those defaults.
- 2026-07-03 · **Figure** (atom) · aspect via inline style, not aspect-[] utility (arbitrary ratios); caption CSS → kol-components-atoms.css, label uppercase dropped.
- 2026-07-03 · **MediaViewer** (organism) · FullscreenOverlay shell + internal paging; spec said compose Carousel — deviated deliberately (embla buys nothing for a one-item stage).
- 2026-07-03 · P0 demos ×4, stories ×4, registry + DOC_DATA entries, changeset `p0-shared-primitives`. Build clean.
- 2026-07-03 · **P1 (14 components)** · HlsVideo, PriceDisplay (bug fixed), SpecList, TabsRow, RotaryDial, ErrorBoundary, DocsToc, TypeSample, TypeSpecCard, ProsePreview, Button+iconComponent/pressed, ShapeDropdown, CurveOverlay, FeatureSplit, AssetGrid · demos+stories per component; theme gains `.kol-btn-pressed`/type-kit/feature-split chrome · changeset `p1-clean-singles` · build clean.
- 2026-07-03 · P1 notable adaptations: several monorepo type classes have no DS equivalent (`kol-heading-lg`, `kol-mono-sm/xs`, `kol-helper-uc-*`) — mapped to nearest DS scale, all uppercase variants render authored-case; tier corrections vs specs (taxonomy rule wins): RotaryDial/DocsToc/CurveOverlay/TypeSpecCard/ProsePreview → atoms, SpecList → molecules.
- 2026-07-03 · **P2 (shell + framework)** · SearchInput/ShellDrawer/ShellSearchOverlay (component) + ShellHeader (framework); PortalFooter/AppShell/SideNav merged additively (zero-prop render byte-identical); **PageSection = no-op** (already equivalent — the stale spec's biggest miss). Shell CSS + AppShell TOC rail + SideNav collapsible-section chrome → kol-framework.css; contexts exported from framework barrel.
- 2026-07-03 · **P3 (8 organisms)** · FullBleedHero (StudioHero folded in as the video capability, not a file), FramedMediaBand, CardFeatureItem+FeaturesCardSection, CtaGlobal, NewsletterBand, BentoCard (useTilt + media sniffer), FeaturedCarousel. Hero family now BrandHero/SubPageHero (band) + FullBleedHero (full-bleed) — reconciled, not duplicated.
- 2026-07-03 · **P4 (6 effects)** · TiltCard, AnimatedTitle (gsap), TextPressure, AsciiCursor, ColorLoader+LoaderOverlay — every one gated on usePrefersReducedMotion (DS-wide rule); AsciiCursor also vanishes on coarse pointer.
- 2026-07-03 · **P5 (color kit)** · SpectrumControls (3 pickers whole, SVG id-collision fixed), SwatchControls (swap/eyedrop glyphs both existed), ColorInputRow (ColorField+SwatchRow merged), ColorRamp (Ramp merged), SpectrumGrid — all on shared resolveCssVar/isLight + ColorSwatch.
- 2026-07-03 · **P2–P5 central wiring + verify** · barrels (component + framework), 41 usage-index seeds (new components were invisible without them — ledger #18), registry descriptions/functions, DOC_DATA, CSS → 4 theme files, demo/story deep-imports normalized to the package specifier, 4 changesets. **`pnpm build` green (3220 modules); `validate-taxonomy` clean.** Playwright smoke: full-bleed-hero / spectrum-controls / color-ramp / animated-title / bento-card render with 0 console errors each.
- 2026-07-03 · **Interruption log:** session-limit killed the first P3–P5 fleet (relaunched); then Fable credit ran out mid-batch → switched to Opus and relaunched survivors. Several agents wrote the component before dying, so a finisher agent completed 4 partials' demo/story/wiring. No work lost.
- 2026-07-03 · **P6–P10 — five SETS (all on Opus).** Each a live page under `/sets/*` (auto-globbed by sets-registry — no registry edits). P6 StackBlog (ArticleCard 6→1 + ArticleHeader/ImageBlock/VideoBlock/PortableTextRenderer/StackHero), P7 WorkPortfolio (WorkCard/WorkListItem/WorkViewToggle/GalleryCarousel/ParallaxShelf), P8 PrintsStore (ProductDetailLayout + 2 gsap galleries), P9 FoundrySpecimen (opentype metrics, isolated under the `@kolkrabbi/kol-component/foundry` subpath), P10 DesignEditor (Canvas/SelectionOverlay/EditorShell/AlignmentGrid — a working editor: select/drag/resize/recolor/align).
- 2026-07-03 · **P6–P10 wiring + verify** · 18 flat members → root barrel (foundry stays subpath), 18 usage-index seeds + descriptions, WorkPortfolio deep-imports normalized, SET_CATEGORY_LABELS extended, `opentype.js` installed (optional peer). **`pnpm build` green, `validate-taxonomy` clean.** Playwright-smoked all 5 set routes (StackBlog / WorkPortfolio / PrintsStore / FoundrySpecimen / DesignEditor) — 0 console errors each; editor + foundry + stack visually confirmed. changeset `p6-p10-sets`. **Did NOT run `extract:docs`** — it re-mines and would wipe the hand-seeded component list (ledger #18); sets render fine with composition:null.

- 2026-07-03 · **Completeness pass (after review caught gaps I'd wrongly called done).** Three items closed + verified: **(1) component registry** — every one of the 107 component files now listed with a tier in `/components` (125 usage-index entries; seeded the 7 foundry members + the Modal/Popover modules that had no filename entry). **(2) set manifests** — all 5 new sets now outline their members in the set slug; fixed `extract-composition.mjs` to follow the `@kolkrabbi/kol-component/foundry` subpath (FoundrySpecimen 1→7) and to skip UPPER_SNAKE consts (CANVAS_VIRTUAL_W leak). **(3) blocks** — built **16 new blocks** (6→22) across hero/marketing/content/media/color/chrome/footer/panel/toolbar/form, each auto-globbed with a scanner manifest. Build green, Playwright-smoked `/blocks` + ColorPicker/ShellTopbar/ProductPanel + all 5 set routes — 0 console errors. **Lesson: "builds" ≠ "wired into the showcase" — a component/set/block isn't done until it's registered AND its slug renders its manifest. Verify the slug, not just the build.**

- 2026-07-03 · **Review round 2 — two real bugs the user caught.** (1) **Set/block slugs listed too few components.** The composition scanner only counted a set file's DIRECT package imports (StackBlog = 4), not the components those transitively pull in. Rewrote `extract-composition.mjs` to resolve `@kolkrabbi/*` imports through the barrels into the package source and walk them — now the slug lists EVERY component in use (StackBlog 4→17, WorkPortfolio 5→13, PrintsStore 3→13, FoundrySpecimen 7→17, DesignEditor 9→15; blocks likewise, e.g. ShellTopbar now surfaces the nested SearchInput/ThemeToggle inside ShellHeader). Capitalized names → `kol`, lowercase (hooks/utils) → `support`, UPPER_SNAKE consts skipped. (2) **Home page was weak vs shadcn.** Rebuilt `pages/Home.jsx` as a dense `columns-1→4` masonry of ~20 RICH tiles: 10 live metrics-dashboard cards (DashMetricCard+Sparkline, DashFeaturedCard+LineChart, DonutChart, DashTableCard, DashStackedBarCard, DashListCard meters/ratings, DashAlertCard — all off the offline `useMetricsData` mock) + 8 blocks (Inspector/ColorPicker/SettingsForm/ColorTools/FilterBar…) + component demos for rhythm. Fixed a masonry overflow (TypeScale/PaletteReference/NewsletterSignup have full-width type that bled into neighbours → dropped from the narrow wall + `overflow-hidden` safety on every tile). Build green, Playwright-verified home + set slugs — 0 console errors.

- 2026-07-03 · **Review round 3 — four fixes.** (1) **Set/block slug = live component GALLERY, not chips.** Rewrote `CollectionPage.jsx` Composition: every KOL component the collection uses now renders in its OWN bordered container (name + function + View→ link + the LIVE demo), stacked one after another — the repeated ask. Built the **25 missing set-member demos** (ArticleCard variants, ArticleHeader, ImageBlock/VideoBlock, PortableTextRenderer, StackHero, Work*, ProductDetailLayout, the gsap galleries, Canvas/EditorShell/SelectionOverlay/AlignmentGrid, all 6 foundry members) so every container is live; fallback = labelled+linked card. (2) **kebab-case slugs** — renamed all 7 set + 22 block files to kebab (`stack-blog`, `work-portfolio`, …), fixed Home's 5 block() keys, rescanned (composition keys now kebab). (3) **Home full-bleed** — the masonry stays capped/centred but two faded **skeleton ghost-card flanks** fill the gutters to the viewport edge on wide screens (shadcn edge treatment). (4) **`vercel.json`** — SPA rewrite `/(.*) → /index.html` (+ buildCommand/outputDirectory) fixes the deploy 404s on deep links. Build green, Playwright-verified stack-blog gallery (17 live component containers, 0 errors) + the full-bleed home at 1920px.

- 2026-07-03 · **Review round 4 — gallery for EVERY set + home polish + doc.** (1) The slug **composition gallery is a shared page** (`CollectionPage`), so all 7 sets + 22 blocks already get it; extended it to render **local parts** (chess board, dashboard cards/charts) as containers too, not chips — built **22 more demos** (15 metrics dashboard cards+charts, 7 chess parts) so those galleries render live (contexts/layout-helpers fall back to labelled cards). Verified metrics slug: Table + live Candlestick/cards, 0 errors. (2) Home: real content **1600px**, skeleton edge-flanks made **super subtle** (fainter border, fg-02 bars, 40% opacity, fast fade). (3) New reference doc `docs/documentation/03-compositions/03-slug-composition-gallery.md` — how the transitive scanner + gallery work, how to add a set/block (with reciprocal sibling cross-ref).

---

## Bug ledger

Tags: **[source-bug]** broken in the monorepo source · **[dead-prop]** prop declared, never functional · **[dupe]** duplicate code in source · **[spec-gap]** missing behavior to add on recreate.

| # | Where | Tag | Bug | Handled |
|---|---|---|---|---|
| 1 | PriceDisplay `formatPrice` | [source-bug] | hardcodes EUR/de-DE, silently ignores `currency` arg — ISK renders as `€…` | fix in P1 |
| 2 | RouteLoader | [source-bug] | component is a `() => null` no-op in source | skipped |
| 3 | FoundryCharacterSets | [source-bug] | hardcoded `rgba(18,18,21)` gradient mask breaks light theme | fix in P9 |
| 4 | WorkListItem | [dead-prop] | `isActive` declared, never used | resolve in P7 |
| 5 | SwatchRow | [dead-prop] | `edited` prop dead | dropped in P5 |
| 6 | ArticleCardHero | [dead-prop] | `headingClass` dead; `"Featured"` label hardcoded → becomes `label` prop | fix in P6 |
| 7 | ArticleCard + ArticleCardMini | [dupe] | byte-identical copies in `prose/cards` AND `sections/blog` (monorepo cleanup candidate) | collapsed in P6 |
| 8 | every effect/motion source | [spec-gap] | no `prefers-reduced-motion` gating anywhere | DS-wide gate, P0 |
| 9 | SpectrumControls | [source-bug] | SVG `<defs>` id collision when two instances mount | fix in P5 |
| 10 | DiagonalMarqueeRiver | [source-bug] | no resize remeasure — stale geometry after viewport change | fix in P8 |
| 11 | GalleryCarousel | [dupe] | hand-rolls the exact Embla config DS Carousel already ships | composed in P7 |
| 12 | OverlayGlassPanel / FramedMediaBand | [dupe] | 4× and 5× inline copies respectively across source | deduped P0/P3 |
| 13 | DocsToc vs DS `useScrollSpy` | [spec-gap] | rootMargin defaults differ (`-80px/-80%` vs `-30%/-60%`) — silent behavior change if unhandled | ☑ option exposed in P1 |
| 14 | Button `selected` prop | [source-bug] | pre-existing: `kol-btn-selected` class has NO CSS rule anywhere in kol-theme — selected highlight is a no-op | found P1; needs a theme rule or prop removal |
| 15 | `useScrollSpy` edge-lock | [spec-gap] | pre-existing: edge-lock only re-checks on WINDOW scroll — inside an inner `overflow-y-auto` container activeId locks to null permanently | found P1; hook needs a `root` option (out of batch scope) |
| 16 | HlsVideo (source) | [source-bug] | Safari-native path never clears `video.src` when src goes null — old stream keeps playing (hls.js path cleans up) | ported verbatim per spec; fix candidate |
| 17 | HlsVideo reduced-motion | [spec-gap] | autoplaying decorative video not gated on prefers-reduced-motion (spec mandated exact attribute port) | review call: gate at consumer or atom level |
| 18 | showcase registry | [spec-gap] | new DS components DON'T appear in the showcase until hand-seeded into `usage-index.json` — the registry builds `COMPONENTS` from mined usage only, so ~40 new components were invisible after build | P2–P5 seeded (41 entries); **durable fix: `extract-usage.mjs` should union in every barrel export, or the registry should fall back to DEMOS keys** |
| 19 | FullscreenOverlay | [spec-gap] | always renders a centred width-capped sheet + `×` button — fights a full-bleed consumer (LoaderOverlay shims around it, stray inert `×` still paints) | needs a `bare` prop; not patched (widely-used atom) — review call |
| 20 | Carousel | [spec-gap] | hides its embla api, so FeaturedCarousel had to call `useEmblaCarousel` itself instead of composing Carousel; **same wall blocks ParallaxShelf in P7** | add an `onApi`/ref seam to Carousel — unlocks both |
| 21 | Button `href` + `onClick` | [gotcha] | passing `onClick` flips Button from `<a>` to `<button>`, dropping the href — SPA link seams (BentoCard/FeaturedCarousel/CardFeatureItem) had to wire navigation capture-phase or via plain anchors | documented; a `Button` link-vs-action split would be cleaner |
| 22 | monorepo type-class gaps | [spec-gap] | recurring across the batch: `kol-heading-*`, `kol-mono-xs/sm`, `kol-helper-uc-*`, `kol-display-lg`, `--kol-fg-primary`, `--kol-font-family-{Text,Wide}` don't exist here — each mapped to the nearest real DS token/class (logged per component) | mappings applied; a monorepo→DS type-class crosswalk doc would prevent re-deriving it |
| 23 | `extract:docs` vs hand-seeds | [gotcha] | re-running the usage miner regenerates `usage-index.json` from mined apps and would DROP the 59 hand-seeded new-component entries → every new component vanishes from the showcase list | did NOT run it; **durable fix = miner unions barrel exports (same root cause as #18)** |
| 24 | ScrollDriftGallery | [spec-gap] | its window-scroll ScrollTrigger pin mis-measures inside the showcase's nested `overflow-auto` set scroller — the PrintsStore set uses the marquee hero instead | both members shipped; gallery needs a `scroller`/root option to work in nested scrollers |
| 25 | `embla-carousel-wheel-gestures` | [missing-dep] | not installed, so the vertical-wheel→horizontal-pan plugin was dropped from ParallaxShelf + WorkPortfolio shelves (drag still works) | add the dep if wheel-pan is wanted |
| 26 | foundry variable font | [asset-gap] | no variable font ships in-repo, so VariableFontSection's weight slider steps between discrete `font-weight` values rather than smoothly animating an axis — the specimen renders in the served static Right Grotesk | font-asset contract noted in JSDoc; ship a variable font to unlock true axis animation |
| 27 | GlyphMetricsSection axis dropdowns | [scope-cut] | not ported (static font); the sub-primitives (StylesGrid/FontPreviewItemAlt/GlyphCategory…) were inlined as same-file helpers rather than separate exports | foundry set is self-contained; split them out later if reused |
