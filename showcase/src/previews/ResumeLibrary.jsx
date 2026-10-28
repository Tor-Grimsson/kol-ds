import { ResumeLibrary } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* every treatment as a card — open it, or export it from here */
export default function ResumeLibraryPreview() {
  return <VoyagerResume><ResumeLibrary /></VoyagerResume>
}
