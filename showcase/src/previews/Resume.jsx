import { Resume } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the resume, the kit's own treatment — bio, skills, education, languages, experience */
export default function ResumePreview() {
  return <VoyagerResume><Resume /></VoyagerResume>
}
