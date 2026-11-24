// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11238
// source=packages/component/src/atoms/Button.jsx
// component=Button
import figma from 'figma'

// kolbox's icon button: Button variant="kolbox" iconOnly; lit and active are `pressed`. (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const icon = glyph('icon glyph')
const lit = instance.getEnum('state', { default: false, lit: true, active: true, hover: false })
const example = figma.code`<Button variant="kolbox" iconOnly="${icon}" aria-label="${icon}"${lit ? ' pressed' : ''} />`

export default {
  example,
  imports: ["import { Button } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonKolboxIconOnly',
  metadata: { nestable: true },
}
