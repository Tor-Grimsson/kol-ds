import USAGE from '../usage/usage-index.json'
import DOCS_META from '../usage/docs-meta.json'
import { DEMOS } from './demos-registry.js'

/**
 * The component registry — single source of truth for the showcase.
 * Marries three layers:
 *   1. usage-index.json  — mined metadata (pkg, category, count, apps, examples)
 *   2. DEMOS             — one-file live demos: render + ?raw source (lib/demos-registry.js)
 *   3. DESCRIPTIONS      — one-line human summary, authored here
 * Drives the sidebar nav, the /components index, and each /components/:slug page.
 */

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
  QuantityInput: 'An inline quantity selector with +/− buttons.',
  DropdownTagFilter: 'A multi-select tag filter (all selected by default).',
  QuantityStepper: 'An N-way quantity stepper.',
  MenuDropdownDivider: 'A separator row inside a dropdown menu.',
  MenuDropdownNest: 'A nested submenu inside a dropdown menu.',
  ContentFilters: 'A full filter bar — search, tag groups, view modes — for content grids.',
  MenuPopover: 'A click-open action menu / popover.',

  /* primitives */
  AccordionPanel: 'A single collapsible panel.',
  Accordion: 'A stack of independently collapsible panels.',
  AssetPlaceholder: 'A missing-asset fallback that preserves aspect ratio.',
  Carousel: 'A draggable, loopable slider built on Embla.',
  Image: 'A raster image with graceful missing-asset fallback.',
  FullscreenOverlay: 'A fullscreen modal overlay dismissed on Esc or backdrop.',
  ExitPreview: 'A router-aware link out of preview mode.',
  CodeBlock: 'A syntax-highlighted code block with copy-to-clipboard.',

  /* organisms */
  Table: 'A data table driven by column definitions and rows.',

  /* graphics */
  Graphic: 'An SVG illustration loader addressed by category + name.',
  GRAPHICS: 'A map of available graphic categories to their names (data export).',
  GRAPHIC_RAW: 'Raw SVG source strings for every graphic (data export).',

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
 * atoms/molecules/organisms (docs/taxonomy/01-component-placement.md).
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

/* Not components in the traditional sense — route wrappers / behaviors /
 * loaders. Documented on the Docs pages instead (shadcn model: meta material
 * lives in Docs, never in the components list). Icon + Graphic are the
 * loader tier (/docs/loaders); their visual galleries stay on /icons. */
export const DOCS_ONLY = ['Layout', 'AppShell', 'ScrollToTop', 'Icon', 'Graphic']

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
  overlay: 'Overlay',
  media: 'Media',
  structure: 'Structure',
  utility: 'Utility',
}
const FUNCTION_MAP = {
  Button: 'action', ThemeToggle: 'action',
  Input: 'input', Textarea: 'input', Slider: 'input', Stepper: 'input',
  QuantityInput: 'input', QuantityStepper: 'input', PropertyInput: 'input',
  ToggleSwitch: 'input', ToggleCheckbox: 'input', ToggleBracket: 'input',
  SegmentedToggle: 'input', ViewToggle: 'input', Dropdown: 'input',
  DropdownTagFilter: 'input', LabeledControl: 'input', Label: 'input',
  Badge: 'display', Tag: 'display', Pill: 'display', Avatar: 'display',
  ColorSwatch: 'display', TransparentX: 'display', CodeBlock: 'display',
  Table: 'display', SectionLabel: 'display', Icon: 'display',
  SideNav: 'navigation', ExitPreview: 'navigation',
  Tooltip: 'overlay', MenuItem: 'overlay', MenuPopover: 'overlay',
  MenuDropdownItem: 'overlay', MenuDropdownDivider: 'overlay',
  MenuDropdownNest: 'overlay', FullscreenOverlay: 'overlay',
  Image: 'media', Carousel: 'media', Graphic: 'media', AssetPlaceholder: 'media',
  Divider: 'structure', Section: 'structure', Accordion: 'structure',
  AccordionPanel: 'structure', PageSection: 'structure', BrandHero: 'structure',
  SubPageHero: 'structure', PortalFooter: 'structure', ContentFilters: 'structure',
  useReveal: 'utility', useScrollSpy: 'utility',
}

/* Enriched, slugged component list (mining order preserved = usage-ranked). */
export const COMPONENTS = USAGE
  .filter((c) => !isDataExport(c.name) && !DOCS_ONLY.includes(c.name))
  .map((c) => ({
    ...c,
    category: FRAMEWORK_GROUPS[c.name] ?? c.category,
    function: FUNCTION_MAP[c.name] ?? 'display',
    slug: slugify(c.name),
    demo: DEMOS[c.name] || null,
    description: DESCRIPTIONS[c.name] || '',
    /* Source-mined doc meta (scripts/extract-docs-meta.mjs): the kol type
     * classes it renders text with + the KOL components it composes. */
    meta: DOCS_META[c.name] || null,
  }))

/* Flat A→Z — the sidebar/index ordering. New components slot alphabetically;
 * nothing ever reorders. */
export const COMPONENTS_AZ = [...COMPONENTS].sort((a, b) => a.name.localeCompare(b.name))

const BY_SLUG = new Map(COMPONENTS.map((c) => [c.slug, c]))
export const getComponentBySlug = (slug) => BY_SLUG.get(slug) || null

/* [ [categoryKey, [components…]], … ] in CATEGORY_ORDER, components A→Z within. */
export function componentsByCategory(list = COMPONENTS) {
  const by = {}
  for (const c of list) (by[c.category] ||= []).push(c)
  for (const k of Object.keys(by)) by[k].sort((a, b) => a.name.localeCompare(b.name))
  return CATEGORY_ORDER.filter((k) => by[k]).map((k) => [k, by[k]])
}

export const TOTAL = COMPONENTS.length
export const WITH_DEMOS = COMPONENTS.filter((c) => c.demo).length
