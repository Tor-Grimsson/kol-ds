/**
 * @kol/component - Canonical KOL design-system primitives
 *
 * Shared atoms/molecules/organisms consumed by both apps/web (via @kol/ui
 * re-export) and apps/brand. Components emit canonical kol-* classes; CSS
 * lives in @kol/theme (kol-components-*.css).
 *
 * Placement follows the taxonomy rules in
 * docs/documentation/02-components/02-placement.md:
 *   atom     — nests no KOL component (kol-icons Icon/Graphic are
 *              infrastructure, they don't count)
 *   molecule — nests at least one KOL component
 *   organism — a self-contained composed UI region
 * `scripts/validate-taxonomy.mjs` enforces the closed folder set and the
 * downward-only import rule (atoms never import molecules/organisms).
 */

// atoms
export { default as AnimatedTitle } from './atoms/AnimatedTitle.jsx'
export { default as AssetGrid } from './utilities/AssetGrid.jsx'
export { default as AssetPlaceholder } from './utilities/AssetPlaceholder.jsx'
export { default as Avatar } from './atoms/Avatar.jsx'
export { default as Badge } from './atoms/Badge.jsx'
export { default as Button } from './atoms/Button.jsx'
export { default as CloseButton } from './utilities/CloseButton.jsx'
export { default as ActionButton } from './atoms/ActionButton.jsx'
export { default as FileIcon } from './atoms/FileIcon.jsx'
export { default as SizeOrDownload } from './atoms/SizeOrDownload.jsx'
export { default as SortHeader } from './atoms/SortHeader.jsx'
export { default as SortControls } from './molecules/SortControls.jsx'
export { default as CopyButton } from './molecules/CopyButton.jsx'
export { default as CurveOverlay } from './atoms/CurveOverlay.jsx'
export { default as Divider } from './atoms/Divider.jsx'
export { default as DocsToc } from './molecules/DocsToc.jsx'
export { default as DropdownTagFilter } from './molecules/DropdownTagFilter.jsx'
export { default as EmptyState } from './molecules/EmptyState.jsx'
export { default as IconFrame } from './atoms/IconFrame.jsx'
export { default as ExitPreview } from './utilities/ExitPreview.jsx'
export { default as Figure } from './atoms/Figure.jsx'
export { default as FullscreenOverlay } from './utilities/FullscreenOverlay.jsx'
export { default as HlsVideo } from './atoms/HlsVideo.jsx'
/* AudioPlayer — HlsVideo's opposite number: same tier and shape, inverted
 * intent (built to be operated, not decorative). See its header before editing
 * either one. */
export { default as AudioPlayer } from './atoms/AudioPlayer.jsx'
export { default as Input } from './atoms/Input.jsx'
export { default as Label } from './atoms/Label.jsx'
export { default as LabeledControl } from './molecules/LabeledControl.jsx'
export { default as OverlayGlassPanel } from './utilities/OverlayGlassPanel.jsx'
export { default as Pill } from './atoms/Pill.jsx'
export { usePopover, PopoverPanel, Tooltip } from './utilities/Popover.jsx'
export { default as ContextMenu, useContextMenu } from './utilities/ContextMenu.jsx'
export { default as ProsePreview } from './utilities/ProsePreview.jsx'
export { default as QuantityInput } from './molecules/QuantityInput.jsx'
export { default as RotaryDial } from './atoms/RotaryDial.jsx'
export { default as SearchInput } from './molecules/SearchInput.jsx'
export { default as InspectorSection, default as Section } from './molecules/InspectorSection.jsx'
export { default as SectionText } from './molecules/SectionText.jsx'
export { default as SectionLabel } from './atoms/SectionLabel.jsx'
export { default as SegmentedToggle } from './atoms/SegmentedToggle.jsx'
export { default as Stepper } from './molecules/Stepper.jsx'
export { default as Tag } from './atoms/Tag.jsx'
export { default as Textarea } from './atoms/Textarea.jsx'
export { default as ToggleBracket } from './atoms/ToggleBracket.jsx'
export { default as ToggleCheckbox } from './atoms/ToggleCheckbox.jsx'
export { default as ToggleSwitch } from './atoms/ToggleSwitch.jsx'
export { default as TiltCard } from './utilities/TiltCard.jsx'
export { default as TransparentX } from './utilities/TransparentX.jsx'
export { default as ViewToggle } from './atoms/ViewToggle.jsx'
/* the design-editor parts, taken per row from editor-panels-the-held-specs (2026-09-03) */
export { default as XYPad } from './atoms/XYPad.jsx'
export { default as InspectorRail } from './molecules/InspectorRail.jsx'
/* SelectionOverlay's two siblings — same 1080-virtual contract, same zoom
 * division (editor-panels-the-held-specs B2). `pathMath` is their geometry,
 * exported because the editor engine re-exports it rather than keep a copy. */
