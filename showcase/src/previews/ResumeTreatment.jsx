import { ResumeTreatment } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* a treatment by its route slug, /resume/t/:slug — the export controls, the options and the sheet; outside that route
 * it sends you to /resume/library, so here it is shown by name only (apps/resume runs it live) */
export default function ResumeTreatmentPreview() {
  return <VoyagerResume><p className="kol-sans-body-02 text-meta">ResumeTreatment renders under the host's <code>/resume/t/:slug</code> route — open apps/resume to walk it.</p></VoyagerResume>
}
