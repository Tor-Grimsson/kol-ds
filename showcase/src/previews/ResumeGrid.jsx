import { ResumeGrid } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* modular Swiss grid — a numbered experience index and a four-cell footer */
export default function ResumeGridPreview() {
  return <VoyagerResume><ResumeGrid /></VoyagerResume>
}
