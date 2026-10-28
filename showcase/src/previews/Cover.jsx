import { Cover } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the kit's front sheet — portrait, name, role, the contact line; the person is ResumeProvider's */
export default function CoverPreview() {
  return <VoyagerResume><Cover /></VoyagerResume>
}
