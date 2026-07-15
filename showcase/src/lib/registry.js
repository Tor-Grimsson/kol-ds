import USAGE from '../usage/usage-index.json'
import DOCS_META from '../usage/docs-meta.json'
import EXTRACTED_DESCRIPTIONS from '../usage/descriptions.json'
import { DEMOS } from './demos-registry.js'
import { COMPONENT_GROUPS, MEMBER_OF } from './component-groups.js'
import { ROSTER } from './roster.js'
import { FUNCTIONS_BY_NAME, DOCS_ONLY, DEPRECATED } from './classification.js'

/**
 * The component registry — single source of truth for the showcase.
 * Marries three layers:
 *   1. usage-index.json  — mined metadata (pkg, category, count, apps, examples)
 *   2. DEMOS             — one-file live demos: render + ?raw source (lib/demos-registry.js)
 *   3. DESCRIPTIONS      — one-line human summary, authored here
 * Drives the sidebar nav, the /components index, and each /components/:slug page.
 */

/* AUTHORED FALLBACKS ONLY (2026-07-15, audit P1-5): the rendered description
 * is the component's own JSDoc first sentence (scripts/extract-descriptions.mjs
 * → descriptions.json, regenerated every build) and CANNOT rot. An entry here
 * only surfaces for a component whose file has no `Name — sentence.` header —
 * fix the JSDoc rather than editing this map. */
