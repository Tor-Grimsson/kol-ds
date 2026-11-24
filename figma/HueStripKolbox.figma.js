// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11453
// source=packages/component/src/organisms/SpectrumControls.jsx
// component=HueStrip
import figma from 'figma'

// HueStrip variant="kolbox" (kolbox's HueSlider). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<HueStrip variant="kolbox" />`

export default {
  example,
  imports: ["import { HueStrip } from \"@kolkrabbi/kol-component\""],
  id: 'HueStripKolbox',
  metadata: { nestable: true },
}
