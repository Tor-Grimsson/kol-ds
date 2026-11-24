// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12218
// source=packages/component/src/molecules/ColorInputRow.jsx
// component=ColorInputRow
import figma from 'figma'

// ColorInputRow variant="kolbox" (kolbox's FillRow); hidden is the dimmed, eye-off row. (F4, 2026-11-19)
const instance = figma.selectedInstance
const value = instance.getString('value')
const opacity = instance.getBoolean('show opacity') ? instance.getString('opacity') : undefined
const lit = instance.getBoolean('lit')
const hidden = instance.getEnum('hidden', { false: false, true: true })
const example = figma.code`<ColorInputRow variant="kolbox" value="${value}"${opacity !== undefined ? ` opacity={${parseFloat(opacity) || 0}}` : ''}${lit ? ' lit' : ''}${hidden ? ' hidden' : ''} />`

export default {
  example,
  imports: ["import { ColorInputRow } from \"@kolkrabbi/kol-component\""],
  id: 'ColorInputRowKolbox',
  metadata: { nestable: true },
}
