import { COMPONENTS_AZ, CATEGORY_LABELS, groupComponents } from './registry.js'
import { BLOCKS } from './blocks-registry.js'
import { SETS } from './sets-registry.js'

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
}

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
  const surfaces = SHELL_ROUTES.flatMap((r) =>
    (r.children ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      href: c.path,
      sectionLabel: r.label,
    }))
  )
  return [...components, ...surfaces]
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