const DESCRIPTIONS = {
  /* atoms */
  Button: 'Trigger an action or event — primary, secondary, outline, ghost, or icon-only.',
  Slider: 'Select a numeric value from a range with a draggable track.',
  Divider: 'A thin rule separating content, horizontal or vertical.',
  Input: 'Single-line text field with prefix/suffix, icons, and size variants.',
  ToggleCheckbox: 'A labeled checkbox for a binary opt-in.',
  ToggleSwitch: 'A labeled on/off switch.',
  ColorSwatch: 'A color chip with selectable, framed, and transparent states.',
  Label: 'A form-field label.',
  Stepper: 'Increment or decrement a number with +/− controls.',
  Textarea: 'Multi-line text field with filled, ghost, and outline variants.',
  Avatar: 'A circular initial/identity chip in four sizes.',
  TransparentX: 'A checkerboard fill marking transparency.',

  /* molecules */
  Dropdown: 'A single-select menu with size and minimal/subtle variants.',
  Section: 'A small-caps label above a stack of controls, for inspectors.',
  LabeledControl: 'A label-and-hint wrapper around any control.',
  Badge: 'A status pill — success, warning, critical, info, outline.',
  ViewToggle: 'Switch between view modes — grid/list, icon, or binary.',
  MenuDropdownItem: 'A clickable row inside a dropdown menu.',
  Tag: 'A removable, optionally hashed keyword chip.',
  Pill: 'A compact rounded label — outline, subtle, inverse.',
  SectionLabel: 'A label with an icon affordance for collapsible sections.',
  Tooltip: 'A floating hint on hover or focus, built on Floating UI.',
  SegmentedToggle: 'A joined N-way segmented control.',
  ToggleBracket: 'A `Label [STATE]` text toggle.',
  PropertyInput: 'A stacked label + number/text input for inspector panels.',
  MenuItem: 'A composable menu trigger with a dropdown panel.',
  QuantityInput: 'A compact integer quantity picker — chevron pair or a − value + split pill.',
  DropdownTagFilter: 'A multi-select tag filter (all selected by default).',
  MenuDropdownDivider: 'A separator row inside a dropdown menu.',
  MenuDropdownNest: 'A nested submenu inside a dropdown menu.',
  ContentFilters: 'A full filter bar — search, tag groups, view modes — for content grids.',
  MenuPopover: 'A click-open action menu / popover.',

  /* primitives */
  AccordionPanel: 'A single collapsible panel.',
  Accordion: 'A stack of independently collapsible panels.',
  ButtonGroup: 'A responsive layout wrapper for a group of Buttons — stacked on mobile, a row from sm, aligned left/center/right.',
  AssetPlaceholder: 'A missing-asset fallback that preserves aspect ratio.',
  Carousel: 'A draggable, loopable slider built on Embla.',
  Image: 'A raster image with graceful missing-asset fallback.',
  FullscreenOverlay: 'A fullscreen modal overlay dismissed on Esc or backdrop.',
  ExitPreview: 'A router-aware link out of preview mode.',
  CodeBlock: 'A syntax-highlighted code block with copy-to-clipboard.',

  MediaCard: 'A grid tile for one media object — thumbnail, name, meta, actions, with a select mode.',
  MediaRow: 'A list row for one media object — thumbnail, name, date/size columns, actions, with a select mode.',
  EmptyState: 'A stacked eyebrow/title/body/footer block for empty panels and unshipped inspectors.',
  OverlayGlassPanel: 'A frosted-glass content card floating over hero or carousel media.',
  Figure: 'A caption’d, aspect-locked media frame for long-form prose.',
  MediaViewer: 'The fullscreen paged media viewer — arrow keys, swipe, wrap-around, on FullscreenOverlay + embla.',
  MediaTileGallery: 'A stack or grid of framed media tiles opening the shared MediaViewer at the clicked index.',
  AssetGrid: 'A thin responsive N-column grid for tiling asset figures.',
  CurveOverlay: 'An SVG easing/curve visualizer with a two-handle bezier editor in custom mode.',
  DocsToc: 'An on-page table of contents that highlights the heading in view via useScrollSpy.',
  HlsVideo: 'A non-interactive background HLS video — hls.js with Safari-native fallback.',
  PriceDisplay: 'A baseline-aligned price line formatted via Intl.NumberFormat with an optional muted note.',
  ProsePreview: 'A full rich-text specimen exercising the whole kol-prose stylesheet in one view.',
  RotaryDial: 'A drag-to-set rotary knob numeric input with a 270° sweep and arrow-key stepping.',
  TypeSample: 'A single labeled type-specimen block driven by family/weight/size/line-height props.',
  TypeSpecCard: 'A two-column type-spec row — font metrics beside a live sample slot.',
  ShapeDropdown: 'A split icon-button + variant-menu — act on the current variant or pick another.',
  SplitToolButton: 'A single-trigger split tool button — one click arms the last-picked variant and opens the variant menu.',
  SpecList: 'A compact label/value definition list with Divider-separated rows.',
  TabsRow: 'A labeled underline tab strip — active tab gets a 2px underline.',
  ErrorBoundary: 'Catches render errors in its subtree and shows a recovery fallback with retry and go-home.',
  FeatureSplit: 'An editorial media-and-text split section — kicker, display pull, lede, stats or CTAs.',
  SearchInput: 'A controlled search field — leading icon, shortcut kbd chip, clear ×; Input’s search sibling.',
  ShellDrawer: 'An edge-anchored slide-in drawer with focus trap, scroll-lock, and Esc/backdrop close.',
  ShellSearchOverlay: 'The ⌘K command palette — dim, bare search field, keyboard-roved result rows.',
  ShellHeader: 'The shell top bar — brand slot, nav anchors, search field, theme toggle, trailing actions.',

  /* P3 — layout / marketing organisms */
  FramedMediaBand: 'A full-width media breather band — a centered, aspect-locked bordered frame around one cover image.',
  FullBleedHero: 'A full-bleed media hero — cover image or video, an optional scrim, and one centered content slot.',
  CardFeatureItem: 'A fixed-height feature card — title + optional icon, a polymorphic visual, and a mono description; optionally a link.',
  FeaturesCardSection: 'The N-up feature-cards band — heading + lede over a responsive row of CardFeatureItem, capped by a CTA row.',
  CtaGlobal: 'An editorial two-column contact/CTA band — a display wordmark beside stacked label-over-value rows.',
  NewsletterBand: 'A centered subscribe band — heading + lede over an email Input and submit Button with an aria-live status line.',
  BentoCard: 'A media hover-card for bento walls — auto-detected HLS/video/image behind a content stack, with a pointer 3D tilt.',
  FeaturedCarousel: 'A full-width carousel of featured media — wide image/HLS-video slides with a glass panel, prev/next, optional autoplay.',

  /* P4 — effects */
  TiltCard: 'A self-contained image card with a pointer-following spring 3D tilt; a grounded variant plants it at the bottom edge.',
  AnimatedTitle: 'A scroll-triggered heading that reveals its words one by one as it enters the viewport (GSAP + ScrollTrigger).',
  TextPressure: 'A line of variable-font text whose glyphs deform toward the pointer — width/weight/italic falling off with distance.',
  AsciiCursor: 'A decorative ASCII cursor-follow overlay; vanishes on coarse pointers and prefers-reduced-motion.',
  ColorLoader: 'A full-height branded intro/loading curtain — a timed variable-font wordmark and scroll cue, with click-to-dismiss.',
  LoaderOverlay: 'A loading curtain mounted over everything — wraps FullscreenOverlay, renders children or an injected `loader` slot (e.g. foundry’s ColorLoader).',

  /* P5 — color kit */
  SpectrumControls: 'The HSV color-picker family — HueStrip, SBSquare, WheelTriangle, and the composed square picker.',
  SwatchControls: 'A paint-chip stack + eyedropper — swatch slots on ColorSwatch with an EyeDropper-API pick affordance.',
  ColorInputRow: 'A swatch chip + # hex input row — the merged ColorField/SwatchRow with optional palette-ref popover, lock toggle, and token-name column.',
  ColorRamp: 'One specimen row of color chips — label + note above captioned ColorSwatch chips, from live CSS vars or static colors.',
  SpectrumGrid: 'A matrix view of the ramp system — rows are ramps, columns are stops, each a live-resolved ColorSwatch tile.',

  /* P6–P10 set members */
  ArticleCard: 'A blog/editorial card family — one component with default / hero / mini sizes.',
  SourcesReferences: 'An end-of-article sources & references list — numbered boxes with title, optional note, and link.',
  ArticleHeader: 'An article masthead — flat-prop title, meta, and an Avatar byline (de-Sanitized).',
  ImageBlock: 'A prose image block on the Figure shell — aspect-locked frame, label, caption.',
  VideoBlock: 'A prose video block on the Figure shell — embed or poster with a caption.',
  PortableTextRenderer: 'A block-array renderer — maps a plain {type,…} block list to KOL components.',
  StackHero: 'A blog hero on FullBleedHero — cover media + title/lede, with a tall variant.',
  WorkCard: 'A portfolio grid tile composing TiltCard, with a hover content drawer.',
  WorkListItem: 'The list-row twin of WorkCard — thumbnail, title, tags, on one shared project shape.',
  WorkViewToggle: 'A sliding-pill grid/list toggle with inline search (controlled).',
  GalleryCarousel: 'A project media gallery — DS Carousel opening into MediaViewer at the clicked index.',
  ParallaxShelf: 'A scroll-parallax horizontal shelf of WorkCards.',
  ProductDetailLayout: 'A PDP slot skeleton — media / price / specs / tabs / actions, no commerce coupling.',
  DiagonalMarqueeRiver: 'A gsap diagonal marquee grid with a renderItem slot (reduced-motion static).',
  ScrollDriftGallery: 'A gsap pinned horizontal scroll-scrub gallery (reduced-motion plain scroll).',
  Canvas: 'A pan/zoom artboard stage owning the 1080-virtual-pixel coordinate contract.',
  SelectionOverlay: 'Transform handles + bounding box in the canvas 1080-virtual space.',
  EditorShell: 'A two-rail editor frame — left/right panel slots around a canvas region.',
  AlignmentGrid: 'An align-to-artboard control — DS Button cells firing an onAlign seam.',

  /* P9 foundry (subpath @kolkrabbi/kol-component/foundry) */
  SpecimenSectionHeader: 'A shared specimen section header — eyebrow, title, and a controls slot the foundry sections mount under.',
  GlyphMetricsGrid: 'A glyph grid with opentype-parsed metric overlays — baseline, x-height, cap, ascender, descender.',
  VariableFontSection: 'A variable-font axis playground — sliders drive font-variation-settings live.',
  TypefaceHero: 'A typeface specimen hero — a large live type render with a category pill.',
  TypefaceStyleSection: 'A weights/widths style grid for a typeface family.',
  FontPreviewSection: 'A size-ladder font preview — one string rendered down a scale.',
  FoundryCharacterSets: 'A glyph / character-set browser grouped by category.',

  /* multi-export infrastructure modules */
  Popover: 'The floating-primitive module — usePopover, PopoverPanel, and Tooltip on Floating UI.',
  Modal: 'The modal system — ModalProvider + useModal for imperative dialogs.',

  /* organisms */
  Table: 'A data table driven by column definitions and rows.',

  /* graphics */
  Graphic: 'An SVG illustration loader addressed by category + name.',
  GRAPHICS: 'A map of available graphic categories to their names (data export).',

  /* framework */
  PageSection: 'A titled, labeled content section with anchor support.',
  ThemeToggle: 'A light/dark switcher persisted to localStorage.',
  SideNav: 'The grouped, scroll-spied navigation rail.',
  ScrollToTop: 'Resets scroll position on route change.',
  Layout: 'The outer page layout wrapper.',
  BrandHero: 'A large hero band for brand/landing pages.',
  AppShell: 'The top-level app frame — sidenav, drawer, modal provider, outlet.',
  PortalFooter: 'The portal footer.',
  SubPageHero: 'A compact hero for subpages.',

  /* loaders */
  Icon: 'An SVG icon by name, from a 341-icon set across 14 categories.',
}

