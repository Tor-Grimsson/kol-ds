import { PanelLabel, LED } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The label wrapper in its four positions around an LED. */
export default function PanelLabelDemo() {
  return (
    <div style={ROW}>
      <PanelLabel label="top" labelPosition="top" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="bottom" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="left" labelPosition="left" gap={4}><LED active color="green" /></PanelLabel>
      <PanelLabel label="right" labelPosition="right" gap={4}><LED active color="green" /></PanelLabel>
    </div>
  )
}
