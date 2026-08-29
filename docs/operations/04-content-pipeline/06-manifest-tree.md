---
title: The manifest tree
type: reference
status: active
created: 2026-07-31
updated: 2026-07-31
description: The declared sidebar, generated from the real sources
aliases:
  - manifest-tree
tags:
  - domain/content-pipeline
  - audience/agency-internal
  - pattern/docs-as-data
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
| Package topology | `/documentation/01-package-topology` | `docs/documentation/00-overview/01-package-topology.md` | `vault` |
| Package tiers | `/documentation/02-tiers` | `docs/documentation/00-overview/02-tiers.md` | `vault` |
| Installing KOL | `/documentation/03-install` | `docs/documentation/00-overview/03-install.md` | `vault` |
| Overview | `/documentation/00-overview-INDEX` | `docs/documentation/00-overview/INDEX.md` | `vault` |

### Foundations · `01-foundations`

| Page | Path | Source | Render |
|---|---|---|---|
| Tokens | `/documentation/01-tokens` | `docs/documentation/01-foundations/01-tokens.md` | `vault` |
| Color | `/documentation/02-color` | `docs/documentation/01-foundations/02-color.md` | `vault` |
| Type classes | `/documentation/03-typography` | `docs/documentation/01-foundations/03-typography.md` | `vault` |
| Layout & breakpoints | `/documentation/04-layout-breakpoints` | `docs/documentation/01-foundations/04-layout-breakpoints.md` | `vault` |
| Layout systems registry | `/documentation/05-layout-systems` | `docs/documentation/01-foundations/05-layout-systems.md` | `vault` |
| Code surface | `/documentation/06-code-surface` | `docs/documentation/01-foundations/06-code-surface.md` | `vault` |
| Doc & card sets | `/documentation/07-doc-card-sets` | `docs/documentation/01-foundations/07-doc-card-sets.md` | `vault` |
| Foundations | `/documentation/01-foundations-INDEX` | `docs/documentation/01-foundations/INDEX.md` | `vault` |

### Icons · `02-icons`

| Page | Path | Source | Render |
|---|---|---|---|
| Icon inventory | `/documentation/02-icons-01-inventory` | `docs/documentation/02-icons/01-inventory.md` | `vault` |
| Icon loader | `/documentation/02-loader` | `docs/documentation/02-icons/02-loader.md` | `vault` |
| Custom icons | `/documentation/03-custom` | `docs/documentation/02-icons/03-custom.md` | `vault` |
| Authoring an icon | `/documentation/04-authoring` | `docs/documentation/02-icons/04-authoring.md` | `vault` |
| Icons | `/documentation/02-icons-INDEX` | `docs/documentation/02-icons/INDEX.md` | `vault` |

### Components · `03-components`

| Page | Path | Source | Render |
|---|---|---|---|
| Component taxonomy | `/documentation/00-taxonomy` | `docs/documentation/03-components/00-taxonomy.md` | `vault` |
| Component inventory | `/documentation/03-components-01-inventory` | `docs/documentation/03-components/01-inventory.md` | `vault` |
| Component placement | `/documentation/02-placement` | `docs/documentation/03-components/02-placement.md` | `vault` |
| Taxonomy audit | `/documentation/03-taxonomy-audit-and-plan` | `docs/documentation/03-components/03-taxonomy-audit-and-plan.md` | `vault` |
| Diamond tier | `/documentation/04-diamond-tier` | `docs/documentation/03-components/04-diamond-tier.md` | `vault` |
| Control chrome | `/documentation/05-control-chrome` | `docs/documentation/03-components/05-control-chrome.md` | `vault` |
| The ContentCard system | `/documentation/06-content-card-system` | `docs/documentation/03-components/06-content-card-system.md` | `vault` |
| Components | `/documentation/03-components-INDEX` | `docs/documentation/03-components/INDEX.md` | `vault` |

### Compositions · `04-compositions`

