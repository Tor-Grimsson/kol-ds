import { ResumeMarginalia } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* single-column treatment, section labels in a left gutter */
export default function ResumeMarginaliaPreview() {
  return <VoyagerResume><ResumeMarginalia /></VoyagerResume>
}
