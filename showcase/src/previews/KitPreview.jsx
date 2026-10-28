import { KitPreview } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the whole kit as A4 sheets — cover, resume, letter, portfolio, back */
export default function KitPreviewPreview() {
  return <VoyagerResume><KitPreview mode="a4" /></VoyagerResume>
}
