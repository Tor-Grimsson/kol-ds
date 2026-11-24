// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11968
// source=packages/component/src/molecules/Slider.jsx
// component=Slider
import figma from 'figma'

// Slider variant="kolbox"; input=true is readout="input". (F4, 2026-11-19)
const instance = figma.selectedInstance
const input = instance.getEnum('input', { false: false, true: true })
const value = instance.getEnum('position', { 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 })
const example = figma.code`<Slider variant="kolbox" readout="${input ? 'input' : 'value'}" value={${value}} min={0} max={100} />`

export default {
  example,
  imports: ["import { Slider } from \"@kolkrabbi/kol-component\""],
  id: 'SliderKolbox',
  metadata: { nestable: true },
}
