import { COMPONENTS_AZ, CATEGORY_LABELS, groupComponents } from './registry.js'
import { BLOCKS } from './blocks-registry.js'
import { SETS } from './sets-registry.js'
import { VAULT, VAULT_SEARCH_ITEMS, vaultDocHref } from './vault.js'

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

/* Header tabs. `id` is required: ShellSidebar keys collapse state by it. */
export const SHELL_ROUTES = [
  {
    id: 'foundations',
    label: 'Foundations',
    icon: 'layers',
    path: '/foundations',
    children: [
      { id: 'foundations-tokens', label: 'Tokens', path: '/foundations' },
      { id: 'foundations-color', label: 'Color', path: '/foundations/color' },
      { id: 'foundations-type', label: 'Typography', path: '/foundations/typography' },
    ],
  },
  { id: 'icons', label: 'Icons', icon: 'grid', path: '/icons' },
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
  /* Documentation is a SYSTEM (user ruling 2026-07-30) — its own top-level
   * area with its own URL space, like kolkrabbi.io/workshop's Documentation.
   * Never a child page under Docs. */
  /* The reference graph — generated, so it sits beside Documentation rather
   * than under Docs: it is not a written page, it is what the repo measures
   * about itself. */
  { id: 'references', label: 'References', icon: 'library', path: '/references' },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'journal',
    path: VAULT.length ? vaultDocHref(VAULT[0].id) : '/documentation',
  },
]

/* Which tab lights up for a path. The shell's built-in predicate is
 * prefix-only, which can't express "the Docs tab targets a child page but
 * highlights across all of /docs" — so the consumer supplies this. */
const TAB_PREFIX = {
  '/foundations': '/foundations',
  '/icons': '/icons',
  '/components': '/components',
  '/blocks': '/blocks',
  '/sets': '/sets',
  '/docs/shell-and-layout': '/docs',
  '/references': '/references',
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
   * `/components` only escaped because the roster branch above covers it. */
  const surfaces = SHELL_ROUTES.flatMap((r) => [
    { id: `tab-${r.id}`, label: r.label, href: r.path, sectionLabel: 'Surfaces' },
    ...(r.children ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      href: c.path,
      sectionLabel: r.label,
    })),
  ])
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
  return [...components, ...surfaces, ...vaultDocs]
}

/* The component tree in the shell's `{ id, label, path }` child shape, one
 * group per grouping-mode bucket — feeds a ShellSidebar under the real nav. */
export const componentTreeRoutes = (mode) =>
  groupComponents(mode).map(([key, label, items]) => ({
    id: `cmp-${key}`,
    label,
    path: '/components',
    children: items.map((c) => ({ id: c.slug, label: c.name, path: `/components/${c.slug}` })),
  }))