| Page | Path | Source | Render |
|---|---|---|---|
| Blocks & sets | `/documentation/01-blocks-and-sets` | `docs/documentation/04-compositions/01-blocks-and-sets.md` | `vault` |
| Reference shells | `/documentation/02-shells` | `docs/documentation/04-compositions/02-shells.md` | `vault` |
| Composition gallery | `/documentation/03-slug-composition-gallery` | `docs/documentation/04-compositions/03-slug-composition-gallery.md` | `vault` |
| Workshop system | `/documentation/04-workshop-system` | `docs/documentation/04-compositions/04-workshop-system.md` | `vault` |
| Foundry system | `/documentation/05-foundry-system` | `docs/documentation/04-compositions/05-foundry-system.md` | `vault` |
| Store system | `/documentation/06-store-system` | `docs/documentation/04-compositions/06-store-system.md` | `vault` |
| Content system | `/documentation/07-content-system` | `docs/documentation/04-compositions/07-content-system.md` | `vault` |
| Chess system | `/documentation/08-chess-system` | `docs/documentation/04-compositions/08-chess-system.md` | `vault` |
| Dashboards system | `/documentation/09-dashboards-system` | `docs/documentation/04-compositions/09-dashboards-system.md` | `vault` |
| Style-guide system | `/documentation/10-styleguide-system` | `docs/documentation/04-compositions/10-styleguide-system.md` | `vault` |
| Shell system | `/documentation/11-shell-system` | `docs/documentation/04-compositions/11-shell-system.md` | `vault` |
| Section system | `/documentation/12-section-system` | `docs/documentation/04-compositions/12-section-system.md` | `vault` |
| Compositions | `/documentation/04-compositions-INDEX` | `docs/documentation/04-compositions/INDEX.md` | `vault` |

### Brand · `05-brand`

| Page | Path | Source | Render |
|---|---|---|---|
| Brand manifest | `/documentation/01-manifest` | `docs/documentation/05-brand/01-manifest.md` | `vault` |
| Brand packages | `/documentation/02-packages` | `docs/documentation/05-brand/02-packages.md` | `vault` |
| Feeding a brand | `/documentation/03-feeding` | `docs/documentation/05-brand/03-feeding.md` | `vault` |
| Brand kit | `/documentation/05-brand-INDEX` | `docs/documentation/05-brand/INDEX.md` | `vault` |

### Research · `06-research`

| Page | Path | Source | Render |
|---|---|---|---|
| shadcn ⇄ KOL | `/documentation/01-comparison` | `docs/documentation/06-research/01-comparison.md` | `vault` |
| Ranked gaps | `/documentation/02-gaps` | `docs/documentation/06-research/02-gaps.md` | `vault` |
| Rejected options | `/documentation/03-rejected` | `docs/documentation/06-research/03-rejected.md` | `vault` |
| Research | `/documentation/06-research-INDEX` | `docs/documentation/06-research/INDEX.md` | `vault` |

### Breakpoints · `08-breakpoints`

| Page | Path | Source | Render |
|---|---|---|---|
| Breakpoint values | `/documentation/01-values` | `docs/documentation/08-breakpoints/01-values.md` | `vault` |
| Breakpoint practices | `/documentation/02-best-practices` | `docs/documentation/08-breakpoints/02-best-practices.md` | `vault` |
| Breakpoint rules | `/documentation/04-kol-ds-rules` | `docs/documentation/08-breakpoints/04-kol-ds-rules.md` | `vault` |
| Breakpoints | `/documentation/08-breakpoints-INDEX` | `docs/documentation/08-breakpoints/INDEX.md` | `vault` |

## COMPONENTS

derived from the package barrels — chapters are tiers. Source root: `packages/*/src/**/index.js`

### Atoms · 28

