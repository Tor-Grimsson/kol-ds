import { ResumeSource } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the source page — every fact the treatments read, in one place */
export default function ResumeSourcePreview() {
  return <VoyagerResume><ResumeSource /></VoyagerResume>
}
