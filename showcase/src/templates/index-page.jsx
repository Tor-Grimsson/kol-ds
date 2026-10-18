import { Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'

/* INDEX — a page about its pages: a header, a table of what the sections hold, then each section's pages as
 * links with one line each (the Development home) */
export const stage = 'full'
const link = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export default function IndexTemplate() {
  return (
    <div className="flex flex-col gap-8 w-full p-8">
      <DocHeader title="Development" lede="Generated from the repo itself — not the design system, the instruments around it." />
      <Table width="column" columns={[{ accessor: 'section', header: 'Section' }, { accessor: 'holds', header: 'Holds' }]}
        rows={[{ id: 't', section: 'Tools', holds: 'the reference graph and the admission ledger' }, { id: 'r', section: 'Records', holds: 'the phase log and the open questions' }]} />
      <DocSection id="tools" title="Tools">
        <p><Link to="/references" className={link}>References</Link> <span className="text-meta">— what depends on what, with a weight.</span></p>
        <p><Link to="/quarantine" className={link}>Quarantine</Link> <span className="text-meta">— what the sidebar admits and holds.</span></p>
      </DocSection>
    </div>
  )
}
