import { LabeledJack, JackSocket } from '@kolkrabbi/kol-controls'

/* a consumer's WIRED jack: routing props come from its own context; here the
 * context is a constant, which is enough to show `jackComponent` taking it */
const WiredJack = (props) => <JackSocket {...props} active />

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* A jack with its label in four positions, one with a dim icon, one dimmed whole. */
export default function LabeledJackDemo() {
  return (
    <div style={PLATE}>
      <LabeledJack type="in" label="in" labelPosition="top" color="#4ade80" />
      <LabeledJack type="out" label="out" />
      <LabeledJack type="in" label="cv" labelPosition="left" color="#497DA2" />
      <LabeledJack type="out" label="out" labelPosition="right" />
      <LabeledJack type="out" icon="play" />
      <LabeledJack type="in" label="off" dim color="#4ade80" />
      <LabeledJack type="out" label="wired" jackComponent={WiredJack} />
    </div>
  )
}
