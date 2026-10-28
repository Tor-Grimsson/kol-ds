import { Backside } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the kit's back sheet — the closing words (`copy.back`) and the contact line */
export default function BacksidePreview() {
  return <VoyagerResume><Backside /></VoyagerResume>
}
