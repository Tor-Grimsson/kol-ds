import { WorkshopSidebar } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

const ROUTES = [
  { id: 'dashboard', label: 'Dashboard', path: 'dashboard', children: [{ id: 'cards', label: 'Cards', path: 'cards' }, { id: 'charts', label: 'Charts', path: 'charts' }] },
  { id: 'chess', label: 'Chess', path: 'chess', children: [{ id: 'board', label: 'Board', path: 'board' }] },
]

/* The example left rail of a workshop: its routes, then its docs. */
export default function WorkshopSidebarPreview() {
  return <WorkshopSidebar routes={ROUTES} inventory={[{ id: 'setup', title: 'Setup' }, { id: 'data', title: 'Data' }]} basePath="/components" />
}
