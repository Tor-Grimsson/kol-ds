/**
 * @kol/component - Canonical KOL design-system primitives
 *
 * Shared atoms/molecules/organisms consumed by both apps/web (via @kol/ui
 * re-export) and apps/brand. Components emit canonical kol-* classes; CSS
 * lives in @kol/theme (kol-components-*.css).
 *
 * Placement follows the taxonomy rules in
 * docs/taxonomy/01-component-placement.md:
 *   atom     — nests no KOL component (kol-loader Icon/Graphic are
 *              infrastructure, they don't count)
 *   molecule — nests at least one KOL component
 *   organism — a self-contained composed UI region
 * `scripts/validate-taxonomy.mjs` enforces the closed folder set and the
 * downward-only import rule (atoms never import molecules/organisms).
 */

// atoms
export { default as AssetPlaceholder } from './atoms/AssetPlaceholder.jsx'
export { default as Avatar } from './atoms/Avatar.jsx'
export { default as Badge } from './atoms/Badge.jsx'
export { default as Button } from './atoms/Button.jsx'
export { default as CopyButton } from './atoms/CopyButton.jsx'
export { default as Divider } from './atoms/Divider.jsx'
export { default as DropdownTagFilter } from './atoms/DropdownTagFilter.jsx'
export { default as ExitPreview } from './atoms/ExitPreview.jsx'
export { default as FullscreenOverlay } from './atoms/FullscreenOverlay.jsx'
export { default as Input } from './atoms/Input.jsx'
export { default as Label } from './atoms/Label.jsx'
export { default as LabeledControl } from './atoms/LabeledControl.jsx'
export { default as Pill } from './atoms/Pill.jsx'
export { usePopover, PopoverPanel, Tooltip } from './atoms/Popover.jsx'
export { default as QuantityInput } from './atoms/QuantityInput.jsx'
export { default as QuantityStepper } from './atoms/QuantityStepper.jsx'
export { default as Section } from './atoms/Section.jsx'
export { default as SectionLabel } from './atoms/SectionLabel.jsx'
export { default as SegmentedToggle } from './atoms/SegmentedToggle.jsx'
export { default as Stepper } from './atoms/Stepper.jsx'
export { default as Tag } from './atoms/Tag.jsx'
export { default as Textarea } from './atoms/Textarea.jsx'
export { default as ToggleBracket } from './atoms/ToggleBracket.jsx'
export { default as ToggleCheckbox } from './atoms/ToggleCheckbox.jsx'
export { default as ToggleSwitch } from './atoms/ToggleSwitch.jsx'
export { default as TransparentX } from './atoms/TransparentX.jsx'
export { default as ViewToggle } from './atoms/ViewToggle.jsx'

// molecules
export { Accordion, AccordionPanel } from './molecules/Accordion.jsx'
export { default as CodeBlock } from './molecules/CodeBlock.jsx'
export { default as ColorSwatch } from './molecules/ColorSwatch.jsx'
export { default as Dropdown } from './molecules/Dropdown.jsx'
export { default as Image } from './molecules/Image.jsx'
export { default as MediaCard } from './molecules/MediaCard.jsx'
export { default as MediaRow } from './molecules/MediaRow.jsx'
export { MenuItem, MenuDropdownItem, MenuDropdownDivider, MenuDropdownNest } from './molecules/MenuItem.jsx'
export { MenuPopover } from './molecules/MenuPopover.jsx'
export { ModalProvider, useModal } from './molecules/Modal.jsx'
export { default as PropertyInput } from './molecules/PropertyInput.jsx'
export { default as Slider } from './molecules/Slider.jsx'

// organisms
export { default as Carousel } from './organisms/Carousel.jsx'
export { default as ContentFilters } from './organisms/ContentFilters.jsx'
export { default as Table } from './organisms/Table.jsx'

// loaders (re-export — infrastructure, documented on /docs/loaders)
export { Icon } from '@kolkrabbi/kol-loader'

// graphics (SVG illustration loader — globs its own ./graphics/svg/**)
export { default as Graphic, GRAPHICS } from './graphics/Graphic.jsx'

// hooks
export { default as useReveal } from './hooks/useReveal.js'
export { default as useScrollSpy } from './hooks/useScrollSpy.js'
