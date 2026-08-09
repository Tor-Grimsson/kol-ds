import { COMPONENTS_AZ, CATEGORY_LABELS, groupComponents, TOP_LEVEL } from './registry.js'
import { BLOCKS } from '../lib/blocks-registry.js'
import { SETS } from '../lib/sets-registry.js'
import { VAULT, VAULT_SEARCH_ITEMS, VAULT_TREE, vaultDocHref } from './vault.js'
import { CHAPTER_PAGES } from './chapter-pages.js'
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

/* Every surface this app has. `id` is required: ShellSidebar keys collapse
 * state by it. This list is COMPLETE and stays complete — search reads it, so
 * a quarantined surface is still findable by typing its name. What the shell
 * RENDERS is `SHELL_ROUTES` below, filtered through the admission gate. */
export const ALL_ROUTES = [
  /* Foundations and Icons are NOT surfaces (2026-07-31). They are chapters of
   * Documentation — `docs/documentation/01-foundations/` and `02-icons/` — and
   * their live React pages are slot-pages inside those chapters
   * (nav/chapter-pages.js). Listing them here made a chapter a peer of the
   * category that contains it: one body of content, two doors, no parent.
   * Search still reaches them: buildShellSearchItems reads CHAPTER_PAGES. */
  { id: 'components', label: 'Components', icon: 'component-01', path: '/components' },
  {
    id: 'blocks',
    label: 'Blocks',
    icon: 'layout',
    path: '/blocks',
    children: BLOCKS.map((b) => ({ id: `block-${b.key}`, label: b.title, path: `/blocks/${b.key}` })),
  },
  {
    id: 'sets',
    label: 'Sets',
    icon: 'view-list',
    path: '/sets',
    children: SETS.map((s) => ({ id: `set-${s.key}`, label: s.title, path: `/sets/${s.key}` })),
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: 'book-open',
    path: '/docs/shell-and-layout',
    children: [
      { id: 'docs-shell', label: 'Shell & Layout', path: '/docs/shell-and-layout' },
      { id: 'docs-menus', label: 'Menus', path: '/docs/menus' },
      { id: 'docs-loaders', label: 'Loaders', path: '/docs/loaders' },
      { id: 'docs-type-roles', label: 'Type roles', path: '/docs/type-roles' },
    ],
  },
  /* The reference graph — generated, so it sits beside Documentation rather
   * than under Docs: it is not a written page, it is what the repo measures
   * about itself. */
  { id: 'references', label: 'References', icon: 'library', path: '/references' },
  { id: 'search', label: 'Search', icon: 'search', path: '/search' },
  /* Documentation is a CATEGORY, and a category is not a tool (user ruling
   * 2026-08-01). It stays in ALL_ROUTES so ⌘K can still find it by name — that
   * is what this list is for — but it is filtered out of the rendered Tools
   * group below. It was a surface back when the vault had no eyebrow of its
   * own and this row was the only door to `/documentation`; now the eyebrow IS
   * the door, and the row pointed at whichever doc happened to sort first. */
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'journal',
    path: VAULT.length ? vaultDocHref(VAULT[0].id) : '/documentation',
  },
  /* The holding page. A surface like any other — so search finds it — but it
   * is not a category and is never held: it is what accounts for the holding. */
  { id: 'quarantine', label: 'Quarantine', icon: 'lock', path: '/quarantine' },
]

/* THE ADMISSION GATE (quarantine plan, phase 1). The shell renders admitted
 * surfaces plus Quarantine. Readmitting a category is one line in admitted.js,
 * and so is sending it back. */
/* A CATEGORY IS NEVER A TOOLS ROW. `documentation` is admitted as a category
 * and renders as its own eyebrow with its chapters under it; admitting the
 * category was also admitting the surface of the same name, so it appeared
 * twice — once as the eyebrow, once as a row that led into the middle of it. */
const CATEGORY_SURFACES = new Set(['documentation'])

export const SHELL_ROUTES = ALL_ROUTES.filter((r) =>
  !CATEGORY_SURFACES.has(r.id) && (
    r.id === 'quarantine' ||
    isSurfaceAdmitted(r.id) ||
    (r.id === 'components' && anyComponentsAdmitted())))

/* Which tab lights up for a path. The shell's built-in predicate is
 * prefix-only, which can't express "the Docs tab targets a child page but
 * highlights across all of /docs" — so the consumer supplies this. */
const TAB_PREFIX = {
  '/components': '/components',
  '/blocks': '/blocks',
  '/sets': '/sets',
  '/docs/shell-and-layout': '/docs',
  '/references': '/references',
  '/quarantine': '/quarantine',
}
/* The Documentation tab's href is its first doc, but it lights across the
 * whole /documentation space. */
if (VAULT.length) TAB_PREFIX[vaultDocHref(VAULT[0].id)] = '/documentation'

export const isShellTabActive = (pathname) => (href) => {
  const prefix = TAB_PREFIX[href] ?? href
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/* Search: components (the roster) + every surface child. Shape per the
 * engine's matchSearchItems — { id, label, href, sectionLabel, keywords }. */
export const buildShellSearchItems = () => {
  const components = COMPONENTS_AZ.map((c) => ({
    id: c.slug,
    label: c.name,
    href: `/components/${c.slug}`,
    sectionLabel: CATEGORY_LABELS[c.category] ?? c.category,
    keywords: [c.description, c.pkg].filter(Boolean),
  }))
  /* EVERY route is a row, parent as well as child (2026-07-30 reachability
   * rule). This read `r.children` only, so a tab with no children contributed
   * nothing and was unreachable by search entirely — `/icons`, `/references`
   * and `/documentation` could not be found by typing their own names.
   * `/components` only escaped because the roster branch above covers it.
   *
   * ALL_ROUTES, never SHELL_ROUTES: quarantine holds a surface out of the
   * TREE, not out of the app. Searching the admitted list instead would make
   * every held page unfindable by name — the exact defect this rule exists to
   * stop, reintroduced by the gate meant to be reversible. */
  const surfaces = ALL_ROUTES.flatMap((r) => [
    { id: `tab-${r.id}`, label: r.label, href: r.path, sectionLabel: 'Surfaces' },
    ...(r.children ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      href: c.path,
      sectionLabel: r.label,
    })),
  ])
  /* Slot-pages — live React routes that live inside a vault chapter rather
   * than in ALL_ROUTES. Without this they left the surface list in the same
   * commit that made them chapter pages and became unfindable by name: the
   * 2026-07-30 reachability rule, broken by the fix that honoured the taxonomy. */
  const slotPages = Object.entries(CHAPTER_PAGES).flatMap(([chapter, pages]) =>
    pages.map((p) => ({
      id: p.id,
      label: p.label,
      href: p.path,
      sectionLabel: label(chapter),
    }))
  )
  const vaultDocs = VAULT_SEARCH_ITEMS.map((d) => ({
    id: d.path,
    label: d.label,
    href: d.path,
    sectionLabel: 'Documentation',
    keywords: d.tags,
    /* content search (wave-4 parity): section headings extracted by the
     * engine — matchSearchItems surfaces the hit as the row's subtext. */
    headings: d.headings,
  }))
  return [...components, ...surfaces, ...slotPages, ...vaultDocs]
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
    path: '/components',
    children: items.map((c) => ({ id: c.slug, label: c.name, path: `/components/${c.slug}` })),
  }))
