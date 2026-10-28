import { Portfolio } from '@kolkrabbi/kol-resume'
import { VoyagerResume } from '../lib/resumeFixture.jsx'

export const stage = 'full'

/* the portfolio grid — the person's projects, local heroes where the app has them */
export default function PortfolioPreview() {
  return <VoyagerResume><Portfolio preview /></VoyagerResume>
}
