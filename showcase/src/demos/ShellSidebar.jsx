import { ShellSidebar } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

const ROUTES = [
  { id: 'demo-atoms', label: 'Atoms', path: '/components/tier/atoms', children: [
    { id: 'demo-button', label: 'Button', path: '/components/button' },
    { id: 'demo-badge', label: 'Badge', path: '/components/badge' },
  ] },
  { id: 'demo-molecules', label: 'Molecules', path: '/components/tier/molecules', children: [
    { id: 'demo-dropdown', label: 'Dropdown', path: '/components/dropdown' },
  ] },
]

/* The left rail's tree: a category, its chapters, their pages. A label opens its page, a chevron folds. */
export default function ShellSidebarDemo() {
  return <ShellSidebar routes={ROUTES} basePath="/" label="Components" labelTo="/components" />
}