| Page | Path | Source | Render |
|---|---|---|---|
| ActionButton | `/components/action-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AnimatedTitle | `/components/animated-title` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AudioPlayer | `/components/audio-player` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Avatar | `/components/avatar` | `showcase/src/docs/components/Avatar.mdx` | `mdx` |
| Badge | `/components/badge` | `showcase/src/docs/components/Badge.mdx` | `mdx` |
| Button | `/components/button` | `showcase/src/docs/components/Button.mdx` | `mdx` |
| ColorSwatch | `/components/color-swatch` | `showcase/src/docs/components/ColorSwatch.mdx` | `mdx` |
| CurveOverlay | `/components/curve-overlay` | `showcase/src/docs/components/CurveOverlay.mdx` | `mdx` |
| Divider | `/components/divider` | `showcase/src/docs/components/Divider.mdx` | `mdx` |
| Figure | `/components/figure` | `showcase/src/docs/components/Figure.mdx` | `mdx` |
| HlsVideo | `/components/hls-video` | `showcase/src/docs/components/HlsVideo.mdx` | `mdx` |
| IconFrame | `/components/icon-frame` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Image | `/components/image` | `showcase/src/docs/components/Image.mdx` | `mdx` |
| Input | `/components/input` | `showcase/src/docs/components/Input.mdx` | `mdx` |
| Label | `/components/label` | `showcase/src/docs/components/Label.mdx` | `mdx` |
| Pill | `/components/pill` | `showcase/src/docs/components/Pill.mdx` | `mdx` |
| RotaryDial | `/components/rotary-dial` | `showcase/src/docs/components/RotaryDial.mdx` | `mdx` |
| SectionLabel | `/components/section-label` | `showcase/src/docs/components/SectionLabel.mdx` | `mdx` |
| SegmentedToggle | `/components/segmented-toggle` | `showcase/src/docs/components/SegmentedToggle.mdx` | `mdx` |
| SelectionOverlay | `/components/selection-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SizeOrDownload | `/components/size-or-download` | `showcase/src/docs/components/SizeOrDownload.mdx` | `mdx` |
| SortHeader | `/components/sort-header` | `showcase/src/docs/components/SortHeader.mdx` | `mdx` |
| Tag | `/components/tag` | `showcase/src/docs/components/Tag.mdx` | `mdx` |
| Textarea | `/components/textarea` | `showcase/src/docs/components/Textarea.mdx` | `mdx` |
| ToggleBracket | `/components/toggle-bracket` | `showcase/src/docs/components/ToggleBracket.mdx` | `mdx` |
| ToggleCheckbox | `/components/toggle-checkbox` | `showcase/src/docs/components/ToggleCheckbox.mdx` | `mdx` |
| ToggleSwitch | `/components/toggle-switch` | `showcase/src/docs/components/ToggleSwitch.mdx` | `mdx` |
| ViewToggle | `/components/view-toggle` | `showcase/src/docs/components/ViewToggle.mdx` | `mdx` |

### Molecules · 62

