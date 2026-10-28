import { ContactLine } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'md'

/* the strip that closes the cover and the back; every entry a live link in the PDF */
export default function ContactLinePreview() {
  return <VoyagerResume><div className="flex flex-col w-[480px]"><ContactLine /></div></VoyagerResume>
}
