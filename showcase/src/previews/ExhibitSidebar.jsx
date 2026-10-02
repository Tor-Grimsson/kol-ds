import { ExhibitSidebar } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

/* The rail block an exhibit page registers: on this page, its documentation links, quick actions. */
export default function ExhibitSidebarPreview() {
  return (
    <ExhibitSidebar
      basePath="/components"
      sections={[{ id: 'overview', title: 'Overview', level: 2 }, { id: 'cards', title: 'Cards', level: 2 }]}
      links={[{ id: 'setup', label: 'Setup' }, { id: 'data', label: 'Data' }]}
    />
  )
}
