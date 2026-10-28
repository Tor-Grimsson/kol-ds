import { KitOptions } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'md'

/* the kit's options — language, pages in the PDF, the letter's Role and Company; all in the URL */
export default function KitOptionsPreview() {
  return <VoyagerResume><div className="relative h-[420px]"><KitOptions /></div></VoyagerResume>
}
