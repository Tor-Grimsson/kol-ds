import { WalkthroughPanel } from '@kolkrabbi/kol-shell'
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const frame = 520

const STEPS = [
  { title: 'Welcome', text: ['A stepped intro card.', 'The chevrons move between steps.'] },
  { title: 'Steps are content', text: ['Each step is a title and its lines, with an optional illustration.'] },
  { title: 'Ready', actions: <Button variant="primary">Get started</Button> },
]

/* The centred, stepped intro card of an app's home page. */
export default function WalkthroughPanelDemo() {
  return (
    <div className="relative min-h-dvh">
      <WalkthroughPanel steps={STEPS} iconComponent={Icon} />
    </div>
  )
}
