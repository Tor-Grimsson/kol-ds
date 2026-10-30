import { StudioDetail } from '@kolkrabbi/kol-shell'
import { VOYAGER } from 'voyager-fixture'

export const stage = 'full'

/* the Studio's detail page — ‹ Back as a text link, the prose column, the preview, the actions as data (studio-hub's
 * module and patch pages are read against it) */
export default function StudioDetailPreview() {
  return (
    <StudioDetail
      back={{ onClick: () => {} }}
      title="Field kit"
      subtitle="3 modules, 4 connections"
      description="The patch a Voyager team runs on the boat: a clock, an LFO and a scope."
      sections={[{ label: 'Specifications', rows: [{ label: 'Modules: 3' }, { label: 'Connections: 4' }] }, { label: 'Tags', text: 'field, clock' }]}
      preview={{ src: VOYAGER.assets.MOOD[1]?.url, alt: 'Field kit' }}
      actions={[{ label: 'Load', onClick: () => {} }]}
    />
  )
}
