import { ShellSidebar } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

const ROUTES = [
  { id: 'preview-atoms', label: 'Atoms', path: '/components/tier/atoms', children: [
    { id: 'preview-button', label: 'Button', path: '/components/button' },
    { id: 'preview-badge', label: 'Badge', path: '/components/badge' },
  ] },
  { id: 'preview-molecules', label: 'Molecules', path: '/components/tier/molecules', children: [
    { id: 'preview-dropdown', label: 'Dropdown', path: '/components/dropdown' },
  ] },
]

/* The left rail's tree: a category, its chapters, their pages. A label opens its page, a chevron folds. */
export default function ShellSidebarPreview() {
  return <ShellSidebar routes={ROUTES} basePath="/" label="Components" labelTo="/components" />
}