/* Display order + labels for category groupings. `primitives` is dead —
 * not part of the atomic system; its 8 components were reclassified into
 * atoms/molecules/organisms (docs/documentation/02-components/02-placement.md).
 * `loaders`/`graphics` are gone too: loaders are functional infrastructure,
 * documented on /docs/loaders — galleries stay on the Icons pages (C4). */
export const CATEGORY_ORDER = [
  'atoms', 'molecules', 'organisms',
  'fw-chrome', 'fw-structure', 'fw-behavior', 'hooks', 'misc',
]
export const CATEGORY_LABELS = {
  atoms: 'Atoms',
  molecules: 'Molecules',
  organisms: 'Organisms',
  'fw-chrome': 'Framework · Chrome',
  'fw-structure': 'Framework · Structure',
  'fw-behavior': 'Framework · Behaviors',
  hooks: 'Hooks',
  misc: 'Misc',
}

/* Framework taxonomy — the flat 'framework' bucket split by function:
 * chrome (shell pieces), page structure (heroes/sections), behaviors
 * (render-null utilities). Open question, logged: do the heroes belong in
 * atomic 'organisms' instead of the framework tier? */
const FRAMEWORK_GROUPS = {
  AppShell: 'fw-chrome',
  Layout: 'fw-chrome',
  SideNav: 'fw-chrome',
  PortalFooter: 'fw-chrome',
  ShellHeader: 'fw-chrome',
  ThemeToggle: 'fw-chrome',
  BrandHero: 'fw-structure',
  SubPageHero: 'fw-structure',
  PageSection: 'fw-structure',
  ScrollToTop: 'fw-behavior',
}

