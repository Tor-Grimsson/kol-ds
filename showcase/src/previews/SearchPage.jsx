import { SearchPage } from '@kolkrabbi/kol-workshop'

export const frame = 620

const ITEMS = [
  { id: 'button', title: 'Button', kind: 'component', space: 'library', category: 'Atoms', description: 'The action atom.', href: '/components/button' },
  { id: 'badge', title: 'Badge', kind: 'component', space: 'library', category: 'Atoms', description: 'A small status label.', href: '/components/badge' },
  { id: 'dropdown', title: 'Dropdown', kind: 'component', space: 'library', category: 'Molecules', description: 'Pick one from a list.', href: '/components/dropdown' },
  { id: 'install', title: 'Installing KOL', kind: 'doc', space: 'docs', category: 'Overview', description: 'What a consumer app must provide.', href: '/library/start' },
]

/* The search results page over four items — type in the box (try "b"). The query lives in this
 * frame's own URL. */
export default function SearchPagePreview() {
  return (
    <div className="p-6">
      <SearchPage items={ITEMS} spaces={[{ value: 'library', label: 'Library' }, { value: 'docs', label: 'Docs' }]} />
    </div>
  )
}
