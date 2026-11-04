// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=577-20000
// source=packages/component/src/molecules/Slider.jsx
// component=Slider
import figma from 'figma'
const instance = figma.selectedInstance
// variant (float-everything W2 row 23, 2026-11-04): float is the label and a mono readout over a 3px capsule track
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
export default {
  example: variant === 'float'
    ? figma.code`<Slider variant="float" label="Intensity" value={value} onChange={setValue} readout="value" formatValue={formatPct} />`
    : figma.code`<Slider label="Opacity" value={value} onChange={setValue} />`,
  imports: ["import { Slider } from \"@kolkrabbi/kol-component\""],
  id: 'Slider',
}
