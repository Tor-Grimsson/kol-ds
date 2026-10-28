import { ResumeRail } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* facts in a tinted left rail, experience down the wide right column */
export default function ResumeRailPreview() {
  return <VoyagerResume><ResumeRail /></VoyagerResume>
}
