---
title: The manifest tree
type: reference
status: active
updated: 2026-07-31
description: The declared sidebar, generated from the real sources — every category, chapter and page with its source path and renderer. Regenerate with pnpm extract:manifest.
aliases:
  - manifest-tree
tags:
  - domain/workflow
  - domain/design-system
related:
  - "[[INDEX|content pipeline]]"
  - "[[02-taxonomy|categories, chapters, pages]]"
  - "[[03-manifest|the nav manifest]]"
---

# The manifest tree

> **GENERATED — do not edit by hand.** `pnpm extract:manifest` rewrites this file from the filesystem. Editorial input (which categories exist, their order, and which non-vault routes sit inside a chapter) lives in `scripts/extract-manifest.mjs`; everything else is derived.

Row shape is [[03-manifest|the manifest's]]: label · path · source · render. Renderers are `vault` (DocumentationReader) · `mdx` (MdxDoc — markdown with live components) · `page` (a React route).

## DOCUMENTATION

the design system, documented. Source root: `docs/documentation`

### Category root

| Page | Path | Source | Render |
|---|---|---|---|
| KOL documentation | `/documentation/documentation-INDEX` | `docs/documentation/INDEX.md` | `vault` |

### Overview · `00-overview`

| Page | Path | Source | Render |
|---|---|---|---|
| Package topology — the eleven UI packages + clients tier | `/documentation/01-package-topology` | `docs/documentation/00-overview/01-package-topology.md` | `vault` |
| KOL design system — overview | `/documentation/00-overview-INDEX` | `docs/documentation/00-overview/INDEX.md` | `vault` |

### Foundations · `01-foundations`

| Page | Path | Source | Render |
|---|---|---|---|
| Foundations — the token system | `/documentation/01-tokens` | `docs/documentation/01-foundations/01-tokens.md` | `vault` |
| Color — anchors and ramps | `/documentation/02-color` | `docs/documentation/01-foundations/02-color.md` | `vault` |
| Type classes — the two families and when to use which | `/documentation/03-typography` | `docs/documentation/01-foundations/03-typography.md` | `vault` |
| Foundations — layout & breakpoints | `/documentation/04-layout-breakpoints` | `docs/documentation/01-foundations/04-layout-breakpoints.md` | `vault` |
| Foundations — layout systems registry | `/documentation/05-layout-systems` | `docs/documentation/01-foundations/05-layout-systems.md` | `vault` |
| Tokens (live) | `/foundations` | `showcase/src/pages/Foundations.jsx` | `page` |
| Color (live) | `/foundations/color` | `showcase/src/pages/FoundationsColor.jsx` | `page` |
| Typography (live) | `/foundations/typography` | `showcase/src/pages/FoundationsTypography.jsx` | `page` |

### Icons · `02-icons`

| Page | Path | Source | Render |
|---|---|---|---|
| Icon inventory — kol-icon-set-v1 names by group | `/documentation/02-icons-01-inventory` | `docs/documentation/02-icons/01-inventory.md` | `vault` |
| Icons — the loader, the set, and bring-your-own | `/documentation/02-icons-INDEX` | `docs/documentation/02-icons/INDEX.md` | `vault` |
| Icon gallery | `/icons` | `showcase/src/pages/Icons.jsx` | `page` |

### Components · `03-components`

| Page | Path | Source | Render |
|---|---|---|---|
| Component taxonomy — the two axes | `/documentation/00-taxonomy` | `docs/documentation/03-components/00-taxonomy.md` | `vault` |
| Components — the full inventory | `/documentation/03-components-01-inventory` | `docs/documentation/03-components/01-inventory.md` | `vault` |
| Component placement — where a new component goes | `/documentation/02-placement` | `docs/documentation/03-components/02-placement.md` | `vault` |
| Component taxonomy — audit & consolidation plan | `/documentation/03-taxonomy-audit-and-plan` | `docs/documentation/03-components/03-taxonomy-audit-and-plan.md` | `vault` |
| Diamond Tier — the battle-tested components | `/documentation/04-diamond-tier` | `docs/documentation/03-components/04-diamond-tier.md` | `vault` |
| Control chrome — the button law | `/documentation/05-control-chrome` | `docs/documentation/03-components/05-control-chrome.md` | `vault` |

### Compositions · `04-compositions`

| Page | Path | Source | Render |
|---|---|---|---|
| Blocks & sets — composed layers above components | `/documentation/01-blocks-and-sets` | `docs/documentation/04-compositions/01-blocks-and-sets.md` | `vault` |
| Reference shells | `/documentation/02-shells` | `docs/documentation/04-compositions/02-shells.md` | `vault` |
| Slug pages & the composition gallery — how a set/block lists every component it uses | `/documentation/03-slug-composition-gallery` | `docs/documentation/04-compositions/03-slug-composition-gallery.md` | `vault` |
| The workshop docs system — @kolkrabbi/kol-workshop | `/documentation/04-workshop-system` | `docs/documentation/04-compositions/04-workshop-system.md` | `vault` |
| Foundry components — the type-specimen apparatus | `/documentation/05-foundry-system` | `docs/documentation/04-compositions/05-foundry-system.md` | `vault` |
| Store system — the commerce package | `/documentation/06-store-system` | `docs/documentation/04-compositions/06-store-system.md` | `vault` |
| Content system — the CMS package (stack + work) | `/documentation/07-content-system` | `docs/documentation/04-compositions/07-content-system.md` | `vault` |
| Chess system — the analysis/play package | `/documentation/08-chess-system` | `docs/documentation/04-compositions/08-chess-system.md` | `vault` |
| Dashboards system — the analytics package | `/documentation/09-dashboards-system` | `docs/documentation/04-compositions/09-dashboards-system.md` | `vault` |
| Style-guide system — the brand-guide package | `/documentation/10-styleguide-system` | `docs/documentation/04-compositions/10-styleguide-system.md` | `vault` |

### Brand · `05-brand`

| Page | Path | Source | Render |
|---|---|---|---|
| Brand kit — the manifest schema and its satellites | `/documentation/05-brand-INDEX` | `docs/documentation/05-brand/INDEX.md` | `vault` |

### Research · `06-research`

| Page | Path | Source | Render |
|---|---|---|---|
| shadcn ⇄ KOL — system comparison & gap analysis | `/documentation/benchmark-INDEX` | `docs/documentation/06-research/benchmark/INDEX.md` | `vault` |
| The component workbench | `/documentation/01-component-workbench` | `docs/documentation/06-research/workflows/01-component-workbench.md` | `vault` |
| Workbench tools — cut-points on the stack | `/documentation/02-workbench-tools` | `docs/documentation/06-research/workflows/02-workbench-tools.md` | `vault` |
| The composition layer — behavior primitives + variants | `/documentation/03-composition-layer` | `docs/documentation/06-research/workflows/03-composition-layer.md` | `vault` |
| The token layer | `/documentation/04-tokens` | `docs/documentation/06-research/workflows/04-tokens.md` | `vault` |
| Distribution & consumption models | `/documentation/05-distribution` | `docs/documentation/06-research/workflows/05-distribution.md` | `vault` |
| Versioning & testing | `/documentation/06-versioning-testing` | `docs/documentation/06-research/workflows/06-versioning-testing.md` | `vault` |
| Design-system workflows — how other teams work | `/documentation/workflows-INDEX` | `docs/documentation/06-research/workflows/INDEX.md` | `vault` |

### Breakpoints · `08-breakpoints`

| Page | Path | Source | Render |
|---|---|---|---|
| Breakpoints — the values | `/documentation/01-breakpoints` | `docs/documentation/08-breakpoints/01-breakpoints.md` | `vault` |
| Breakpoints — best practices | `/documentation/02-best-practices` | `docs/documentation/08-breakpoints/02-best-practices.md` | `vault` |
| Breakpoints — testing methods | `/documentation/03-methods` | `docs/documentation/08-breakpoints/03-methods.md` | `vault` |
| Breakpoints — KOL-DS rules | `/documentation/04-kol-ds-rules` | `docs/documentation/08-breakpoints/04-kol-ds-rules.md` | `vault` |
| Breakpoints — the lookup | `/documentation/08-breakpoints-INDEX` | `docs/documentation/08-breakpoints/INDEX.md` | `vault` |

## COMPONENTS

derived from the package barrels — chapters are tiers. Source root: `packages/*/src/**/index.js`

### Atoms · 40

| Page | Path | Source | Render |
|---|---|---|---|
| AnimatedTitle | `/components/animated-title` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AssetGrid | `/components/asset-grid` | `showcase/src/docs/components/AssetGrid.mdx` | `mdx` |
| AssetPlaceholder | `/components/asset-placeholder` | `showcase/src/docs/components/AssetPlaceholder.mdx` | `mdx` |
| Avatar | `/components/avatar` | `showcase/src/docs/components/Avatar.mdx` | `mdx` |
| Badge | `/components/badge` | `showcase/src/docs/components/Badge.mdx` | `mdx` |
| Button | `/components/button` | `showcase/src/docs/components/Button.mdx` | `mdx` |
| CopyButton | `/components/copy-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CurveOverlay | `/components/curve-overlay` | `showcase/src/docs/components/CurveOverlay.mdx` | `mdx` |
| Divider | `/components/divider` | `showcase/src/docs/components/Divider.mdx` | `mdx` |
| DocsToc | `/components/docs-toc` | `showcase/src/docs/components/DocsToc.mdx` | `mdx` |
| DropdownTagFilter | `/components/dropdown-tag-filter` | `showcase/src/docs/components/DropdownTagFilter.mdx` | `mdx` |
| EmptyState | `/components/empty-state` | `showcase/src/docs/components/EmptyState.mdx` | `mdx` |
| ExitPreview | `/components/exit-preview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Figure | `/components/figure` | `showcase/src/docs/components/Figure.mdx` | `mdx` |
| FullscreenOverlay | `/components/fullscreen-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| HlsVideo | `/components/hls-video` | `showcase/src/docs/components/HlsVideo.mdx` | `mdx` |
| IconFrame | `/components/icon-frame` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Input | `/components/input` | `showcase/src/docs/components/Input.mdx` | `mdx` |
| Label | `/components/label` | `showcase/src/docs/components/Label.mdx` | `mdx` |
| LabeledControl | `/components/labeled-control` | `showcase/src/docs/components/LabeledControl.mdx` | `mdx` |
| OverlayGlassPanel | `/components/overlay-glass-panel` | `showcase/src/docs/components/OverlayGlassPanel.mdx` | `mdx` |
| Pill | `/components/pill` | `showcase/src/docs/components/Pill.mdx` | `mdx` |
| PopoverPanel | `/components/popover-panel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ProsePreview | `/components/prose-preview` | `showcase/src/docs/components/ProsePreview.mdx` | `mdx` |
| QuantityInput | `/components/quantity-input` | `showcase/src/docs/components/QuantityInput.mdx` | `mdx` |
| RotaryDial | `/components/rotary-dial` | `showcase/src/docs/components/RotaryDial.mdx` | `mdx` |
| SearchInput | `/components/search-input` | `showcase/src/docs/components/SearchInput.mdx` | `mdx` |
| Section | `/components/section` | `showcase/src/docs/components/Section.mdx` | `mdx` |
| SectionLabel | `/components/section-label` | `showcase/src/docs/components/SectionLabel.mdx` | `mdx` |
| SegmentedToggle | `/components/segmented-toggle` | `showcase/src/docs/components/SegmentedToggle.mdx` | `mdx` |
| Stepper | `/components/stepper` | `showcase/src/docs/components/Stepper.mdx` | `mdx` |
| Tag | `/components/tag` | `showcase/src/docs/components/Tag.mdx` | `mdx` |
| Textarea | `/components/textarea` | `showcase/src/docs/components/Textarea.mdx` | `mdx` |
| TiltCard | `/components/tilt-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ToggleBracket | `/components/toggle-bracket` | `showcase/src/docs/components/ToggleBracket.mdx` | `mdx` |
| ToggleCheckbox | `/components/toggle-checkbox` | `showcase/src/docs/components/ToggleCheckbox.mdx` | `mdx` |
| ToggleSwitch | `/components/toggle-switch` | `showcase/src/docs/components/ToggleSwitch.mdx` | `mdx` |
| Tooltip | `/components/tooltip` | `showcase/src/docs/components/Tooltip.mdx` | `mdx` |
| TransparentX | `/components/transparent-x` | `showcase/src/docs/components/TransparentX.mdx` | `mdx` |
| ViewToggle | `/components/view-toggle` | `showcase/src/docs/components/ViewToggle.mdx` | `mdx` |

### Molecules · 39

| Page | Path | Source | Render |
|---|---|---|---|
| Accordion | `/components/accordion` | `showcase/src/docs/components/Accordion.mdx` | `mdx` |
| AccordionPanel | `/components/accordion-panel` | `showcase/src/docs/components/AccordionPanel.mdx` | `mdx` |
| AlignmentGrid | `/components/alignment-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ButtonGroup | `/components/button-group` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CardFeatureItem | `/components/card-feature-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CodeBlock | `/components/code-block` | `showcase/src/docs/components/CodeBlock.mdx` | `mdx` |
| ColorInputRow | `/components/color-input-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColorRamp | `/components/color-ramp` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColorSwatch | `/components/color-swatch` | `showcase/src/docs/components/ColorSwatch.mdx` | `mdx` |
| Dropdown | `/components/dropdown` | `showcase/src/docs/components/Dropdown.mdx` | `mdx` |
| EyedropPick | `/components/eyedrop-pick` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FramedMediaBand | `/components/framed-media-band` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| HueStrip | `/components/hue-strip` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Image | `/components/image` | `showcase/src/docs/components/Image.mdx` | `mdx` |
| ImageBlock | `/components/image-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaCard | `/components/media-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaRow | `/components/media-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MenuDropdownDivider | `/components/menu-dropdown-divider` | `showcase/src/docs/components/MenuDropdownDivider.mdx` | `mdx` |
| MenuDropdownItem | `/components/menu-dropdown-item` | `showcase/src/docs/components/MenuDropdownItem.mdx` | `mdx` |
| MenuDropdownNest | `/components/menu-dropdown-nest` | `showcase/src/docs/components/MenuDropdownNest.mdx` | `mdx` |
| MenuItem | `/components/menu-item` | `showcase/src/docs/components/MenuItem.mdx` | `mdx` |
| MenuPopover | `/components/menu-popover` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ModalProvider | `/components/modal-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PaletteHarmonyWheel | `/components/palette-harmony-wheel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PropertyInput | `/components/property-input` | `showcase/src/docs/components/PropertyInput.mdx` | `mdx` |
| SBSquare | `/components/sbsquare` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SelectionOverlay | `/components/selection-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShapeDropdown | `/components/shape-dropdown` | `showcase/src/docs/components/ShapeDropdown.mdx` | `mdx` |
| ShellDrawer | `/components/shell-drawer` | `showcase/src/docs/components/ShellDrawer.mdx` | `mdx` |
| ShellSearchOverlay | `/components/shell-search-overlay` | `showcase/src/docs/components/ShellSearchOverlay.mdx` | `mdx` |
| Slider | `/components/slider` | `showcase/src/docs/components/Slider.mdx` | `mdx` |
| SpecList | `/components/spec-list` | `showcase/src/docs/components/SpecList.mdx` | `mdx` |
| SpectrumControls | `/components/spectrum-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SplitToolButton | `/components/split-tool-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SwatchControls | `/components/swatch-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SwatchStack | `/components/swatch-stack` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TabsRow | `/components/tabs-row` | `showcase/src/docs/components/TabsRow.mdx` | `mdx` |
| VideoBlock | `/components/video-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WheelTriangle | `/components/wheel-triangle` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Organisms · 22

| Page | Path | Source | Render |
|---|---|---|---|
| AsciiCursor | `/components/ascii-cursor` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| BentoCard | `/components/bento-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Canvas | `/components/canvas` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CanvasFrame | `/components/canvas-frame` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Carousel | `/components/carousel` | `showcase/src/docs/components/Carousel.mdx` | `mdx` |
| ContentFilters | `/components/content-filters` | `showcase/src/docs/components/ContentFilters.mdx` | `mdx` |
| CtaGlobal | `/components/cta-global` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| EditorShell | `/components/editor-shell` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ErrorBoundary | `/components/error-boundary` | `showcase/src/docs/components/ErrorBoundary.mdx` | `mdx` |
| FeaturedCarousel | `/components/featured-carousel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FeaturesCardSection | `/components/features-card-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FeatureSplit | `/components/feature-split` | `showcase/src/docs/components/FeatureSplit.mdx` | `mdx` |
| FoundryCTA | `/components/foundry-cta` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FullBleedHero | `/components/full-bleed-hero` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GalleryCarousel | `/components/gallery-carousel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LoaderOverlay | `/components/loader-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaTileGallery | `/components/media-tile-gallery` | `showcase/src/docs/components/MediaTileGallery.mdx` | `mdx` |
| MediaViewer | `/components/media-viewer` | `showcase/src/docs/components/MediaViewer.mdx` | `mdx` |
| NewsletterBand | `/components/newsletter-band` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PanViewport | `/components/pan-viewport` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SpectrumGrid | `/components/spectrum-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Table | `/components/table` | `showcase/src/docs/components/Table.mdx` | `mdx` |

### Chess · 18

| Page | Path | Source | Render |
|---|---|---|---|
| AlternativeControlsMock | `/components/alternative-controls-mock` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessAnalysisLayout | `/components/chess-analysis-layout` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessBoard | `/components/chess-board` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessBoardFullscreen | `/components/chess-board-fullscreen` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessBoardWithControls | `/components/chess-board-with-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessBoardWithSidebar | `/components/chess-board-with-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessControlsProvider | `/components/chess-controls-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessHero | `/components/chess-hero` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessPiece | `/components/chess-piece` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ChessSidebar | `/components/chess-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GameArchiveTable | `/components/game-archive-table` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GamePicker | `/components/game-picker` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MaterialSummary | `/components/material-summary` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| NotationPanel | `/components/notation-panel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PiecePalette | `/components/piece-palette` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PlaybackControls | `/components/playback-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SetupPanel | `/components/setup-panel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| VariationTree | `/components/variation-tree` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Component · 1

| Page | Path | Source | Render |
|---|---|---|---|
| Graphic | `/components/graphic` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Content · 12

| Page | Path | Source | Render |
|---|---|---|---|
| ArticleCard | `/components/article-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ArticleHeader | `/components/article-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AuthorLine | `/components/author-line` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ParallaxShelf | `/components/parallax-shelf` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PortableTextRenderer | `/components/portable-text-renderer` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ScrollDriftGallery | `/components/scroll-drift-gallery` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShareButtons | `/components/share-buttons` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SourcesReferences | `/components/sources-references` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| StackHero | `/components/stack-hero` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkCard | `/components/work-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkListItem | `/components/work-list-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkViewToggle | `/components/work-view-toggle` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Dashboards · 19

| Page | Path | Source | Render |
|---|---|---|---|
| Candlestick | `/components/candlestick` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashAlertCard | `/components/dash-alert-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashboardGrid | `/components/dashboard-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashChartCard | `/components/dash-chart-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashFeaturedCard | `/components/dash-featured-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashListCard | `/components/dash-list-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashMetricCard | `/components/dash-metric-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashSlotCard | `/components/dash-slot-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashStackedBarCard | `/components/dash-stacked-bar-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashTableCard | `/components/dash-table-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DashTooltip | `/components/dash-tooltip` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DonutChart | `/components/donut-chart` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GridCard | `/components/grid-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Heatmap | `/components/heatmap` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Histogram | `/components/histogram` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LineChart | `/components/line-chart` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MetricsDashboard | `/components/metrics-dashboard` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ScatterPlot | `/components/scatter-plot` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Sparkline | `/components/sparkline` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Foundry · 21

| Page | Path | Source | Render |
|---|---|---|---|
| ColorLoader | `/components/color-loader` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontPreviewSection | `/components/font-preview-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontViewerComponent | `/components/font-viewer-component` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontViewerSection | `/components/font-viewer-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FoundryCharacterSets | `/components/foundry-character-sets` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphItem | `/components/glyph-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphMetricsGrid | `/components/glyph-metrics-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphMetricsSection | `/components/glyph-metrics-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SpecimenSectionHeader | `/components/specimen-section-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TextPressure | `/components/text-pressure` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceHero | `/components/typeface-hero` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceLibraryGrid | `/components/typeface-library-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceLibraryGridWithVariables | `/components/typeface-library-grid-with-variables` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceLibraryItem | `/components/typeface-library-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceSpecimenPage | `/components/typeface-specimen-page` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceStyleSection | `/components/typeface-style-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceVariablePreview | `/components/typeface-variable-preview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypeSample | `/components/type-sample` | `showcase/src/docs/components/TypeSample.mdx` | `mdx` |
| TypeSpecCard | `/components/type-spec-card` | `showcase/src/docs/components/TypeSpecCard.mdx` | `mdx` |
| TypeSpecimenLive | `/components/type-specimen-live` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| VariableFontSection | `/components/variable-font-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Framework · 12

| Page | Path | Source | Render |
|---|---|---|---|
| AppShell | `/components/app-shell` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| BrandHero | `/components/brand-hero` | `showcase/src/docs/components/BrandHero.mdx` | `mdx` |
| Layout | `/components/layout` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PageSection | `/components/page-section` | `showcase/src/docs/components/PageSection.mdx` | `mdx` |
| PortalFooter | `/components/portal-footer` | `showcase/src/docs/components/PortalFooter.mdx` | `mdx` |
| ScrollToTop | `/components/scroll-to-top` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellHeader | `/components/shell-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocCollapsedContext | `/components/shell-toc-collapsed-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocContext | `/components/shell-toc-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SideNav | `/components/side-nav` | `showcase/src/docs/components/SideNav.mdx` | `mdx` |
| SubPageHero | `/components/sub-page-hero` | `showcase/src/docs/components/SubPageHero.mdx` | `mdx` |
| ThemeToggle | `/components/theme-toggle` | `showcase/src/docs/components/ThemeToggle.mdx` | `mdx` |

### Icons · 1

| Page | Path | Source | Render |
|---|---|---|---|
| Icon | `/components/icon` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Store · 7

| Page | Path | Source | Render |
|---|---|---|---|
| DiagonalMarqueeRiver | `/components/diagonal-marquee-river` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PriceDisplay | `/components/price-display` | `showcase/src/docs/components/PriceDisplay.mdx` | `mdx` |
| PrintBuyButton | `/components/print-buy-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PrintGridCard | `/components/print-grid-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PrintGridCardGsap | `/components/print-grid-card-gsap` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PrintsGrid | `/components/prints-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ProductDetailLayout | `/components/product-detail-layout` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Styleguide · 8

| Page | Path | Source | Render |
|---|---|---|---|
| AssetTable | `/components/asset-table` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ClearspaceDiagram | `/components/clearspace-diagram` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColorAnatomy | `/components/color-anatomy` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ComboLab | `/components/combo-lab` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LogoCard | `/components/logo-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LogoScaling | `/components/logo-scaling` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MoodTile | `/components/mood-tile` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypeBlock | `/components/type-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Workshop · 19

| Page | Path | Source | Render |
|---|---|---|---|
| DocFigure | `/components/doc-figure` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocHeader | `/components/doc-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocsArticle | `/components/docs-article` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocSection | `/components/doc-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocsFrontmatter | `/components/docs-frontmatter` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocsHeader | `/components/docs-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocTable | `/components/doc-table` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocumentationReader | `/components/documentation-reader` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellFullHeightContext | `/components/shell-full-height-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellLayout | `/components/shell-layout` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellSidebar | `/components/shell-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocCollapsedContext | `/components/shell-toc-collapsed-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocContext | `/components/shell-toc-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagGraph | `/components/tag-graph` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeGate | `/components/tag-mode-gate` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeOverlay | `/components/tag-mode-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeProvider | `/components/tag-mode-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkshopDefaultSidebar | `/components/workshop-default-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkshopSidebar | `/components/workshop-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

## OPERATIONS

repo machinery. Source root: `docs/operations`

### Category root

| Page | Path | Source | Render |
|---|---|---|---|
| Operations | `/documentation/operations-INDEX` | `docs/operations/INDEX.md` | `vault` |
| Shipped packages | `/documentation/SHIPPED-PACKAGES` | `docs/operations/SHIPPED-PACKAGES.md` | `vault` |

### Release · `01-release`

| Page | Path | Source | Render |
|---|---|---|---|
| The release pipeline | `/documentation/01-release-INDEX` | `docs/operations/01-release/INDEX.md` | `vault` |

### Workbench · `02-workbench`

| Page | Path | Source | Render |
|---|---|---|---|
| Using the workbench | `/documentation/02-workbench-INDEX` | `docs/operations/02-workbench/INDEX.md` | `vault` |

### Showcase · `03-showcase`

| Page | Path | Source | Render |
|---|---|---|---|
| Showcase recovery — audit findings and the quarantine roadmap | `/documentation/01-recovery-roadmap` | `docs/operations/03-showcase/01-recovery-roadmap.md` | `vault` |
| Doc + card sets — one role system, two entry points | `/documentation/02-doc-card-sets` | `docs/operations/03-showcase/02-doc-card-sets.md` | `vault` |

### Content pipeline · `04-content-pipeline`

| Page | Path | Source | Render |
|---|---|---|---|
| The seven content roots | `/documentation/01-sources` | `docs/operations/04-content-pipeline/01-sources.md` | `vault` |
| Categories, chapters, pages | `/documentation/02-taxonomy` | `docs/operations/04-content-pipeline/02-taxonomy.md` | `vault` |
| The nav manifest | `/documentation/03-manifest` | `docs/operations/04-content-pipeline/03-manifest.md` | `vault` |
| Conventions and gates | `/documentation/04-conventions` | `docs/operations/04-content-pipeline/04-conventions.md` | `vault` |
| Lookup | `/documentation/05-lookup` | `docs/operations/04-content-pipeline/05-lookup.md` | `vault` |
| The manifest tree | `/documentation/06-manifest-tree` | `docs/operations/04-content-pipeline/06-manifest-tree.md` | `vault` |
| The content pipeline | `/documentation/04-content-pipeline-INDEX` | `docs/operations/04-content-pipeline/INDEX.md` | `vault` |

## TOOLS

routes the app serves — not a body of material, so not a category in the strict sense; listed because they occupy rail space. Source root: `—`

| Page | Path | Source | Render |
|---|---|---|---|
| Blocks | `/blocks` | `showcase/src/blocks/` | `page` |
| Sets | `/sets` | `showcase/src/sets/` | `page` |
| References | `/references` | `showcase/src/usage/*.json` | `page` |
| Quarantine | `/quarantine` | `showcase/src/pages/Quarantine.jsx` | `page` |
| Shell & Layout | `/docs/shell-and-layout` | `showcase/src/docs/shell-and-layout.mdx` | `mdx` |
| Menus | `/docs/menus` | `showcase/src/docs/menus.mdx` | `mdx` |
| Loaders | `/docs/loaders` | `showcase/src/docs/loaders.mdx` | `mdx` |
| Type roles | `/docs/type-roles` | `showcase/src/docs/type-roles.mdx` | `mdx` |

## Totals

| | |
|---|---|
| Categories | 4 |
| Pages | 284 |
