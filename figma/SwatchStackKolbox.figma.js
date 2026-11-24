// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11641
// source=packages/component/src/molecules/SwatchControls.jsx
// component=SwatchStack
import figma from 'figma'

// SwatchStack variant="kolbox"; stroke active is activePaint="stroke". (F4, 2026-11-19)
const instance = figma.selectedInstance
const paint = instance.getEnum('stroke active', { false: 'fill', true: 'stroke' })
const example = figma.code`<SwatchStack variant="kolbox" activePaint="${paint}" />`

export default {
  example,
  imports: ["import { SwatchStack } from \"@kolkrabbi/kol-component\""],
  id: 'SwatchStackKolbox',
  metadata: { nestable: true },
}
