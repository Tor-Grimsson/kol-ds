# Component lobby

Staging bay for components flung in from consumer apps via the `kol-lobby` skill.
Each entry is a spec the DS **recreates from** — not source. To promote: build the
component under `packages/component/src/{atoms,molecules,organisms}/` (or a new
`packages/*` for non-component work) to spec, then move its entry to `done/`
(recreated) or `archive/` (rejected, with a reason) and log the job below.

This is a work queue, not published docs — it intentionally sits outside `docs/`
and does not follow the `.kol/docs-framework` conventions.

## Queue

Staged 2026-07-03 — a 42-component sweep of `kol-monorepo` (`apps/web` + `apps/brand`), grouped by set. All cross-checked against `@kol/component` + `@kol/ui` so no existing DS export is re-staged; each spec flags its app coupling to drop and any DS twin to reconcile. **Batch worklog: [WORKLOG-2026-07-03-monorepo.md](WORKLOG-2026-07-03-monorepo.md)** — phases, change log, bug ledger.

| Component | Source | Staged | Status |
|-----------|--------|--------|--------|
| [HlsVideo](HlsVideo.md) | web `components/media/HlsVideo.jsx` | 2026-07-03 | draft |
| [ErrorBoundary](ErrorBoundary.md) | web `components/errors/ErrorBoundary.jsx` | 2026-07-03 | draft |
| [DocsToc](DocsToc.md) | web `components/workshop/docs/DocsToc.jsx` | 2026-07-03 | draft (reconcile → useScrollSpy) |
| [AsciiCursor](AsciiCursor.md) | web `components/ui/AsciiCursor.jsx` | 2026-07-03 | draft (effect · framer-motion) |
| [AnimatedTitle](AnimatedTitle.md) | web `components/animation/AnimatedTitle.jsx` | 2026-07-03 | draft (effect · gsap ScrollTrigger) |
| [InteractiveImage](InteractiveImage.md) | web `components/media/InteractiveImage.jsx` | 2026-07-03 | parked (orphaned effect · SVG-id collision bug · revisit on a real consumer) |
| [TiltCard](TiltCard.md) | web `components/animation/TiltCard.jsx` | 2026-07-03 | draft (effect · hook promotes with it) |
| [PageSection](PageSection.md) | brand `components/framework/PageSection.jsx` | 2026-07-03 | draft (rename vs DS Section) |
| [FeatureSplit](FeatureSplit.md) | brand `components/styleguide/FeatureSplit.jsx` | 2026-07-03 | draft (CSS moves with it) |
| [AssetGrid](AssetGrid.md) | brand `components/styleguide/AssetGrid.jsx` | 2026-07-03 | draft (merge → DS Grid) |
| [EditorButton](EditorButton.md) | brand `editor/components/EditorButton.jsx` | 2026-07-03 | draft (Button `iconComponent` enhancement, not new atom) |
| [ProsePreview](ProsePreview.md) | brand `components/styleguide/ProsePreview.jsx` | 2026-07-03 | draft (→ ProseStylesViewer children) |
| [TypeScaleSection](TypeScaleSection.md) | brand `components/styleguide/TypeScaleSection.jsx` | 2026-07-03 | recipe (Table + PageSection exist — document a columns recipe, don't build) |
| [SpectrumGrid](SpectrumGrid.md) | brand `components/styleguide/SpectrumGrid.jsx` | 2026-07-03 | draft (color kit · live CSS-var matrix) |
| [ColorRamp](ColorRamp.md) | brand `components/sections/ColorRamp.jsx` | 2026-07-03 | draft (color kit · extract resolveCssVar util) |
| [ShellLayout](ShellLayout.md) | web `components/shell/ShellLayout.jsx` | 2026-07-03 | draft (shell set · centerpiece organism) |
| [ShellHeader](ShellHeader.md) | web `components/shell/ShellHeader.jsx` | 2026-07-03 | draft (shell set · compose ThemeToggleButton) |
| [ShellSidebar](ShellSidebar.md) | web `components/shell/ShellSidebar.jsx` | 2026-07-03 | draft (shell set · compose SidebarMenuItem) |
| [ShellDrawer](ShellDrawer.md) | web `components/shell/ShellDrawer.jsx` | 2026-07-03 | draft (shell set · new drawer primitive) |
| [ShellSearchOverlay](ShellSearchOverlay.md) | web `components/shell/ShellSearchOverlay.jsx` | 2026-07-03 | draft (shell set · Cmd-K palette) |
| [Footer](Footer.md) | web `components/layout/Footer.jsx` | 2026-07-03 | draft (shell set · DS had no footer) |
| [ArticleHeader](ArticleHeader.md) | web `components/prose/layouts/ArticleHeader.jsx` | 2026-07-03 | draft (CMS · flat-prop masthead) |
| [BentoCard](BentoCard.md) | web `components/cards/BentoCard.jsx` | 2026-07-03 | draft (CMS · media card · needs useBentoTilt too) |
| [StackHero](StackHero.md) | web `components/sections/stack-detail/StackHero.jsx` | 2026-07-03 | draft (CMS · full-bleed hero + Tall variant) |
| [VideoBlock](VideoBlock.md) | web `components/prose/blocks/VideoBlock.jsx` | 2026-07-03 | draft (CMS · → VideoFigure/VideoEmbed) |
| [ImageBlock](ImageBlock.md) | web `components/prose/blocks/ImageBlock.jsx` | 2026-07-03 | draft (CMS · split a Figure primitive) |
| [WorkCard](WorkCard.md) | web `components/work/ShelfCard.jsx` | 2026-07-03 | draft (work · index-driven heights · composes TiltCard) |
| [WorkListItem](WorkListItem.md) | web `components/work/ProjectListItem.jsx` | 2026-07-03 | draft (work · list-view row) |
| [GalleryCarousel](GalleryCarousel.md) | web `routes/WorkDetail.jsx` (inline) | 2026-07-03 | draft (work · project media gallery → shared viewer) |
| [WorkViewToggle](WorkViewToggle.md) | web `components/layout/Navbar.jsx` (inline) | 2026-07-03 | draft (work · animated shelf/list toggle + search · own component) |
| [ParallaxShelf](ParallaxShelf.md) | web `routes/Work.jsx` (inline) | 2026-07-03 | draft (work · scroll-parallax Embla shelf) |
| [ArticleCard](ArticleCard.md) | web `components/{prose/cards,sections/blog}/ArticleCard.jsx` | 2026-07-03 | draft (stack · card family default · 2 dupes byte-identical) |
| [ArticleCardHero](ArticleCardHero.md) | web `components/{prose/cards,sections/blog}/ArticleCardHero.jsx` | 2026-07-03 | draft (stack · hero variant · converge on fg-tokens) |
| [ArticleCardMini](ArticleCardMini.md) | web `components/{prose/cards,sections/blog}/ArticleCardMini.jsx` | 2026-07-03 | draft (stack · mini variant · 2 dupes byte-identical) |
| [PriceDisplay](PriceDisplay.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · price atom · no DS twin · formatPrice bug flagged) |
| [SpecList](SpecList.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · spec/definition-list atom) |
| [DiagonalMarqueeRiver](DiagonalMarqueeRiver.md) | web `routes/prints/PrintsGridGsap.jsx` (inline) | 2026-07-03 | draft (store · GSAP diagonal marquee grid) |
| [ScrollDriftGallery](ScrollDriftGallery.md) | web `routes/prints/PrintsExperimental.jsx` (inline) | 2026-07-03 | draft (store · scroll-scrub horizontal gallery) |
| [ProductDetailLayout](ProductDetailLayout.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · PDP scaffold · slots PrintBuyButton) |
| [Canvas](Canvas.md) | brand `editor/shell/Canvas.jsx` | 2026-07-03 | draft (editor · aspect/pan/virtual-px stage · no DS canvas) |
| [SelectionOverlay](SelectionOverlay.md) | brand `editor/compose/SelectionOverlay.jsx` | 2026-07-03 | draft (editor · transform handles · box prop) |
| [EditorShell](EditorShell.md) | brand `editor/EditorShell.jsx` | 2026-07-03 | draft (editor · 2-rail layout + panel registry) |
| [TabsRow](TabsRow.md) | brand `editor/color/PanelTabs.jsx` | 2026-07-03 | draft (editor · underline tabs · DS has no Tabs) |
| [CurveOverlay](CurveOverlay.md) | brand `editor/modes/type/CurveOverlay.jsx` | 2026-07-03 | draft (editor · SVG curve/easing editor) |
| [FullBleedHero](FullBleedHero.md) | web `components/sections/shared/FullBleedHero.jsx` | 2026-07-03 | draft (layout · generic hero · pairs OverlayGlassPanel) |
| [OverlayGlassPanel](OverlayGlassPanel.md) | web (4× inline: StudioHero/StudioAboutCard/FeaturedCarousel/TypefacePage) | 2026-07-03 | draft (layout · glass content card · dedupe 4×) |
| [FeaturedCarousel](FeaturedCarousel.md) | web `components/sections/shared/FeaturedCarousel.jsx` | 2026-07-03 | draft (layout · converge INTO @kol/ui FeaturedItemsCarousel) |
| [FramedMediaBand](FramedMediaBand.md) | web `routes/foundry/components/TypefacePage.jsx` (5× inline) | 2026-07-03 | draft (layout · framed media band · dedupe 5×) |
| [FeaturesCardSection](FeaturesCardSection.md) | web `components/sections/shared/FeaturesCardSection.jsx` | 2026-07-03 | draft (layout · feature grid · dedupes 3 impls) |
| [CardFeatureItem](CardFeatureItem.md) | web `components/workshop/molecules/CardFeatureItem.jsx` | 2026-07-03 | draft (layout · feature card molecule) |
| [CtaGlobal](CtaGlobal.md) | web `components/sections/cta/CtaGlobal.jsx` | 2026-07-03 | draft (layout · editorial CTA band · DS gap) |
| [NewsletterBand](NewsletterBand.md) | web `components/sections/home/HomeSignup.jsx` | 2026-07-03 | draft (layout · subscribe band · DS gap) |
| [TailwindContentSource](TailwindContentSource.md) | kol-monorepo `apps/web/src/index.css` (packaging gap) | 2026-07-09 | **decided** (2026-07-09: `@source` consumer contract is permanent per ARCHITECTURE §4 — compilation rejected; canonical 9-line block in root README, per-package README sections stamped; icons included on evidence) |

## Processed

| Entry | Recreated as | Where | Date | Notes |
|-------|--------------|-------|------|-------|
| [MediaCard](done/MediaCard.md) | `MediaCard` molecule | `packages/component/src/molecules/MediaCard.jsx` | 2026-07-03 | Slot contract per spec; checkbox = passive `SelectIndicator` (same file), NOT ToggleCheckbox — the card is the click target, a nested real input double-fires. `downloadHref` kept as anchor. Demo + story + changeset staged. |
| [MediaRow](done/MediaRow.md) | `MediaRow` molecule | `packages/component/src/molecules/MediaRow.jsx` | 2026-07-03 | Shares `SelectIndicator` with MediaCard; column widths exposed as `dateWidth`/`sizeWidth` props (defaults `w-24`/`w-20`). Demo + story + changeset staged. |
| [@kolkrabbi/kol-media-client](done/kol-media-client.md) | `@kolkrabbi/kol-media-client` package | `packages/media-client/` | 2026-07-03 | First of the **clients tier** (ARCHITECTURE §3). Factory `createMediaClient({adminBase, publicBase, proxyPath})` + default prod instance; core + `proxied` + `formatSize` + optional `uploadToLibrary` (`saveToGallery` not ported, per spec). Changeset staged; publishes with the held batch. |
| [TypefaceHero](done/TypefaceHero.md) · [VariableFontSection](done/VariableFontSection.md) · [GlyphMetricsGrid](done/GlyphMetricsGrid.md) · [GlyphMetricsSection](done/GlyphMetricsSection.md) · [TypefaceStyleSection](done/TypefaceStyleSection.md) · [FontPreviewSection](done/FontPreviewSection.md) · [FoundryCharacterSets](done/FoundryCharacterSets.md) | foundry set | `packages/foundry/src/` | 2026-07-09 | Already recreated during the foundry extraction; user-confirmed at the lobby-wall triage. All render in `showcase/src/sets/foundry-specimen.jsx`. |
| [FoundrySection](done/FoundrySection.md) | `SpecimenSectionHeader` | `packages/foundry/src/SpecimenSectionHeader.jsx` | 2026-07-09 | Recreated under the spec's own "→ SpecimenSectionHeader" note. |
| [PortableTextRenderer](done/PortableTextRenderer.md) | `PortableTextRenderer` | `packages/content/src/PortableTextRenderer.jsx` | 2026-07-09 | Landed with the kol-content extraction (stack stream). |
| [SpectrumControls](done/SpectrumControls.md) · [SwatchControls](done/SwatchControls.md) | editor color kit | `packages/component/src/molecules/` | 2026-07-09 | Landed with the editor-kit sweep; user-confirmed ("already in the DS through the editor"). |
| [AlignmentGrid](done/AlignmentGrid.md) | `AlignmentGrid` | `packages/component/src/molecules/AlignmentGrid.jsx` | 2026-07-09 | Landed with the editor sweep on the DS Icon seam; alignment glyphs already in kol-icons (`stroke/layout/align*`). |
| [Placeholder](done/Placeholder.md) | `EmptyState` | `packages/component/src/atoms/EmptyState.jsx` | 2026-07-09 | Already recreated pre-triage (renamed — AssetPlaceholder owns "placeholder"; generic `eyebrow/title/body/footer` props per the spec's own notes). Wave-1 agent caught the duplicate and refused to re-build — correct. |
| [Ramp](done/Ramp.md) | `ColorRamp` `colors` prop | `packages/component/src/molecules/ColorRamp.jsx` | 2026-07-09 | ColorRamp's header records it merged the former Ramp (static-hex mode via `colors` — bare strings or `[name, color]` pairs). A wave-1 build was killed same-day as a duplicate. |
| [ButtonGroup](done/ButtonGroup.md) | `ButtonGroup` | `packages/component/src/molecules/ButtonGroup.jsx` | 2026-07-09 | Children-composition API (config array dropped — KOL composes children); `sm:${align}` interpolation bug fixed with static class maps; title on `kol-sans-heading-05` (source's `kol-heading-md` doesn't exist here); `taxonomy-ok:` exemption (imports no KOL component by design). |
| [ColorField](done/ColorField.md) · [SwatchRow](done/SwatchRow.md) | `ColorInputRow` (merged) | `packages/component/src/molecules/ColorInputRow.jsx` | 2026-07-09 | One swatch+hex core with additive slots (`refs` popover / `locked`+`tokenName`), per both specs' merge flags. Rewrote a narrower pre-existing ColorInputRow; surviving consumers' props preserved, per-keystroke emission guarded in the color-picker block. Refs arrive pre-resolved — no `palette:` convention. |
| [ImageLightbox](done/ImageLightbox.md) · [FullscreenGallery](done/FullscreenGallery.md) | `MediaViewer` + `MediaTileGallery` (one shared viewer) | `packages/component/src/organisms/` | 2026-07-09 | FullscreenOverlay shell + direct embla (Carousel has no controlled-index seam); parent-authoritative `index`/`onIndexChange`; overlay text on the inverse fg tier (scrim is surface-inverse); 4px chips reuse `.kol-embla-btn`; GalleryCarousel re-wired off the old `initialIndex`. Kills the hand-rolled swipe + capture-Escape hacks from both sources. |
| [ToolButton](done/ToolButton.md) | `SplitToolButton` (new half only) + DS Button `quiet`/`pressed` (toggle half) | `packages/component/src/molecules/SplitToolButton.jsx` | 2026-07-09 | Per the spec's own reconcile note: the 28×28 toggle is a Button preset, not a new atom (demo proves it). New: single-trigger arm-and-open split with fold-indicator corner glyph (inline 4px SVG — icon-set candidate). ⚠ Cross-referenced with the pre-existing two-button `ShapeDropdown` molecule — future reconciliation candidate. |
| [RotaryDial](done/RotaryDial.md) | `RotaryDial` (knob variant of Slider) | `packages/component/src/atoms/RotaryDial.jsx` | 2026-07-09 | Was already built; closed by the API marriage (user call) — shared contract `value/min/max/step/onChange/label/size/disabled/formatValue` with Slider, cross-referenced JSDoc, 15 call sites verified unbroken. Editable readout deliberately not ported (atoms nest no KOL component — validator law); `formatValue` covers it. |
| [TextPressure](done/TextPressure.md) · [TypeSample](done/TypeSample.md) · [TypeSpecCard](done/TypeSpecCard.md) · [ColorLoader](done/ColorLoader.md) | foundry move-of-four (user call) | `packages/foundry/src/` | 2026-07-09 | Font-facing set moved out of component (§3-safe: foundry→component only). CSS re-homed to a recreated `kol-components-foundry.css` (framework dupes deleted); foundry gains `framer-motion` peer. component 0.8.0 · foundry 0.3.0 · theme 0.7.3. |
| [LoaderOverlay](done/LoaderOverlay.md) | `LoaderOverlay` (`loader` slot) | `packages/component/src/organisms/LoaderOverlay.jsx` | 2026-07-09 | Its own "brand → slot" spec executed: hardcoded ColorLoader default → injected `loader` ReactNode (consumers pass foundry's ColorLoader); dead `onEnter` removed under the 0.8.0 breaking bump. |
