# @kolkrabbi/kol-component

## 0.4.0

### Minor Changes

- 1394844: Merge QuantityStepper into QuantityInput (taxonomy audit, Phase 4). The two were near-identical (same responsive sizing, same `(value) => onChange` contract) and differed only in button layout. QuantityInput gains a `controls` prop:

  - `controls="chevron"` (default) — the existing look; value + a stacked up/down chevron pair. Existing QuantityInput call-sites are unaffected.
  - `controls="split"` — the former QuantityStepper: a `− value +` pill.

  **Breaking (0.x):** the `QuantityStepper` export is removed — replace `<QuantityStepper … />` with `<QuantityInput controls="split" … />`. There were no non-demo consumers.

### Patch Changes

- 1394844: MenuPopover cleanup — remove dead duplicate code. `MenuPopover.jsx` had shadowed a second `MenuItem` (a row) and a `MenuDivider` that were never barrel-exported (dead: no consumer could import them, and the barrel's `MenuItem` comes from `MenuItem.jsx`). Deleted both. `MenuPopover` remains a deprecated alias of `MenuItem` — compose its rows with the exported `MenuDropdownItem` / `MenuDropdownDivider` / `MenuDropdownNest`. No public API change; the alias is removed at the next major.

## 0.3.0

### Minor Changes

- d3b4398: Monorepo-batch P0 — shared primitives: `EmptyState`, `OverlayGlassPanel`, `Figure` atoms; `MediaViewer` organism (the one fullscreen paged viewer, composed on FullscreenOverlay); hooks `usePrefersReducedMotion` (DS-wide motion gate) and `useTilt` (the one tilt hook); `resolveCssVar`/`resolveCssColor`/`isLight` color utils. New peer deps on kol-component: `framer-motion`, `gsap`, `hls.js`. Theme: Figure caption chrome (`kol-prose-figure`, `kol-caption-*`).
- d3b4398: Monorepo-batch P1 — clean singles: atoms `AssetGrid`, `CurveOverlay`, `DocsToc`, `HlsVideo`, `PriceDisplay` (fixes the source's ignored-currency bug), `ProsePreview`, `RotaryDial`, `TypeSample`, `TypeSpecCard`; molecules `ShapeDropdown`, `SpecList`, `TabsRow`; organisms `ErrorBoundary`, `FeatureSplit`. Button gains additive `iconComponent` (icon-registry seam) and `pressed` (aria-pressed toggle) props. Theme: `.kol-btn-pressed`, type-kit sample/spec chrome, `.kol-feature-split-*`.
- d3b4398: Monorepo-batch P2 — shell set + framework reconciles: new `SearchInput` atom, `ShellDrawer` + `ShellSearchOverlay` molecules, `ShellHeader` framework chrome. Additive merges into existing framework components: `PortalFooter` (brand/columns/socials/note slots), `AppShell` (header/footer slots + `ShellTocContext`/`ShellTocCollapsedContext` + xl TOC rail), `SideNav` (onNavigate/controlled-collapse/collapsibleSections/isActive seams). `PageSection` verified already-equivalent — no change.
- d3b4398: Monorepo-batch P3 — layout/marketing organisms: `FullBleedHero` (hero-family base; StudioHero folded in as the video capability), `FramedMediaBand`, `CardFeatureItem` + `FeaturesCardSection`, `CtaGlobal`, `NewsletterBand`, `BentoCard` (useTilt + media sniffer), `FeaturedCarousel`.
- d3b4398: Monorepo-batch P4 — effects (all prefers-reduced-motion gated): `TiltCard`, `AnimatedTitle` (gsap ScrollTrigger), `TextPressure` (variable-font), `AsciiCursor`, `ColorLoader` + `LoaderOverlay`.
- d3b4398: Monorepo-batch P5 — color kit: `SpectrumControls` (HSV picker family — HueStrip/SBSquare/WheelTriangle + composed, useId'd SVG ids), `SwatchControls` (+ EyeDropper), `ColorInputRow` (merges ColorField + SwatchRow), `ColorRamp` (merges Ramp), `SpectrumGrid`. All color-doc widgets share the `resolveCssVar`/`isLight` utils.
- d3b4398: Monorepo-batch P6–P10 — five full-apparatus SETS + their member components (each set is a live page under `/sets/*` in the showcase):

  - **P6 stack (blog/CMS):** `ArticleCard` (default/hero/mini, 6 dupes → 1), `ArticleHeader`, `ImageBlock` + `VideoBlock` (on the Figure atom), `PortableTextRenderer`, `StackHero` (on FullBleedHero).
  - **P7 work (portfolio):** `WorkCard` (on TiltCard), `WorkListItem`, `WorkViewToggle`, `GalleryCarousel` (Carousel + MediaViewer), `ParallaxShelf`.
  - **P8 prints (store):** `ProductDetailLayout` (slot skeleton), `DiagonalMarqueeRiver`, `ScrollDriftGallery` (gsap, reduced-motion gated).
  - **P9 foundry (type specimen):** isolated under the new `@kolkrabbi/kol-component/foundry` subpath — `SpecimenSectionHeader`, `GlyphMetricsGrid` (opentype.js metrics), `VariableFontSection`, `TypefaceHero`, `TypefaceStyleSection`, `FontPreviewSection`, `FoundryCharacterSets` + `useAxisAnimation` hook. `opentype.js` added as an optional peer dep.
  - **P10 editor:** `Canvas` (1080-virtual coordinate contract), `SelectionOverlay`, `EditorShell`, `AlignmentGrid`.

## 0.2.0

### Minor Changes

- fa8ce05: New `CopyButton` atom — the copy-to-clipboard chip (clipboard icon + Copy/Copied swap, 1.8s reset, silent on blocked clipboard) extracted from CodeBlock's inline button so it's a logged atom before being lifted into composites. `CodeBlock` now nests it. Chip look lives in kol-theme (`.kol-copy-btn`); kol-framework's `.kol-codeblock-copy` slims to positioning only. Props: `text` (string or thunk), `label` (false = icon-only).
- c750436: Graphic: move the ~4.8 MB of raw illustration SVGs (several wrap embedded base64 rasters) behind a single dynamic `import()` (`graphicData.js`) — the same entry-chunk fix as kol-loader's Icon. The consumer's entry chunk no longer carries the graphic payload; it streams as its own async chunk. `GRAPHICS` (inventory) is now built from a keys-only glob and stays synchronous. Removes the dead `GRAPHIC_RAW` export (zero consumers; it forced the eager inline). On a cold first paint a graphic may render as a same-sized empty box for a frame.
- c750436: New molecules `MediaCard` + `MediaRow` — the grid tile and list row for one media object (recreated from kol-media-admin's lobby specs, same slot contract: thumb / name / actions + select mode with shift-range `onSelect`). Both share a passive `SelectIndicator` (deliberately not ToggleCheckbox — the card/row is the click target; a nested real checkbox double-fires). MediaRow column widths exposed as `dateWidth` / `sizeWidth` props.
- fa8ce05: Add `defaultOpen` to the open-state components — `Dropdown`, `DropdownTagFilter`, `MenuItem`, `MenuPopover`. Non-breaking; seeds the internal open state so panels can render expanded (docs previews, restored UI state).
- fa8ce05: Menu-family unification, step 1: `MenuPopover` is now a deprecated alias of `MenuItem` — the two triggers had identical APIs and duplicate implementations (hand-rolled fixed positioning vs floating-ui). One implementation remains (floating-ui: portal, auto-flip, scroll-tracking, focus management). Existing `MenuPopover` call-sites keep working; note the trigger now renders MenuItem's chrome (chevron) and the panel is portal-rendered. Migrate imports to `MenuItem`; the alias goes away in the next major.
- fa8ce05: `SegmentedToggle` renders its real chrome again in every consumer. The container/cell look moved out of Tailwind utility classes (which never generate from package sources — consumers saw jammed labels with no border) into `.kol-seg` / `.kol-seg-cell` in kol-theme's molecule CSS, including padded cells. A11y upgrade rides along: `radiogroup`/`radio` semantics with a roving tabindex, ←→/↑↓ arrow-key selection, and a `:focus-visible` outline; new optional `ariaLabel` prop names the group. `aria-pressed` is replaced by `aria-checked`.
- c750436: ViewToggle: new `iconVariant` prop ('stroke' default) — picks the icon cut for `variant="icon"`; solid glyphs read better at the toggle's 14px size.

### Patch Changes

- fa8ce05: `Input` is now controlled only when a `value` prop is passed. Previously every Input rendered controlled with `value ?? ''` — a prop-less usage (e.g. a search stub) froze on typing and fired React's value-without-onChange warning. Prop-less Inputs are now uncontrolled; controlled Inputs without an `onChange` render `readOnly` (deliberate display-only). Also fixes `Button` icon alignment: `iconLeft`/`iconRight` glyphs now render directly as flex items — the old wrapper spans (with -2px optical margins) sat glyphs on the span baseline instead of centering them against the label (fix ported from kol-client).
- fa8ce05: Internal taxonomy restructure — public exports unchanged. The `primitives` folder is dissolved (it was never part of the atomic system) and every component now sits in the tier the placement rules give it (docs/taxonomy/01-component-placement.md): Badge/Pill/Tag/Section/SectionLabel/SegmentedToggle/ToggleBracket/ViewToggle/LabeledControl/DropdownTagFilter/QuantityInput/QuantityStepper/Popover/AssetPlaceholder/ExitPreview/FullscreenOverlay → atoms; Slider/ColorSwatch/CodeBlock/Image/Accordion → molecules; Carousel/ContentFilters → organisms. Deep imports of source paths would break, but the package only supports root imports. `scripts/validate-taxonomy.mjs` now enforces the closed folder set, downward-only imports, and the molecule test.
- fa8ce05: Type-conformance sweep: freestyle Tailwind text sizing replaced with kol type classes throughout component source (rule: helper scale for single-line chrome, line-height-bearing sets for anything that wraps — see docs/typography/01-type-classes.md). Avatar initials now ride the helper scale (`xl` drops 30→20px, the largest helper stop); ToggleCheckbox/ToggleSwitch hints → `kol-helper-10`; Accordion chevron → `kol-helper-16`; SideNav collapse glyph → `kol-helper-14`; AssetPlaceholder note → `kol-helper-12`, its wrappable label → `kol-mono-12`.
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
  - @kolkrabbi/kol-loader@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [de4c33f]
  - @kolkrabbi/kol-loader@0.2.0

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
- Updated dependencies [fcfa14c]
  - @kolkrabbi/kol-loader@0.1.1
