import { COMPONENTS_AZ, CATEGORY_LABELS, groupComponents, TOP_LEVEL, PACKAGE_ORDER, packageLabel } from './registry.js'
import { BLOCKS } from '../lib/blocks-registry.js'
import { SETS } from '../lib/sets-registry.js'
import { CARDS } from '../lib/cards-registry.js'
import { VAULT, VAULT_TREE, MDX_DOCS, vaultDocHref } from './vault.js'
import { isSurfaceAdmitted, isComponentAdmitted, anyComponentsAdmitted, isChapterAdmitted, isCategoryAdmitted } from './admitted.js'

/* Chapter folder → display label. THE rule, imported — it was written here and
 * in vault.js byte-identically until 2026-08-01. See nav/labels.js. */
import { labelFromSlug as label } from './labels.js'

/**
 * shell-nav — the adapter from the showcase's own data into the shapes
 * @kolkrabbi/kol-workshop's ShellLayout wants.
 *
 * The showcase has THREE content types where the website's workshop had two:
 *   1. components — 197 entries derived from package barrels (roster.js)
 *   2. surfaces   — hand-authored pages (foundations, icons, blocks, sets, docs)
 *   3. markdown   — the repo's own docs/ vault (injected by the consumer)
 * The shell only needs `routes` (header tabs + optional child trees) and
 * `searchItems`; everything else is rendered through `renderSidebar`, so the
 * component tree keeps its Atomic⇄Function grouping toggle.
 *
 * Nothing here decides IA order — that is a user ruling. This file only maps.
 */

/* THE SPACES — the library taxonomy (plan-2026-09-30-library-taxonomy). The header tabs are the
 * PARENTS; their children are rail categories:
 *
 *   Styles · Composition · Collection · Docs · Search · Development
 *
 *   (Library holds Composition and Collection — W2, 2026-09-30: `Styles · Library · Docs · Search ·
 *   Development`.)
 *
 * Composition groups by SIZE — Components → Blocks → Apps, each made of the one before.
 * Collection groups by BELONGING — Sets (by purpose) and Packages (by shipping). The two together
 * are the Library (`/library`). Docs · Search · Development are reference: about the system, not
 * part of it. The children's URLs (`/components`, `/blocks`, `/apps`, `/sets`, `/cards`,
 * `/packages`) did not move — only the space that owns them (SPACE_PREFIXES).
 *
 * `id` is required: ShellSidebar keys collapse state by it. */
export const ALL_ROUTES = [
  /* STYLES (2026-09-30, the names audit): what everything is painted with — the live specimen
   * pages that read their values off the installed packages, the icon sets, and the guides. */
  { id: 'styles', label: 'Styles', icon: 'paint-drop', path: '/styles' },
  /* LIBRARY IS THE ROOT (2026-09-30, the showcase review W2 — user: "make library be the shared
   * root, with composition and collections inside as subcategories"). Composition and Collection
   * were two tabs with no way to reach the parent they share; they are its two chapters now. */
  { id: 'library', label: 'Library', icon: 'layers', path: '/library' },
  { id: 'docs', label: 'Docs', icon: 'book-open', path: '/docs' },
  /* SEARCH is a space (2026-09-30): its four views are its chapters; the magnifier still opens the
   * palette — one engine behind both. */
  { id: 'search', label: 'Search', icon: 'search', path: '/search' },
  { id: 'development', label: 'Development', icon: 'library', path: '/development' },
]

/* The Library's two chapters and what each holds — the spaces they were until 2026-09-30. The
 * leaf ids still carry the admission gate (admitted.js). */