| Page | Path | Source | Render |
|---|---|---|---|
| Accordion | `/components/accordion` | `showcase/src/docs/components/Accordion.mdx` | `mdx` |
| AccordionPanel | `/components/accordion-panel` | `showcase/src/docs/components/AccordionPanel.mdx` | `mdx` |
| AlignmentGrid | `/components/alignment-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AudioPreview | `/components/audio-preview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AudioSheet | `/components/audio-sheet` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AudioTile | `/components/audio-tile` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| BentoCard | `/components/bento-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CardFeatureItem | `/components/card-feature-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Carousel | `/components/carousel` | `showcase/src/docs/components/Carousel.mdx` | `mdx` |
| CodeBlock | `/components/code-block` | `showcase/src/docs/components/CodeBlock.mdx` | `mdx` |
| ColorInputRow | `/components/color-input-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColorRamp | `/components/color-ramp` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ContentCard | `/components/content-card` | `showcase/src/docs/components/ContentCard.mdx` | `mdx` |
| ContentItem | `/components/content-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ContentMedia | `/components/content-media` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ContentRow | `/components/content-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ContentText | `/components/content-text` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CopyButton | `/components/copy-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocFrontmatter | `/components/doc-frontmatter` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocPage | `/components/doc-page` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| DocsToc | `/components/docs-toc` | `showcase/src/docs/components/DocsToc.mdx` | `mdx` |
| Dropdown | `/components/dropdown` | `showcase/src/docs/components/Dropdown.mdx` | `mdx` |
| DropdownTagFilter | `/components/dropdown-tag-filter` | `showcase/src/docs/components/DropdownTagFilter.mdx` | `mdx` |
| EmblaNav | `/components/embla-nav` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| EmptyState | `/components/empty-state` | `showcase/src/docs/components/EmptyState.mdx` | `mdx` |
| EyedropPick | `/components/eyedrop-pick` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FieldRow | `/components/field-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ImageBlock | `/components/image-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| InspectorSection | `/components/inspector-section` | `showcase/src/docs/components/InspectorSection.mdx` | `mdx` |
| KindPreview | `/components/kind-preview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LabeledControl | `/components/labeled-control` | `showcase/src/docs/components/LabeledControl.mdx` | `mdx` |
| MediaCard | `/components/media-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaRow | `/components/media-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MenuDropdownDivider | `/components/menu-dropdown-divider` | `showcase/src/docs/components/MenuDropdownDivider.mdx` | `mdx` |
| MenuDropdownItem | `/components/menu-dropdown-item` | `showcase/src/docs/components/MenuDropdownItem.mdx` | `mdx` |
| MenuDropdownNest | `/components/menu-dropdown-nest` | `showcase/src/docs/components/MenuDropdownNest.mdx` | `mdx` |
| MenuItem | `/components/menu-item` | `showcase/src/docs/components/MenuItem.mdx` | `mdx` |
| MenuPopover | `/components/menu-popover` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ModalProvider | `/components/modal-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PaletteHarmonyWheel | `/components/palette-harmony-wheel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PlaybackBar | `/components/playback-bar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PropertyInput | `/components/property-input` | `showcase/src/docs/components/PropertyInput.mdx` | `mdx` |
| QuantityInput | `/components/quantity-input` | `showcase/src/docs/components/QuantityInput.mdx` | `mdx` |
| SearchInput | `/components/search-input` | `showcase/src/docs/components/SearchInput.mdx` | `mdx` |
| Section | `/components/section` | `showcase/src/docs/components/Section.mdx` | `mdx` |
| SectionCardItem | `/components/section-card-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SectionText | `/components/section-text` | `showcase/src/docs/components/SectionText.mdx` | `mdx` |
| ShapeDropdown | `/components/shape-dropdown` | `showcase/src/docs/components/ShapeDropdown.mdx` | `mdx` |
| ShellDrawer | `/components/shell-drawer` | `showcase/src/docs/components/ShellDrawer.mdx` | `mdx` |
| Slider | `/components/slider` | `showcase/src/docs/components/Slider.mdx` | `mdx` |
| SortControls | `/components/sort-controls` | `showcase/src/docs/components/SortControls.mdx` | `mdx` |
| SpecList | `/components/spec-list` | `showcase/src/docs/components/SpecList.mdx` | `mdx` |
| SplitToolButton | `/components/split-tool-button` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| StatusChip | `/components/status-chip` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Stepper | `/components/stepper` | `showcase/src/docs/components/Stepper.mdx` | `mdx` |
| SwatchControls | `/components/swatch-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SwatchStack | `/components/swatch-stack` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TabsRow | `/components/tabs-row` | `showcase/src/docs/components/TabsRow.mdx` | `mdx` |
| TiltBento | `/components/tilt-bento` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| VideoBlock | `/components/video-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| VideoSheet | `/components/video-sheet` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| VideoTile | `/components/video-tile` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Organisms · 43

| Page | Path | Source | Render |
|---|---|---|---|
| Canvas | `/components/canvas` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CanvasFrame | `/components/canvas-frame` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColumnBrowser | `/components/column-browser` | `showcase/src/docs/components/ColumnBrowser.mdx` | `mdx` |
| ContentCollection | `/components/content-collection` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ContentFilters | `/components/content-filters` | `showcase/src/docs/components/ContentFilters.mdx` | `mdx` |
| CtaGlobal | `/components/cta-global` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FeaturedCarousel | `/components/featured-carousel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FeaturesCardSection | `/components/features-card-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FeatureSplit | `/components/feature-split` | `showcase/src/docs/components/FeatureSplit.mdx` | `mdx` |
| FoundryCTA | `/components/foundry-cta` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FramedMediaBand | `/components/framed-media-band` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FullBleedHero | `/components/full-bleed-hero` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GalleryCarousel | `/components/gallery-carousel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| HueStrip | `/components/hue-strip` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LabeledControlSection | `/components/labeled-control-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaBrowser | `/components/media-browser` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaLibrary | `/components/media-library` | `showcase/src/docs/components/MediaLibrary.mdx` | `mdx` |
| MediaLibraryProvider | `/components/media-library-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaPicker | `/components/media-picker` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MediaTileGallery | `/components/media-tile-gallery` | `showcase/src/docs/components/MediaTileGallery.mdx` | `mdx` |
| MediaViewer | `/components/media-viewer` | `showcase/src/docs/components/MediaViewer.mdx` | `mdx` |
| NewsletterBand | `/components/newsletter-band` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PanViewport | `/components/pan-viewport` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| RecordManager | `/components/record-manager` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SBSquare | `/components/sbsquare` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SectionCards | `/components/section-cards` | `showcase/src/docs/components/SectionCards.mdx` | `mdx` |
| SectionCta | `/components/section-cta` | `showcase/src/docs/components/SectionCta.mdx` | `mdx` |
| SectionFaq | `/components/section-faq` | `showcase/src/docs/components/SectionFaq.mdx` | `mdx` |
| SectionHero | `/components/section-hero` | `showcase/src/docs/components/SectionHero.mdx` | `mdx` |
| SectionNewsletter | `/components/section-newsletter` | `showcase/src/docs/components/SectionNewsletter.mdx` | `mdx` |
| SectionSplit | `/components/section-split` | `showcase/src/docs/components/SectionSplit.mdx` | `mdx` |
| SettingsChipRow | `/components/settings-chip-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsChoice | `/components/settings-choice` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsFooter | `/components/settings-footer` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsMulti | `/components/settings-multi` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsPanel | `/components/settings-panel` | `showcase/src/docs/components/SettingsPanel.mdx` | `mdx` |
| SettingsRow | `/components/settings-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsSwitch | `/components/settings-switch` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellSearchOverlay | `/components/shell-search-overlay` | `showcase/src/docs/components/ShellSearchOverlay.mdx` | `mdx` |
| SpectrumControls | `/components/spectrum-controls` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SpectrumGrid | `/components/spectrum-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Table | `/components/table` | `showcase/src/docs/components/Table.mdx` | `mdx` |
| WheelTriangle | `/components/wheel-triangle` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

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

### Component · 16

| Page | Path | Source | Render |
|---|---|---|---|
| AsciiCursor | `/components/ascii-cursor` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AssetGrid | `/components/asset-grid` | `showcase/src/docs/components/AssetGrid.mdx` | `mdx` |
| AssetPlaceholder | `/components/asset-placeholder` | `showcase/src/docs/components/AssetPlaceholder.mdx` | `mdx` |
| ButtonGroup | `/components/button-group` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| EditorShell | `/components/editor-shell` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ErrorBoundary | `/components/error-boundary` | `showcase/src/docs/components/ErrorBoundary.mdx` | `mdx` |
| ExitPreview | `/components/exit-preview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FullscreenOverlay | `/components/fullscreen-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Graphic | `/components/graphic` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LoaderOverlay | `/components/loader-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| OverlayGlassPanel | `/components/overlay-glass-panel` | `showcase/src/docs/components/OverlayGlassPanel.mdx` | `mdx` |
| PopoverPanel | `/components/popover-panel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ProsePreview | `/components/prose-preview` | `showcase/src/docs/components/ProsePreview.mdx` | `mdx` |
| TiltCard | `/components/tilt-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Tooltip | `/components/tooltip` | `showcase/src/docs/components/Tooltip.mdx` | `mdx` |
| TransparentX | `/components/transparent-x` | `showcase/src/docs/components/TransparentX.mdx` | `mdx` |

