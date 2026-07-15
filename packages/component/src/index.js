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
export { default as AssetGrid } from './atoms/AssetGrid.jsx'
export { default as AssetPlaceholder } from './atoms/AssetPlaceholder.jsx'
export { default as Avatar } from './atoms/Avatar.jsx'
export { default as Badge } from './atoms/Badge.jsx'
export { default as Button } from './atoms/Button.jsx'
export { default as CopyButton } from './atoms/CopyButton.jsx'
export { default as CurveOverlay } from './atoms/CurveOverlay.jsx'
export { default as Divider } from './atoms/Divider.jsx'
export { default as DocsToc } from './atoms/DocsToc.jsx'
export { default as DropdownTagFilter } from './atoms/DropdownTagFilter.jsx'
export { default as EmptyState } from './atoms/EmptyState.jsx'
export { default as ExitPreview } from './atoms/ExitPreview.jsx'
export { default as Figure } from './atoms/Figure.jsx'
export { default as FullscreenOverlay } from './atoms/FullscreenOverlay.jsx'
export { default as HlsVideo } from './atoms/HlsVideo.jsx'
export { default as Input } from './atoms/Input.jsx'
export { default as Label } from './atoms/Label.jsx'
export { default as LabeledControl } from './atoms/LabeledControl.jsx'
export { default as OverlayGlassPanel } from './atoms/OverlayGlassPanel.jsx'
export { default as Pill } from './atoms/Pill.jsx'
export { usePopover, PopoverPanel, Tooltip } from './atoms/Popover.jsx'
export { default as ProsePreview } from './atoms/ProsePreview.jsx'
export { default as QuantityInput } from './atoms/QuantityInput.jsx'
export { default as RotaryDial } from './atoms/RotaryDial.jsx'
export { default as SearchInput } from './atoms/SearchInput.jsx'
export { default as Section } from './atoms/Section.jsx'
export { default as SectionLabel } from './atoms/SectionLabel.jsx'
export { default as SegmentedToggle } from './atoms/SegmentedToggle.jsx'
export { default as Stepper } from './atoms/Stepper.jsx'
export { default as Tag } from './atoms/Tag.jsx'
export { default as Textarea } from './atoms/Textarea.jsx'
export { default as ToggleBracket } from './atoms/ToggleBracket.jsx'
export { default as ToggleCheckbox } from './atoms/ToggleCheckbox.jsx'
export { default as ToggleSwitch } from './atoms/ToggleSwitch.jsx'
export { default as TiltCard } from './atoms/TiltCard.jsx'
export { default as TransparentX } from './atoms/TransparentX.jsx'
export { default as ViewToggle } from './atoms/ViewToggle.jsx'

// molecules
export { Accordion, AccordionPanel } from './molecules/Accordion.jsx'
export { default as ButtonGroup } from './molecules/ButtonGroup.jsx'
/* monorepo sets (P6–P10) — molecule members */
export { default as AlignmentGrid } from './molecules/AlignmentGrid.jsx'
export { default as ImageBlock } from './molecules/ImageBlock.jsx'
export { default as SelectionOverlay } from './molecules/SelectionOverlay.jsx'
export { default as VideoBlock, getEmbedUrl } from './molecules/VideoBlock.jsx'
export { default as CardFeatureItem } from './molecules/CardFeatureItem.jsx'
export { default as CodeBlock } from './molecules/CodeBlock.jsx'
export { default as ColorInputRow } from './molecules/ColorInputRow.jsx'
export { default as ColorRamp } from './molecules/ColorRamp.jsx'
export { default as ColorSwatch } from './molecules/ColorSwatch.jsx'
export { default as Dropdown } from './molecules/Dropdown.jsx'
export { default as FramedMediaBand } from './molecules/FramedMediaBand.jsx'
export { default as Image } from './molecules/Image.jsx'
export { default as MediaCard } from './molecules/MediaCard.jsx'
export { default as MediaRow } from './molecules/MediaRow.jsx'
export { MenuItem, MenuDropdownItem, MenuDropdownDivider, MenuDropdownNest } from './molecules/MenuItem.jsx'
export { MenuPopover } from './molecules/MenuPopover.jsx'
export { ModalProvider, useModal } from './molecules/Modal.jsx'
export { default as PaletteHarmonyWheel } from './molecules/PaletteHarmonyWheel.jsx'
export { default as PropertyInput } from './molecules/PropertyInput.jsx'
export { default as ShapeDropdown } from './molecules/ShapeDropdown.jsx'
export { default as ShellDrawer } from './molecules/ShellDrawer.jsx'
export { default as ShellSearchOverlay } from './molecules/ShellSearchOverlay.jsx'
export { default as Slider } from './molecules/Slider.jsx'
export { default as SpecList } from './molecules/SpecList.jsx'
export { default as SpectrumControls, HueStrip, SBSquare, WheelTriangle } from './molecules/SpectrumControls.jsx'
export { default as SplitToolButton } from './molecules/SplitToolButton.jsx'
export { default as SwatchControls, SwatchStack, EyedropPick } from './molecules/SwatchControls.jsx'
export { default as TabsRow } from './molecules/TabsRow.jsx'