export const LIBRARY_CHAPTERS = [
  { id: 'composition', label: 'Composition', path: '/composition' },
  { id: 'collection', label: 'Collection', path: '/collection' },
]
export const LIBRARY_CHILDREN = {
  composition: [
    { id: 'components', label: 'Components', path: '/components' },
    { id: 'blocks', label: 'Blocks', path: '/blocks' },
    { id: 'apps', label: 'Apps', path: '/apps' },
  ],
  collection: [
    { id: 'sets', label: 'Sets', path: '/sets' },
    { id: 'packages', label: 'Packages', path: '/packages' },
  ],
}
export const parentOf = (childId) =>
  Object.keys(LIBRARY_CHILDREN).find((k) => LIBRARY_CHILDREN[k].some((c) => c.id === childId)) ?? childId
const libraryAdmitted = () => Object.values(LIBRARY_CHILDREN).flat().some((c) =>
  c.id === 'components' ? anyComponentsAdmitted() : c.id === 'packages' || isSurfaceAdmitted(c.id))

/* Styles › Guides — the authored MDX pages (moved from Docs 2026-09-30; the old /docs/<guide>
 * URLs redirect). Not chapter pages of the vault: the 2026-08-01 ruling keeps the Docs tree
 * markdown-only, which is why they left Docs rather than folding into its chapters. */
export const DOCS_GUIDES = [
  { id: 'docs-shell', label: 'Shell & Layout', path: '/styles/shell-and-layout' },
  { id: 'docs-menus', label: 'Menus', path: '/styles/menus' },
  { id: 'docs-loaders', label: 'Loaders', path: '/styles/loaders' },
  { id: 'docs-type-roles', label: 'Type roles', path: '/styles/type-roles' },
]

/* Styles › Foundations — live pages that read values straight off the installed packages, each
 * naming the source it reads (the Styles home lists them). */
export const DOCS_SPECIMENS = [
  { id: 'spec-foundations', label: 'Tokens', path: '/foundations/tokens', source: 'packages/theme/kol-theme.css · kol-opacity.css' },
  { id: 'spec-color', label: 'Color', path: '/foundations/color', source: 'packages/theme/kol-color.css · packages/framework/kol-brand-color.css' },
  { id: 'spec-typography', label: 'Typography', path: '/foundations/typography', source: 'packages/theme/kol-typography.css · kol-type-roles.css' },
  { id: 'spec-tones', label: 'Tones', path: '/foundations/tones', source: 'packages/component/src/utilities/tone.js · packages/theme/kol-color.css' },
]

/* Development › Tools — generated from the repo itself */
export const DEV_TOOLS = [
  { id: 'dev-references', label: 'References', path: '/references', description: 'The reference graph — what depends on what, with a weight.' },
  { id: 'dev-quarantine', label: 'Quarantine', path: '/quarantine', description: 'What the sidebar admits, what it holds, and the rule each waits on.' },
]

/* THE SEARCH PAGE'S VIEWS (2026-09-30) — the ways to find a page: results, every tag, the tag
 * graph, every page A–Z. They were Development tools; they are how you look for something. */
export const SEARCH_VIEWS = [
  { value: 'results', label: 'Results', path: '/search' },
  { value: 'tags', label: 'Tags', path: '/search/tags', description: 'Every tag in use, by namespace, with its count.' },
  { value: 'graph', label: 'Graph', path: '/search/graph', description: 'Every tag as a node, a line where two share a page.' },
  { value: 'index', label: 'A–Z', path: '/search/index', description: 'Every page on the site, A to Z, by space.' },
]

/* Development › Records — what the work leaves behind (2026-09-30). The phase log is the vault's
 * `09-phase-log/` rendered here (`PHASE_LOG_ROUTE`, nav/vault.js); open questions are the
 * decisions still waiting on the user, laid out as live specimens so a visual call is made by
 * looking, not by reading a description of it. */
export const DEV_RECORDS = [
  { id: 'dev-phase-log', label: 'Phase log', path: '/development/log', description: 'Every run of work, newest first — the phases, the decisions, the plan behind each.' },
  { id: 'dev-open-questions', label: 'Open questions', path: '/development/open-questions', description: 'Decisions still waiting, shown side by side so they are picked by eye.' },
]

