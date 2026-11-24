// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11457
// source=packages/component/src/organisms/SpectrumControls.jsx
// component=AlphaStrip
import figma from 'figma'

// AlphaStrip variant="kolbox" (kolbox's OpacitySlider). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<AlphaStrip variant="kolbox" />`

export default {
  example,
  imports: ["import { AlphaStrip } from \"@kolkrabbi/kol-component\""],
  id: 'AlphaStripKolbox',
  metadata: { nestable: true },
}
