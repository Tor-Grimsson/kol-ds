import { ExportButtons, TREATMENTS } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'md'

/* a treatment's downloads — PDF, and the editable SVG zip for kits; they call the host's /api/export */
export default function ExportButtonsPreview() {
  return <VoyagerResume><div className="relative h-[120px]"><ExportButtons treatment={TREATMENTS[1]} /></div></VoyagerResume>
}