/* The admission gate still decides which spaces render. Development always does — it is what
 * accounts for the gate. The Library renders when any of its children is admitted; each child is
 * gated inside its rail. */
export const SHELL_ROUTES = ALL_ROUTES.filter((r) =>
  r.id === 'development' ||
  r.id === 'styles' ||
  (r.id === 'library' ? libraryAdmitted() : isSurfaceAdmitted(r.id)))

/* Which space a path belongs to. A space owns more URL prefixes than its root: Docs owns the
 * reader and the specimen pages, Development the reference graph and the quarantine page — so
 * none of those URLs had to move. */
export const SPACE_PREFIXES = {
  '/styles': ['/styles', '/foundations', '/icons'],
  /* the Library owns both its chapters' URLs; Cards is a set (2026-09-30) */
  '/library': ['/library', '/composition', '/components', '/blocks', '/apps', '/app', '/collection', '/sets', '/cards', '/packages'],
  '/docs': ['/docs', '/documentation'],
  '/search': ['/search'],
  '/development': ['/development', '/references', '/quarantine', '/lobby'],
}

export const isShellTabActive = (pathname) => (href) =>
  (SPACE_PREFIXES[href] ?? [href]).some((p) => pathname === p || pathname.startsWith(`${p}/`))

const titleCase = (s = '') => s.replace(/^./, (c) => c.toUpperCase())
const vaultCategoryLabel = (file) => label(file.replace(/^.*?docs\//, '').split('/')[0])

/* SEARCH ITEMS — kol-search's shape: title · kind · space · category · tags · headings ·
 * keywords · description · date · href. One list feeds the palette and the /search page.
 * `category` is always a display label — an unmapped key used to leak through raw, so a
 * palette row read `shell` beside `Atoms`. */
export const buildShellSearchItems = () => {
  const componentTags = Object.fromEntries(MDX_DOCS.map((d) => [d.href, d.metadata?.tags ?? []]))
  const components = COMPONENTS_AZ.map((c) => ({
    id: `cmp-${c.slug}`,
    title: c.displayName,
    kind: 'component',
    space: 'library',
    category: CATEGORY_LABELS[c.category] ?? titleCase(c.category),
    tags: componentTags[`/components/${c.slug}`] ?? [],
    keywords: [c.name, c.pkg].filter(Boolean),
    description: c.description,
    href: `/components/${c.slug}`,
  }))
  /* every space, the Library and its children — ALL_ROUTES, never the admitted SHELL_ROUTES: a
   * held space is out of the tree, not out of search (validate:reachable E1) */
  const surfaces = [
    ...ALL_ROUTES.flatMap((r) => [
      { id: `space-${r.id}`, title: r.label, kind: 'space', space: r.id, category: 'Spaces', href: r.path },
      /* the Library's chapters and their children are spaces of their own name, filed under it */
      ...(r.id === 'library' ? LIBRARY_CHAPTERS.flatMap((ch) => [
        { id: `space-${ch.id}`, title: ch.label, kind: 'space', space: 'library', category: 'Library', href: ch.path },
        ...LIBRARY_CHILDREN[ch.id].map((c) => ({ id: `space-${c.id}`, title: c.label, kind: 'space', space: 'library', category: ch.label, href: c.path })),
      ]) : []),
    ]),
  ]
  const blocks = BLOCKS.map((b) => ({ id: `block-${b.key}`, title: b.title, kind: 'block', space: 'library', category: 'Blocks', href: `/blocks/${b.key}` }))
  const sets = SETS.map((x) => ({ id: `set-${x.key}`, title: x.title, kind: 'set', space: 'library', category: 'Sets', href: `/sets/${x.key}` }))
  /* a package's page carries its family (2026-09-30 — the single-package sets folded in) */
  const packages = PACKAGE_ORDER.filter((dir) => TOP_LEVEL.some((c) => c.family === dir)).map((dir) => ({ id: `pkg-${dir}`, title: packageLabel(dir), kind: 'package', space: 'library', category: 'Packages', keywords: [`@kolkrabbi/kol-${dir}`], href: `/packages/${dir}` }))
  const cards = CARDS.map((c) => ({ id: `card-${c.key}`, title: c.title, kind: 'card', space: 'library', category: 'Cards', href: `/cards/${c.key}` }))
  /* the search views (2026-09-30) — tags, graph and the A–Z index live on the Search page */
  const views = SEARCH_VIEWS.filter((v) => v.value !== 'results').map((v) => ({ id: `search-${v.value}`, title: v.label, kind: 'tool', space: 'search', category: 'Search', description: v.description, href: v.path }))
  const guides = DOCS_GUIDES.map((g) => ({ id: g.id, title: g.label, kind: 'guide', space: 'styles', category: 'Guides', href: g.path }))
  const specimens = DOCS_SPECIMENS.map((g) => ({ id: g.id, title: g.label, kind: 'specimen', space: 'styles', category: 'Foundations', href: g.path }))
  const tools = DEV_TOOLS.map((t) => ({ id: t.id, title: t.label, kind: 'tool', space: 'development', category: 'Tools', description: t.description, href: t.path }))
  const records = DEV_RECORDS.map((t) => ({ id: t.id, title: t.label, kind: 'record', space: 'development', category: 'Records', description: t.description, href: t.path }))
  const vaultDocs = VAULT.map((d) => ({
    id: `doc-${d.id}`,
    title: d.title,
    kind: d.metadata?.type === 'index' ? 'index' : 'doc',
    space: vaultDocHref(d.id).startsWith('/development') ? 'development' : 'docs',
    category: vaultDocHref(d.id).startsWith('/development') ? 'Phase log' : vaultCategoryLabel(d.file),
    tags: d.metadata?.tags || [],
    headings: d.headings || [],
    description: d.metadata?.description || '',
    date: d.metadata?.updated,
    href: vaultDocHref(d.id),
  }))
  return [...surfaces, ...components, ...blocks, ...sets, ...packages, ...cards, ...views, ...guides, ...specimens, ...tools, ...records, ...vaultDocs]
}

/* The component tree in the shell's `{ id, label, path }` child shape, one
 * group per grouping-mode bucket — feeds a ShellSidebar under the real nav.
 *
 * Filtered at the LIST, not at the groups: in `function` mode the buckets are
 * functions, not tiers, so a group-level filter would let a held organism in
 * through the Structure bucket. */
export const ADMITTED_COMPONENTS = TOP_LEVEL.filter((c) => isComponentAdmitted(c.category))

/* The Documentation tree, gated per CHAPTER. The tree itself (vault.js) stays
 * complete — filtering there would make the vault lie about what it holds; the
 * gate belongs in the nav layer, which is what the shell renders.
 *
 * A group with no `chapter` is a category ROOT (its INDEX and any loose docs).
 * It rides with the category's own gate — `gateOfChapter(null)` falls through
 * to the wildcard holder, which is Documentation. */
/* A group with a CHAPTER is gated by that chapter; a loose category-root file
 * has none and is gated by its CATEGORY. Reading `null` through the chapter
 * gate sent it to the wildcard and opened it under the wrong category
 * (2026-08-01) — see `gateOfCategory` in admitted.js. */
export const admittedVaultTree = () =>
  VAULT_TREE.filter((g) => (g.chapter ? isChapterAdmitted(g.chapter) : isCategoryAdmitted(g.category)))

export const componentTreeRoutes = (mode) =>
  groupComponents(mode, ADMITTED_COMPONENTS).map(([key, label, items]) => ({
    id: `cmp-${key}`,
    label,
    /* the chapter header opens its home: a tier's own page, or a package's set (2026-09-30) */
    path: mode === 'atomic' ? `/components/tier/${key}` : `/components/function/${key}`,
    children: items.map((c) => ({ id: c.slug, label: c.displayName, path: `/components/${c.slug}` })),
  }))
