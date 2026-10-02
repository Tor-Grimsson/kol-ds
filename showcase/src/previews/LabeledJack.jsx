import { LabeledJack, JackSocket } from '@kolkrabbi/kol-hardware'

/* a consumer's WIRED jack: routing props come from its own context; here the
 * context is a constant, which is enough to show `jackComponent` taking it */
const WiredJack = (props) => <JackSocket {...props} active />

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* A jack with its label in four positions, one with a dim icon, one dimmed whole. */
export default function LabeledJackPreview() {
  return (
    <div style={ROW}>
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
