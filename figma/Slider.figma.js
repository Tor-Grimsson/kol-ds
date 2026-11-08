// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=577-20000
// source=packages/component/src/molecules/Slider.jsx
// component=Slider
import figma from 'figma'
// rebuilt 2026-11-07 to the code: nests _Slider base (track + thumb) and Input (the readout); axes from usage —
// variant minimal (default) · float · scrub · panel · dual, readout input (default) · value · none, direction.
// The value is the base's run width, not a property.
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "minimal": "minimal", "float": "float", "scrub": "scrub", "panel": "panel", "dual": "dual" })
const readout = instance.getEnum('readout', { "input": "input", "value": "value", "none": "none" })
const direction = instance.getEnum('direction', { "horizontal": "horizontal", "vertical": "vertical" })
const label = instance.getString('label')
const xv = variant === 'minimal' ? '' : ` variant="${variant}"`
const xr = readout === 'input' || variant === 'panel' || variant === 'dual' || variant === 'scrub' ? '' : ` readout="${readout}"`
const xd = direction === 'vertical' ? ' direction="vertical"' : ''
export default {
  example: variant === 'dual'
    ? figma.code`<Slider variant="dual" label="${label}" value={inPoint} value2={outPoint} onChange={setIn} onChange2={setOut} />`
    : figma.code`<Slider${xv} label="${label}" value={value} onChange={setValue}${xr}${xd} />`,
  imports: ["import { Slider } from \"@kolkrabbi/kol-component\""],
  id: 'Slider',
}
