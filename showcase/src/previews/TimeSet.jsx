import { TimeSet } from '@kolkrabbi/kol-component'
import { VOYAGER_MILESTONES } from 'voyager-fixture/timeline'

export const stage = 'full'

/* a project in time — Timeline · Month · Week · Day over one model (kol-atlas's views, Day added): Voyager's Field Manual
 * 2027, its phases, checkpoints, the December break and the Today line. Click a phase for its detail. */
export default function TimeSetPreview() {
  return <div className="w-full p-6"><TimeSet milestones={VOYAGER_MILESTONES} /></div>
}