/* CamelCase / UPPER_SNAKE → kebab-case slug. Stable + unique per component. */
export function slugify(name) {
  return name
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/* Drop non-component exports — UPPER_SNAKE data exports (GRAPHICS, GRAPHIC_RAW)
 * are maps/strings, not components, and shouldn't get doc pages. */
const isDataExport = (name) => /^[A-Z0-9_]+$/.test(name)

/* DOCS_ONLY + DEPRECATED live in classification.js (plain data — the CI gate
 * imports them without touching this Vite-bound module); re-exported here
 * for the existing consumers. */
export { DOCS_ONLY, DEPRECATED } from './classification.js'

/* Functional classification — a CLOSED set (Material-style). Every current
 * and future component maps to exactly one; the sidebar stays flat A→Z so a
 * new component always has a location (its alphabetical slot) — functions
 * are filter metadata, never ordering. */
export const FUNCTIONS = {
  action: 'Action',
  input: 'Input',
  display: 'Display',
  feedback: 'Feedback',
  navigation: 'Navigation',
  wayfinding: 'Wayfinding',
  overlay: 'Overlay',
  media: 'Media',
  structure: 'Structure',
  utility: 'Utility',
}
/* Function assignments live in classification.js (FUNCTIONS_BY_NAME) —
 * validated for completeness by `pnpm validate:roster`: a roster component
 * with no function is a RED BUILD, never a silent 'display' default. */

/* usage-index.json is ENRICHMENT ONLY (counts, apps, real call-site
 * examples) — the roster itself derives from the package barrels
 * (lib/roster.js), so a new export can never silently miss the docs. */
const USAGE_BY_NAME = new Map(USAGE.map((u) => [u.name, u]))

/* Enriched, slugged component list — usage-ranked (count desc), then A→Z. */
export const COMPONENTS = ROSTER
  .filter((c) => !isDataExport(c.name) && !DOCS_ONLY.includes(c.name) && !DEPRECATED.includes(c.name))
  .map((c) => {
    const usage = USAGE_BY_NAME.get(c.name)
    return {
      name: c.name,
      pkg: c.pkg, /* true owner, from the barrel — InstallBlock can't lie */
      category: FRAMEWORK_GROUPS[c.name] ?? c.tier,
      function: FUNCTIONS_BY_NAME[c.name],
      count: usage?.count ?? 0,
      apps: usage?.apps ?? [],
      files: usage?.files ?? 0,
      examples: usage?.examples ?? [],
      slug: slugify(c.name),
      demo: DEMOS[c.name] || null,
      /* JSDoc-extracted first (source truth, build-fresh) → authored fallback */
      description: EXTRACTED_DESCRIPTIONS[c.name] || DESCRIPTIONS[c.name] || '',
      /* Source-mined doc meta (scripts/extract-docs-meta.mjs): the kol type
       * classes it renders text with + the KOL components it composes. */
      meta: DOCS_META[c.name] || null,
    }
  })
  .sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name))