### Content · 13

| Page | Path | Source | Render |
|---|---|---|---|
| ArticleCard | `/components/article-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ArticleHeader | `/components/article-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AuthorLine | `/components/author-line` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ListingCard | `/components/listing-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
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

### Foundry · 26

| Page | Path | Source | Render |
|---|---|---|---|
| ColorLoader | `/components/color-loader` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontPreviewSection | `/components/font-preview-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontViewerComponent | `/components/font-viewer-component` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FontViewerSection | `/components/font-viewer-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FoundryCharacterSets | `/components/foundry-character-sets` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FoundryOpentypeFeatures | `/components/foundry-opentype-features` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FoundryTypefaceDetails | `/components/foundry-typeface-details` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| FoundryTypefacePairing | `/components/foundry-typeface-pairing` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphItem | `/components/glyph-item` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphMetricsGrid | `/components/glyph-metrics-grid` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GlyphMetricsSection | `/components/glyph-metrics-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PairingCard | `/components/pairing-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SpecimenSectionHeader | `/components/specimen-section-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TextPressure | `/components/text-pressure` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypefaceAlphabet | `/components/typeface-alphabet` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
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

### Shell · 19

| Page | Path | Source | Render |
|---|---|---|---|
| AppShell | `/components/app-shell` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CatalogPage | `/components/catalog-page` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| GridCard | `/components/grid-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LabelRow | `/components/label-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Logomark | `/components/logomark` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| NavHiddenContext | `/components/nav-hidden-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| NavRail | `/components/nav-rail` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PageBleed | `/components/page-bleed` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PageHeader | `/components/page-header` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| PageShell | `/components/page-shell` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsColophon | `/components/settings-colophon` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsLinks | `/components/settings-links` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsScaffold | `/components/settings-scaffold` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsSection | `/components/settings-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| SettingsShortcuts | `/components/settings-shortcuts` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShortcutsOverlay | `/components/shortcuts-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TabStrip | `/components/tab-strip` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TouchDeviceOverlay | `/components/touch-device-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WalkthroughPanel | `/components/walkthrough-panel` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

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

