/**
 * Single navigation tree for the labs shell.
 *
 * Leaf shape:
 *   { id: 'about',  label: 'About' }   — page section anchor (#about)
 *   { to: '/about', label: 'About' }   — sub-route link
 * Group shape (no id, no to):
 *   { label: 'Color', children: [...] }
 *
 * The Components entry expands into category groups (Atoms, Molecules…), each
 * component a route leaf — generated from the registry so nav and pages stay in
 * lockstep. Add a top-level entry here + a matching <Route> in App.jsx.
 */

import { componentsByCategory, CATEGORY_LABELS } from './lib/registry.js'

const componentChildren = componentsByCategory().map(([cat, items]) => ({
  label: CATEGORY_LABELS[cat] ?? cat,
  children: items.map((c) => ({ to: `/components/${c.slug}`, label: c.name })),
}))

export const NAV_TREE = [
  { id: 'home', label: 'Home', to: '/', icon: 'book-open' },
  { id: 'components', label: 'Components', to: '/components', icon: 'component', children: componentChildren },
]

/* Find the active top-level page given a pathname. */
export function getActivePage(pathname) {
  if (pathname === '/') return NAV_TREE.find((n) => n.to === '/')
  return NAV_TREE.find((n) => n.to !== '/' && pathname.startsWith(n.to))
}