export { default as PathNodeOverlay } from './atoms/PathNodeOverlay.jsx'
export { default as CropOverlay } from './atoms/CropOverlay.jsx'
export { default as LayerStack, AddLayerButton, BLEND_MODES } from './organisms/LayerStack.jsx'
export { TYPE_LABELS, BOOL_OP_LABELS, SHAPE_KIND_LABELS, labelForLayer, rowLabelForLayer, findLayerDeep } from './hooks/layerTree.js'
export { default as TimelineDock, sampleTrack, TIMELINE_EASINGS } from './organisms/TimelineDock.jsx'
export { default as CurveEditor, CURVE_KINDS, defaultCurveFor } from './organisms/CurveEditor.jsx'
export { default as KeyframeEditor, KEYFRAME_EASES, DEFAULT_KEYFRAMES } from './organisms/KeyframeEditor.jsx'
export { pathD, pathBounds, shiftNode, normalizePath, scalePathNodes, normalizePathRings, rotatePathNodes, dist, nearestSegmentT, splitSegment, smoothNode } from './hooks/pathMath.js'

// molecules
export { Accordion, AccordionPanel } from './molecules/Accordion.jsx'
export { default as ButtonGroup } from './utilities/ButtonGroup.jsx'
/* monorepo sets (P6–P10) — molecule members */
export { default as AlignmentGrid } from './molecules/AlignmentGrid.jsx'
export { default as ImageBlock } from './molecules/ImageBlock.jsx'
export { default as SelectionOverlay } from './atoms/SelectionOverlay.jsx'
export { default as VideoBlock, getEmbedUrl } from './molecules/VideoBlock.jsx'
export { default as SectionCardItem, default as CardFeatureItem } from './molecules/SectionCardItem.jsx'
export { default as CodeBlock } from './molecules/CodeBlock.jsx'
export { default as ColorInputRow } from './molecules/ColorInputRow.jsx'
export { default as ColorRamp } from './molecules/ColorRamp.jsx'
export { default as ColorSwatch } from './atoms/ColorSwatch.jsx'
export { default as Dropdown } from './molecules/Dropdown.jsx'
export { default as FieldRow, StatusChip } from './molecules/FieldRow.jsx'
export { default as FramedMediaBand } from './organisms/FramedMediaBand.jsx'
export { default as Image } from './atoms/Image.jsx'

/* content-card system (2026-08-15) — the ruled card/row family:
 * docs/documentation/03-components/06-content-card-system.md */
export { default as ContentText } from './molecules/ContentText.jsx'
export { default as ContentMedia } from './molecules/ContentMedia.jsx'
export { default as ContentCard } from './molecules/ContentCard.jsx'
export { default as ContentRow } from './molecules/ContentRow.jsx'
export { default as ContentItem } from './molecules/ContentItem.jsx'
export { default as ContentCollection } from './organisms/ContentCollection.jsx'
export { MenuItem, MenuDropdownItem, MenuDropdownDivider, MenuDropdownNest } from './molecules/MenuItem.jsx'
export { MenuPopover } from './molecules/MenuPopover.jsx'
export { ModalProvider, useModal } from './molecules/Modal.jsx'
export { default as PaletteHarmonyWheel } from './molecules/PaletteHarmonyWheel.jsx'
export { default as PropertyInput } from './molecules/PropertyInput.jsx'
export { default as ShapeDropdown } from './molecules/ShapeDropdown.jsx'
export { default as ShellDrawer } from './molecules/ShellDrawer.jsx'
export { default as ShellSearchOverlay } from './organisms/ShellSearchOverlay.jsx'
export { default as Slider } from './molecules/Slider.jsx'
export { default as SpecList } from './molecules/SpecList.jsx'
export { default as SpectrumControls, HueStrip, SBSquare, WheelTriangle } from './organisms/SpectrumControls.jsx'
export { default as SplitToolButton } from './molecules/SplitToolButton.jsx'
export { default as ToolPalette } from './organisms/ToolPalette.jsx'
export { default as DocumentEditor } from './organisms/DocumentEditor.jsx'
export { default as SwatchControls, SwatchStack, EyedropPick } from './molecules/SwatchControls.jsx'
export { default as TabsRow } from './molecules/TabsRow.jsx'

// organisms
/* monorepo sets (P6–P10) — organism members. Foundry members live in the
   standalone @kolkrabbi/kol-foundry package (with the type-specimen kit +
   live-font effects moved there 2026-07-09) — never re-exported here. */
