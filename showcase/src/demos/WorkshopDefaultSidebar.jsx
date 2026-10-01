import { WorkshopDefaultSidebar } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

/* The example right rail of a workshop: the current section's sibling pages and links. The demo
 * mounts it at `/components`, so the section is the page you are on. */
const ROUTES = [
  { id: 'here', label: 'This section', path: 'workshop-default-sidebar', children: [
    { id: 'a', label: 'Cards', path: 'cards', links: { repo: 'https://github.com/Tor-Grimsson/kol-ds' } },
    { id: 'b', label: 'Charts', path: 'charts' },
  ] },
]

export default function WorkshopDefaultSidebarDemo() {
  return <WorkshopDefaultSidebar routes={ROUTES} basePath="/components" />
}
