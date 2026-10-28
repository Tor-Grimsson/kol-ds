import { LangToggle } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'sm'

/* EN or IS — writes `?lang=` to the URL; every page reads it */
export default function LangTogglePreview() {
  return <VoyagerResume><LangToggle /></VoyagerResume>
}