/* `CanvasZoomContext` and `PanZoomViewport` are the load-bearing pair for an
 * editor: the viewport publishes the zoom, every piece of editing chrome reads
 * it. Absent from this barrel until 0.185.0, which is why the first port of
 * this set could not keep its chrome screen-constant. */
export { default as Canvas, CanvasFrame, PanViewport, PanZoomViewport, CanvasZoomContext, useFps, CANVAS_VIRTUAL_W, DEFAULT_ASPECTS, CANVAS_DEFAULTS } from './organisms/Canvas.jsx'
/* The rulers and the guides, public since 2026-09-03 (rulers-and-guides-are-private):
 * they measure the RENDERED rect, so they work over a CSS-zoomed stage with no
 * PanZoomViewport anywhere — which is their second consumer on day one. */
export { CanvasRuler, CanvasGuides, useFrameGeom, niceStep, ticksFor } from './organisms/Canvas.jsx'
export { default as EditorShell } from './utilities/EditorShell.jsx'
export { default as GalleryCarousel } from './organisms/GalleryCarousel.jsx'
export { default as AsciiCursor } from './utilities/AsciiCursor.jsx'
export { default as TiltBento, default as BentoCard } from './molecules/TiltBento.jsx'
export { default as Carousel } from './molecules/Carousel.jsx'
/* EmblaNav — THE prev/next pair. Exported so a consumer building its own embla
 * stage reaches for it instead of re-typing the button markup, which is how the
 * three in-package copies (and kol-website's CarouselNavigation) happened. */
export { default as EmblaNav } from './molecules/EmblaNav.jsx'
export { default as MobileTabBar, TABBAR_H } from './molecules/MobileTabBar.jsx'
export { default as ContentFilters } from './organisms/ContentFilters.jsx'
export { default as PageHeader } from './molecules/PageHeader.jsx'
export { default as ErrorBoundary } from './utilities/ErrorBoundary.jsx'
export { default as FeatureSplit } from './organisms/FeatureSplit.jsx'
export { default as FeaturedCarousel } from './organisms/FeaturedCarousel.jsx'
export { default as FeaturesCardSection } from './organisms/FeaturesCardSection.jsx'
export { default as SectionHero, default as FullBleedHero } from './organisms/SectionHero.jsx'
export { default as SectionSplit } from './organisms/SectionSplit.jsx'
export { default as SectionCards } from './organisms/SectionCards.jsx'
export { default as SectionCta, default as CtaGlobal } from './organisms/SectionCta.jsx'
export { default as SectionFaq } from './organisms/SectionFaq.jsx'
export { default as LoaderOverlay } from './utilities/LoaderOverlay.jsx'
/* dev chrome: name an element, agree on a cell, emit one sync line */
export { default as QuadrantSync } from './utilities/QuadrantSync.jsx'
export { default as MediaLibrary, MediaLibraryProvider, useMediaLibrary, MediaPicker } from './organisms/MediaLibrary.jsx'
/* the full-screen file viewer — public 2026-09-04 (user ruling): it already
 * rendered both mobile viewer views and was module-private, so every consumer
 * needing a phone viewer hand-rolled one. */
export { MediaInspector } from './organisms/MediaLibraryPages.jsx'
export { default as MediaLibraryExplorer } from './organisms/MediaLibraryExplorer.jsx'
export { default as MediaTileGallery } from './organisms/MediaTileGallery.jsx'
export { default as MediaViewer } from './organisms/MediaViewer.jsx'
export { default as SettingsPanel, LabeledControlSection, SettingsRow, SettingsSwitch, SettingsChoice, SettingsMulti, SettingsChipRow, SettingsFooter } from './organisms/SettingsPanel.jsx'
/* the settings BODY as data — one call for the page, the drawer and a sheet
 * (user 2026-09-03: "lets normalise a component they can grab") */
