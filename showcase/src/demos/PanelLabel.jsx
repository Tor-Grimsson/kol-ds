import { PanelLabel, LED } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The label wrapper in its four positions around an LED. */
export default function PanelLabelDemo() {
  return (
    <div style={PLATE}>
      <PanelLabel label="top" labelPosition="top" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="bottom" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="left" labelPosition="left" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="right" labelPosition="right" gap={4}><LED active color="green" /></PanelLabel>
    </div>
  )
}