// organisms
/* monorepo sets (P6–P10) — organism members. Foundry members live in the
   standalone @kolkrabbi/kol-foundry package (with the type-specimen kit +
   live-font effects moved there 2026-07-09) — never re-exported here. */
export { default as Canvas, CanvasFrame, PanViewport, CANVAS_VIRTUAL_W, DEFAULT_ASPECTS, CANVAS_DEFAULTS } from './organisms/Canvas.jsx'
export { default as EditorShell } from './organisms/EditorShell.jsx'
export { default as GalleryCarousel } from './organisms/GalleryCarousel.jsx'
export { default as AsciiCursor } from './organisms/AsciiCursor.jsx'
export { default as BentoCard } from './organisms/BentoCard.jsx'
export { default as Carousel } from './organisms/Carousel.jsx'
export { default as ContentFilters } from './organisms/ContentFilters.jsx'
export { default as CtaGlobal } from './organisms/CtaGlobal.jsx'
export { default as ErrorBoundary } from './organisms/ErrorBoundary.jsx'
export { default as FeatureSplit } from './organisms/FeatureSplit.jsx'
export { default as FeaturedCarousel } from './organisms/FeaturedCarousel.jsx'
export { default as FeaturesCardSection } from './organisms/FeaturesCardSection.jsx'
export { default as FullBleedHero } from './organisms/FullBleedHero.jsx'
export { default as LoaderOverlay } from './organisms/LoaderOverlay.jsx'
export { default as MediaTileGallery } from './organisms/MediaTileGallery.jsx'
export { default as MediaViewer } from './organisms/MediaViewer.jsx'
export { default as NewsletterBand } from './organisms/NewsletterBand.jsx'
export { default as SpectrumGrid } from './organisms/SpectrumGrid.jsx'
export { default as Table } from './organisms/Table.jsx'

// loaders (re-export — infrastructure, documented on /docs/loaders)
export { Icon } from '@kolkrabbi/kol-icons'

// graphics (SVG illustration loader — globs its own ./graphics/svg/**)
export { default as Graphic, GRAPHICS } from './graphics/Graphic.jsx'

// hooks
export { default as usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'
export { default as useReveal } from './hooks/useReveal.js'
export { default as useScrollSpy } from './hooks/useScrollSpy.js'
export { default as useTilt } from './hooks/useTilt.js'
export { default as useAxisAnimation } from './hooks/useAxisAnimation.js'
export { useEyedropper, pickFromCanvasElement } from './hooks/useEyedropper.js'
export { resolveCssVar, resolveCssColor, isLight } from './hooks/cssVar.js'

// color math (support module — HSL/hex conversion + harmony generation)
export {
  hexToHsl, hslToHex, rgbToHex, normHue,
  HARMONIES, harmonyById, harmonyColors, generateHarmony,
  SEED_MODE_IDS, seedHarmony,
} from './hooks/colorMath.js'
