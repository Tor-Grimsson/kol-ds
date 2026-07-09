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
| [RotaryDial](RotaryDial.md) | web `components/workshop/molecules/RotaryDial.jsx` | 2026-07-03 | draft |
| [ErrorBoundary](ErrorBoundary.md) | web `components/errors/ErrorBoundary.jsx` | 2026-07-03 | draft |
| [DocsToc](DocsToc.md) | web `components/workshop/docs/DocsToc.jsx` | 2026-07-03 | draft (reconcile → useScrollSpy) |
| [AsciiCursor](AsciiCursor.md) | web `components/ui/AsciiCursor.jsx` | 2026-07-03 | draft (effect · framer-motion) |
| [AnimatedTitle](AnimatedTitle.md) | web `components/animation/AnimatedTitle.jsx` | 2026-07-03 | draft (effect · gsap ScrollTrigger) |
| [InteractiveImage](InteractiveImage.md) | web `components/media/InteractiveImage.jsx` | 2026-07-03 | draft (effect · orphaned) |
| [TiltCard](TiltCard.md) | web `components/animation/TiltCard.jsx` | 2026-07-03 | draft (effect · hook promotes with it) |
| [TextPressure](TextPressure.md) | web `components/react-bits/TextPressure.jsx` | 2026-07-03 | draft (effect · collapse 3 variants) |
| [PageSection](PageSection.md) | brand `components/framework/PageSection.jsx` | 2026-07-03 | draft (rename vs DS Section) |
| [FeatureSplit](FeatureSplit.md) | brand `components/styleguide/FeatureSplit.jsx` | 2026-07-03 | draft (CSS moves with it) |
| [AssetGrid](AssetGrid.md) | brand `components/styleguide/AssetGrid.jsx` | 2026-07-03 | draft (merge → DS Grid) |
| [EditorButton](EditorButton.md) | brand `editor/components/EditorButton.jsx` | 2026-07-03 | draft (Button `iconComponent` enhancement, not new atom) |
| [ImageLightbox](ImageLightbox.md) | web `components/work/ImageLightbox.jsx` | 2026-07-03 | draft (compose FullscreenOverlay + Carousel) |
| [FullscreenGallery](FullscreenGallery.md) | brand `components/styleguide/FullscreenGallery.jsx` | 2026-07-03 | draft (shares one viewer w/ ImageLightbox) |
| [TypeSample](TypeSample.md) | brand `components/styleguide/TypeSample.jsx` | 2026-07-03 | draft (type-specimen kit) |
| [TypeSpecCard](TypeSpecCard.md) | brand `components/styleguide/TypeSpecCard.jsx` | 2026-07-03 | draft (type-specimen kit) |
| [ProsePreview](ProsePreview.md) | brand `components/styleguide/ProsePreview.jsx` | 2026-07-03 | draft (→ ProseStylesViewer children) |
| [TypeScaleSection](TypeScaleSection.md) | brand `components/styleguide/TypeScaleSection.jsx` | 2026-07-03 | draft (thin · composes PageSection+Table) |
| [Ramp](Ramp.md) | brand `components/styleguide/Ramp.jsx` | 2026-07-03 | draft (color kit · compose ColorSwatch) |
| [SpectrumGrid](SpectrumGrid.md) | brand `components/styleguide/SpectrumGrid.jsx` | 2026-07-03 | draft (color kit · live CSS-var matrix) |
| [ColorRamp](ColorRamp.md) | brand `components/sections/ColorRamp.jsx` | 2026-07-03 | draft (color kit · extract resolveCssVar util) |
| [ShellLayout](ShellLayout.md) | web `components/shell/ShellLayout.jsx` | 2026-07-03 | draft (shell set · centerpiece organism) |
| [ShellHeader](ShellHeader.md) | web `components/shell/ShellHeader.jsx` | 2026-07-03 | draft (shell set · compose ThemeToggleButton) |
| [ShellSidebar](ShellSidebar.md) | web `components/shell/ShellSidebar.jsx` | 2026-07-03 | draft (shell set · compose SidebarMenuItem) |
| [ShellDrawer](ShellDrawer.md) | web `components/shell/ShellDrawer.jsx` | 2026-07-03 | draft (shell set · new drawer primitive) |
| [ShellSearchOverlay](ShellSearchOverlay.md) | web `components/shell/ShellSearchOverlay.jsx` | 2026-07-03 | draft (shell set · Cmd-K palette) |
| [Footer](Footer.md) | web `components/layout/Footer.jsx` | 2026-07-03 | draft (shell set · DS had no footer) |
| [GlyphMetricsGrid](GlyphMetricsGrid.md) | web `components/fontviewer/GlyphMetricsGrid.jsx` | 2026-07-03 | draft (foundry · reconcile vs fontviewer MetricsOverlay) |
| [GlyphMetricsSection](GlyphMetricsSection.md) | web `routes/foundry/components/GlyphMetricsSection.jsx` | 2026-07-03 | draft (foundry · axis playground) |
| [VariableFontSection](VariableFontSection.md) | web `routes/foundry/components/VariableFontSection.jsx` | 2026-07-03 | draft (foundry · extract useAxisAnimation) |
| [FoundrySection](FoundrySection.md) | web `routes/foundry/components/FoundrySection.jsx` | 2026-07-03 | draft (foundry · → SpecimenSectionHeader) |
| [TypefaceHero](TypefaceHero.md) | web `routes/foundry/components/TypefaceHero.jsx` | 2026-07-03 | draft (foundry · specimen hero) |
| [TypefaceStyleSection](TypefaceStyleSection.md) | web `routes/foundry/components/TypefaceStyleSection.jsx` | 2026-07-03 | draft (foundry · composes StylesGrid) |
| [FontPreviewSection](FontPreviewSection.md) | web `routes/foundry/components/FontPreviewSection.jsx` | 2026-07-03 | draft (foundry · composes FontPreviewItemAlt) |
| [FoundryCharacterSets](FoundryCharacterSets.md) | web `routes/foundry/components/FoundryCharacterSets.jsx` | 2026-07-03 | draft (foundry · composes GlyphCategory) |
| [ArticleHeader](ArticleHeader.md) | web `components/prose/layouts/ArticleHeader.jsx` | 2026-07-03 | draft (CMS · flat-prop masthead) |
| [BentoCard](BentoCard.md) | web `components/cards/BentoCard.jsx` | 2026-07-03 | draft (CMS · media card · needs useBentoTilt too) |
| [PortableTextRenderer](PortableTextRenderer.md) | web `components/prose/core/PortableTextBlog.jsx` | 2026-07-03 | draft (CMS · missing Sanity→React renderer set) |
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
| [ColorLoader](ColorLoader.md) | web `components/loaders/ColorLoader.jsx` | 2026-07-03 | draft (loader · brand → slot · uses TextPressure) |
| [LoaderOverlay](LoaderOverlay.md) | web `components/layout/LoaderOverlay.jsx` | 2026-07-03 | draft (loader · compose FullscreenOverlay) |
| [RouteLoader](RouteLoader.md) | web `components/layout/RouteLoader.jsx` | 2026-07-03 | draft (loader · no-op stub in source · spec'd intended) |
| [PriceDisplay](PriceDisplay.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · price atom · no DS twin · formatPrice bug flagged) |
| [SpecList](SpecList.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · spec/definition-list atom) |
| [DiagonalMarqueeRiver](DiagonalMarqueeRiver.md) | web `routes/prints/PrintsGridGsap.jsx` (inline) | 2026-07-03 | draft (store · GSAP diagonal marquee grid) |
| [ScrollDriftGallery](ScrollDriftGallery.md) | web `routes/prints/PrintsExperimental.jsx` (inline) | 2026-07-03 | draft (store · scroll-scrub horizontal gallery) |
| [ProductDetailLayout](ProductDetailLayout.md) | web `routes/prints/PrintDetail.jsx` (inline) | 2026-07-03 | draft (store · PDP scaffold · slots PrintBuyButton) |
| [Canvas](Canvas.md) | brand `editor/shell/Canvas.jsx` | 2026-07-03 | draft (editor · aspect/pan/virtual-px stage · no DS canvas) |
| [SelectionOverlay](SelectionOverlay.md) | brand `editor/compose/SelectionOverlay.jsx` | 2026-07-03 | draft (editor · transform handles · box prop) |
| [EditorShell](EditorShell.md) | brand `editor/EditorShell.jsx` | 2026-07-03 | draft (editor · 2-rail layout + panel registry) |
| [TabsRow](TabsRow.md) | brand `editor/color/PanelTabs.jsx` | 2026-07-03 | draft (editor · underline tabs · DS has no Tabs) |
| [Placeholder](Placeholder.md) | brand `editor/compose/inspectors/Placeholder.jsx` | 2026-07-03 | draft (editor · inspector empty-state atom) |
| [AlignmentGrid](AlignmentGrid.md) | brand `editor/compose/AlignmentPanel.jsx` | 2026-07-03 | draft (editor · align grid · onAlign seam) |
| [SpectrumControls](SpectrumControls.md) | brand `editor/color/SpectrumControls.jsx` | 2026-07-03 | draft (editor · HSV picker family · DS has no picker) |
| [SwatchControls](SwatchControls.md) | brand `editor/color/SwatchControls.jsx` | 2026-07-03 | draft (editor · paint-chip stack + eyedropper) |
| [ColorField](ColorField.md) | brand `editor/compose/inspectors/LayerInspector.jsx` | 2026-07-03 | draft (editor · color input + palette-ref popover) |
| [SwatchRow](SwatchRow.md) | brand `editor/compose/SwatchRow.jsx` | 2026-07-03 | draft (editor · color-slot row · dedupe w/ ColorField) |
| [ToolButton](ToolButton.md) | brand `editor/shell/panels/ToolPalette.jsx` | 2026-07-03 | draft (editor · icon toggle + ShapeDropdown · reconcile ControlButton) |
| [CurveOverlay](CurveOverlay.md) | brand `editor/modes/type/CurveOverlay.jsx` | 2026-07-03 | draft (editor · SVG curve/easing editor) |
| [FullBleedHero](FullBleedHero.md) | web `components/sections/shared/FullBleedHero.jsx` | 2026-07-03 | draft (layout · generic hero · pairs OverlayGlassPanel) |
| [StudioHero](StudioHero.md) | web `components/sections/studio/StudioHero.jsx` | 2026-07-03 | draft (layout · orphan · fold into FullBleedHero or drop) |
| [OverlayGlassPanel](OverlayGlassPanel.md) | web (4× inline: StudioHero/StudioAboutCard/FeaturedCarousel/TypefacePage) | 2026-07-03 | draft (layout · glass content card · dedupe 4×) |
| [FeaturedCarousel](FeaturedCarousel.md) | web `components/sections/shared/FeaturedCarousel.jsx` | 2026-07-03 | draft (layout · converge INTO @kol/ui FeaturedItemsCarousel) |
| [FramedMediaBand](FramedMediaBand.md) | web `routes/foundry/components/TypefacePage.jsx` (5× inline) | 2026-07-03 | draft (layout · framed media band · dedupe 5×) |
| [FeaturesCardSection](FeaturesCardSection.md) | web `components/sections/shared/FeaturesCardSection.jsx` | 2026-07-03 | draft (layout · feature grid · dedupes 3 impls) |
| [CardFeatureItem](CardFeatureItem.md) | web `components/workshop/molecules/CardFeatureItem.jsx` | 2026-07-03 | draft (layout · feature card molecule) |
| [CtaGlobal](CtaGlobal.md) | web `components/sections/cta/CtaGlobal.jsx` | 2026-07-03 | draft (layout · editorial CTA band · DS gap) |
| [NewsletterBand](NewsletterBand.md) | web `components/sections/home/HomeSignup.jsx` | 2026-07-03 | draft (layout · subscribe band · DS gap) |
| [ChapterNavigation](ChapterNavigation.md) | web `components/sections/shared/ChapterNavigation.jsx` | 2026-07-03 | draft (layout · TOC nav · LOW/dead · dedupe w/ DocsToc) |
| [TailwindContentSource](TailwindContentSource.md) | kol-monorepo `apps/web/src/index.css` (packaging gap) | 2026-07-09 | draft (build · @kolkrabbi pkgs ship utility JSX but no compiled CSS · 5 consumer @source lines · recommend compiling utilities into each pkg's CSS) |
| [ButtonGroup](ButtonGroup.md) | ui `molecules/ButtonGroup.jsx` | 2026-07-09 | draft (molecule · composes Button · array-config vs children API · dynamic-class align bug) |

## Processed

| Entry | Recreated as | Where | Date | Notes |
|-------|--------------|-------|------|-------|
| [MediaCard](done/MediaCard.md) | `MediaCard` molecule | `packages/component/src/molecules/MediaCard.jsx` | 2026-07-03 | Slot contract per spec; checkbox = passive `SelectIndicator` (same file), NOT ToggleCheckbox — the card is the click target, a nested real input double-fires. `downloadHref` kept as anchor. Demo + story + changeset staged. |
| [MediaRow](done/MediaRow.md) | `MediaRow` molecule | `packages/component/src/molecules/MediaRow.jsx` | 2026-07-03 | Shares `SelectIndicator` with MediaCard; column widths exposed as `dateWidth`/`sizeWidth` props (defaults `w-24`/`w-20`). Demo + story + changeset staged. |
| [@kolkrabbi/kol-media-client](done/kol-media-client.md) | `@kolkrabbi/kol-media-client` package | `packages/media-client/` | 2026-07-03 | First of the **clients tier** (ARCHITECTURE §3). Factory `createMediaClient({adminBase, publicBase, proxyPath})` + default prod instance; core + `proxied` + `formatSize` + optional `uploadToLibrary` (`saveToGallery` not ported, per spec). Changeset staged; publishes with the held batch. |