### Styleguide · 14

| Page | Path | Source | Render |
|---|---|---|---|
| AppliedCard | `/components/applied-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| AssetTable | `/components/asset-table` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| CardRow | `/components/card-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ClearspaceDiagram | `/components/clearspace-diagram` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ColorAnatomy | `/components/color-anatomy` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ComboLab | `/components/combo-lab` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LogoCard | `/components/logo-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| LogoScaling | `/components/logo-scaling` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| MoodTile | `/components/mood-tile` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| QuadSplit | `/components/quad-split` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| RatioBar | `/components/ratio-bar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| StripeRow | `/components/stripe-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| Tower | `/components/tower` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TypeBlock | `/components/type-block` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

### Workshop · 29

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
| ExhibitCard | `/components/exhibit-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ExhibitLinkCard | `/components/exhibit-link-card` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ExhibitOverview | `/components/exhibit-overview` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ExhibitPage | `/components/exhibit-page` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ExhibitSidebar | `/components/exhibit-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| RailRow | `/components/rail-row` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| RailSection | `/components/rail-section` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| RightRail | `/components/right-rail` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellContentWidthContext | `/components/shell-content-width-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellFullHeightContext | `/components/shell-full-height-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellLayout | `/components/shell-layout` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellSidebar | `/components/shell-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocCollapsedContext | `/components/shell-toc-collapsed-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| ShellTocContext | `/components/shell-toc-context` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagGraph | `/components/tag-graph` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeGate | `/components/tag-mode-gate` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeOverlay | `/components/tag-mode-overlay` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagModeProvider | `/components/tag-mode-provider` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| TagPath | `/components/tag-path` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkshopDefaultSidebar | `/components/workshop-default-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |
| WorkshopSidebar | `/components/workshop-sidebar` | `showcase/src/pages/ComponentPage.jsx (generated)` | `page` |

## OPERATIONS

repo machinery. Source root: `docs/operations`

### Category root

| Page | Path | Source | Render |
|---|---|---|---|
| Operations | `/documentation/operations-INDEX` | `docs/operations/INDEX.md` | `vault` |

### Release · `01-release`

| Page | Path | Source | Render |
|---|---|---|---|
| Release setup | `/documentation/01-setup` | `docs/operations/01-release/01-setup.md` | `vault` |
| Shipped packages | `/documentation/02-shipped-packages` | `docs/operations/01-release/02-shipped-packages.md` | `vault` |
| Release troubleshooting | `/documentation/03-troubleshooting` | `docs/operations/01-release/03-troubleshooting.md` | `vault` |
| Retirements | `/documentation/04-retirements` | `docs/operations/01-release/04-retirements.md` | `vault` |
| Release pipeline | `/documentation/01-release-INDEX` | `docs/operations/01-release/INDEX.md` | `vault` |

### Workbench · `02-workbench`