/* Sub-part grouping (component-groups.js overlay): a member renders inside
 * its parent's page, never as its own row. Attach members to parents, and
 * drop members from the browsable roster. Members stay resolvable by slug
 * (direct URLs + composition galleries), just off the nav. */
const BY_NAME = new Map(COMPONENTS.map((c) => [c.name, c]))
for (const [parent, members] of Object.entries(COMPONENT_GROUPS)) {
  const p = BY_NAME.get(parent)
  if (p) p.members = members.map((m) => BY_NAME.get(m)).filter(Boolean)
}

/* The browsable roster — every component MINUS the sub-part members. Drives
 * the sidebar, the /components index, and the prev/next pager. */
export const TOP_LEVEL = COMPONENTS.filter((c) => !MEMBER_OF[c.name])

/* Flat A→Z — the sidebar/index ordering. New components slot alphabetically;
 * nothing ever reorders. */
export const COMPONENTS_AZ = [...TOP_LEVEL].sort((a, b) => a.name.localeCompare(b.name))

/* getComponentBySlug resolves the FULL set (members included) so member URLs
 * and composition-gallery lookups never 404. */
const BY_SLUG = new Map(COMPONENTS.map((c) => [c.slug, c]))
export const getComponentBySlug = (slug) => BY_SLUG.get(slug) || null

/* [ [categoryKey, [components…]], … ] in CATEGORY_ORDER, components A→Z within. */
export function componentsByCategory(list = TOP_LEVEL) {
  const by = {}
  for (const c of list) (by[c.category] ||= []).push(c)
  for (const k of Object.keys(by)) by[k].sort((a, b) => a.name.localeCompare(b.name))
  return CATEGORY_ORDER.filter((k) => by[k]).map((k) => [k, by[k]])
}

/* [ [functionKey, [components…]], … ] in FUNCTIONS order, components A→Z. */
export function componentsByFunction(list = TOP_LEVEL) {
  const by = {}
  for (const c of list) (by[c.function] ||= []).push(c)
  for (const k of Object.keys(by)) by[k].sort((a, b) => a.name.localeCompare(b.name))
  return Object.keys(FUNCTIONS).filter((k) => by[k]).map((k) => [k, by[k]])
}

/* The one grouping entry point both the sidebar and the index call.
 * Returns [ [key, label, items], … ] for the active axis (D1 toggle):
 *   'atomic'   → Tier groups (CATEGORY_LABELS)
 *   'function' → Function groups (FUNCTIONS) — default. */
export function groupComponents(mode = 'function', list = TOP_LEVEL) {
  if (mode === 'atomic') {
    return componentsByCategory(list).map(([k, items]) => [k, CATEGORY_LABELS[k] ?? k, items])
  }
  return componentsByFunction(list).map(([k, items]) => [k, FUNCTIONS[k] ?? k, items])
}

export const TOTAL = TOP_LEVEL.length
export const WITH_DEMOS = TOP_LEVEL.filter((c) => c.demo).length
