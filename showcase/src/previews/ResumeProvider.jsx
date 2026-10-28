import { ResumeProvider, ContactLine } from '@kolkrabbi/kol-resume'
import { CONTACT } from 'voyager-fixture/resume'

export const stage = 'md'

/* the kit's one seam: the person, contact, letters, portfolio and images come in here; every page reads them back */
export default function ResumeProviderPreview() {
  return (
    <ResumeProvider contact={CONTACT}>
      <div className="flex flex-col w-[480px]"><ContactLine /></div>
    </ResumeProvider>
  )
}