export { default as SettingsSections } from './organisms/SettingsSections.jsx'
export { default as SectionNewsletter } from './organisms/SectionNewsletter.jsx'
export { default as NewsletterBand } from './organisms/NewsletterBand.jsx'
export { default as ColumnBrowser } from './organisms/ColumnBrowser.jsx'
export { default as KindPreview } from './molecules/KindPreview.jsx'
export { default as AudioPreview, AudioTile, VideoTile, formatLength } from './molecules/AudioPreview.jsx'
export { default as VideoSheet } from './molecules/VideoSheet.jsx'
export { default as PlaybackBar } from './molecules/PlaybackBar.jsx'
export { default as AudioSheet } from './molecules/AudioSheet.jsx'
export { default as QuickLookFrame } from './molecules/QuickLookFrame.jsx'
export { default as MediaTile } from './molecules/MediaTile.jsx'
export { default as RowMenuButton } from './molecules/RowMenuButton.jsx'
export { default as DocPage } from './molecules/DocPage.jsx'
export { default as DocFrontmatter } from './molecules/DocFrontmatter.jsx'
export { default as ProfileCard } from './molecules/ProfileCard.jsx'
export { parseFrontmatter, splitFrontmatter, joinFrontmatter } from './utilities/frontmatter.js'
export { readDraft, writeDraft, clearDraft, listDrafts, moveDrafts, DRAFTS_EVENT } from './utilities/localDrafts.js'
export { readCover } from './utilities/id3.js'
export { kindOf, extOf, isSystemFile, KINDS, KIND_LABEL, DEFAULT_KINDS, isSegment, groupSegments, groupVariants, posterFor, partition } from './utilities/mediaKinds.js'
export { nearestRatio, RATIOS } from './utilities/ratios.js'
/* the grab gesture — shared so kol-shell's NavRail and kol-framework's
 * useDragResize wear ONE implementation (OneGrabGestureBothRails, 2026-08-30) */
export { default as useGrabEdge } from './hooks/useGrabEdge.js'
export { default as markdownToHtml, inlineToHtml } from './utilities/markdownToHtml.js'
export { default as formatSize } from './utilities/formatSize.js'
export { default as RecordManager } from './organisms/RecordManager.jsx'
export { default as SpectrumGrid } from './organisms/SpectrumGrid.jsx'
export { default as Table } from './organisms/Table.jsx'

// loaders (re-export — infrastructure, documented on /docs/loaders)
export { Icon } from '@kolkrabbi/kol-icons'

// graphics (SVG illustration loader — globs its own ./graphics/svg/**)
export { default as Graphic, GRAPHICS } from './graphics/Graphic.jsx'
export { GRAPHIC_RAW } from './graphics/graphicData.js'

/* The glyph ladders, exported 2026-08-01. They were internal, so anything
 * OUTSIDE this package that pairs an icon with a label had to hardcode a
 * number — the shell header's tabs took `size={14}`, foundry's section header
 * took `20`, and neither could reference the rule it was meant to follow.
 * Cross-package imports go through the `@kolkrabbi/*` specifier (ARCHITECTURE
 * §3), so an export is the only way another package can obey the ladder. */
export { SOLO, ADJACENT, INDICATOR, glyphSize, indicatorSize } from './hooks/glyphLadders.js'

// hooks
export { default as usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'
export { default as useReveal } from './hooks/useReveal.js'
export { default as useScrollSpy } from './hooks/useScrollSpy.js'
export { default as useTilt } from './hooks/useTilt.js'
export { default as usePlayback } from './hooks/usePlayback.js'
export { default as useCoarsePointer } from './hooks/useCoarsePointer.js'
export { default as useLongPress } from './hooks/useLongPress.js'
export { default as useInViewAttention } from './hooks/useInViewAttention.js'
export { default as useAxisAnimation } from './hooks/useAxisAnimation.js'
export { useEyedropper, pickFromCanvasElement } from './hooks/useEyedropper.js'
/* The general form of `useCoarsePointer` / `usePrefersReducedMotion` — for a
 * STRUCTURAL responsive fork, where the markup itself changes and a stylesheet
 * cannot express it (ColumnBrowserStackMode, 2026-09-03). Sizes stay Tailwind's. */
export { default as useMediaQuery } from './hooks/useMediaQuery.js'
/* The two seams kol-client-olina asked for by name after copying both
 * (export-and-history-want-packaging, 2026-09-04). The SVG BUILDER is
 * deliberately absent — it welds to an app's own layer schema. */
export { svgToPngBlob, inlineFontFaces, embedFontFace, downloadBlob } from './hooks/svgExport.js'
export { default as useHistory } from './hooks/useHistory.js'
/* The rail gesture's other half. It lived in kol-framework until 2026-09-03 and
 * moved here for the same reason `useGrabEdge` did: kol-component's own
 * `EditorShell` needs resizable rails and cannot import framework. framework
 * re-exports it, so no consumer specifier changed. */
export { default as useDragResize } from './hooks/useDragResize.js'
export { default as usePlaceholders } from './hooks/usePlaceholders.js'
export { resolveCssVar, resolveCssColor, isLight } from './hooks/cssVar.js'

// color math (support module — HSL/hex conversion + harmony generation)
export {
  hexToHsl, hslToHex, rgbToHex, normHue,
  HARMONIES, harmonyById, harmonyColors, generateHarmony,
  SEED_MODE_IDS, seedHarmony,
} from './hooks/colorMath.js'
