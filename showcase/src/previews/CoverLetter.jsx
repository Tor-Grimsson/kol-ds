import { CoverLetter } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the cover letter — the first of the person's letters, [Role] and [Company] filled from the URL */
export default function CoverLetterPreview() {
  return <VoyagerResume><CoverLetter /></VoyagerResume>
}
