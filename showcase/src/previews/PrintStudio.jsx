import { PrintStudio } from '@kolkrabbi/kol-styleguide'
import sample from '@kolkrabbi/kol-print/fixtures/probe.md?raw'

export const stage = 'full'

/* markdown to a Kolkrabbi A4 document — PDF, DOCX and MD on @kolkrabbi/kol-print; the studio is the caller's */
const studio = { studio: 'Voyager Expeditions ehf', designer: 'Hekla Sveinsdóttir', address: 'Grandagarður 8, 101 Reykjavík', contacts: ['voyager.example', 'hello@voyager.example'] }

export default function PrintStudioPreview() {
  return (
    <div style={{ height: 640 }}>
      <PrintStudio studio={studio} meta={{ project: 'Voyager Probe', slug: 'probe', client: 'Voyager Expeditions ehf', dates: 'Oct 2026' }} markdown={sample} />
    </div>
  )
}