| Page | Path | Source | Render |
|---|---|---|---|
| Starting the workbench | `/documentation/01-starting` | `docs/operations/02-workbench/01-starting.md` | `vault` |
| Browsing components | `/documentation/02-browsing` | `docs/operations/02-workbench/02-browsing.md` | `vault` |
| Authoring stories | `/documentation/03-authoring` | `docs/operations/02-workbench/03-authoring.md` | `vault` |
| Using the workbench | `/documentation/02-workbench-INDEX` | `docs/operations/02-workbench/INDEX.md` | `vault` |

### Showcase · `03-showcase`

| Page | Path | Source | Render |
|---|---|---|---|
| Showcase recovery | `/documentation/01-recovery-roadmap` | `docs/operations/03-showcase/01-recovery-roadmap.md` | `vault` |
| Root causes | `/documentation/02-root-causes` | `docs/operations/03-showcase/02-root-causes.md` | `vault` |
| Audit findings | `/documentation/03-audit-findings` | `docs/operations/03-showcase/03-audit-findings.md` | `vault` |
| Surface rules | `/documentation/04-surface-rules` | `docs/operations/03-showcase/04-surface-rules.md` | `vault` |
| Showcase | `/documentation/03-showcase-INDEX` | `docs/operations/03-showcase/INDEX.md` | `vault` |

### Content pipeline · `04-content-pipeline`

| Page | Path | Source | Render |
|---|---|---|---|
| Content roots | `/documentation/01-sources` | `docs/operations/04-content-pipeline/01-sources.md` | `vault` |
| Categories, chapters, pages | `/documentation/02-taxonomy` | `docs/operations/04-content-pipeline/02-taxonomy.md` | `vault` |
| Nav manifest | `/documentation/03-manifest` | `docs/operations/04-content-pipeline/03-manifest.md` | `vault` |
| Conventions and gates | `/documentation/04-conventions` | `docs/operations/04-content-pipeline/04-conventions.md` | `vault` |
| Content-pipeline lookup | `/documentation/05-lookup` | `docs/operations/04-content-pipeline/05-lookup.md` | `vault` |
| The manifest tree | `/documentation/06-manifest-tree` | `docs/operations/04-content-pipeline/06-manifest-tree.md` | `vault` |
| Content pipeline | `/documentation/04-content-pipeline-INDEX` | `docs/operations/04-content-pipeline/INDEX.md` | `vault` |

### Reference graph · `05-reference-graph`

| Page | Path | Source | Render |
|---|---|---|---|
| Reference-graph pipeline | `/documentation/01-pipeline` | `docs/operations/05-reference-graph/01-pipeline.md` | `vault` |
| Star scale | `/documentation/02-scale` | `docs/operations/05-reference-graph/02-scale.md` | `vault` |
| Using the graph | `/documentation/03-using-it` | `docs/operations/05-reference-graph/03-using-it.md` | `vault` |
| Reference graph | `/documentation/05-reference-graph-INDEX` | `docs/operations/05-reference-graph/INDEX.md` | `vault` |

### Workflows · `06-workflows`

| Page | Path | Source | Render |
|---|---|---|---|
| Component workbench | `/documentation/01-component-workbench` | `docs/operations/06-workflows/01-component-workbench.md` | `vault` |
| Workbench tools | `/documentation/02-workbench-tools` | `docs/operations/06-workflows/02-workbench-tools.md` | `vault` |
| Composition layer | `/documentation/03-composition-layer` | `docs/operations/06-workflows/03-composition-layer.md` | `vault` |
| Token layer | `/documentation/04-tokens` | `docs/operations/06-workflows/04-tokens.md` | `vault` |
| Distribution models | `/documentation/05-distribution` | `docs/operations/06-workflows/05-distribution.md` | `vault` |
| Versioning & testing | `/documentation/06-versioning-testing` | `docs/operations/06-workflows/06-versioning-testing.md` | `vault` |
| Breakpoint testing | `/documentation/07-device-testing` | `docs/operations/06-workflows/07-device-testing.md` | `vault` |
| Design-system workflows | `/documentation/06-workflows-INDEX` | `docs/operations/06-workflows/INDEX.md` | `vault` |

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
| Pages | 400 |
