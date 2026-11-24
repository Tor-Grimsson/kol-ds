// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11527
// source=packages/component/src/atoms/Kbd.jsx
// component=Kbd
import figma from 'figma'

// Kbd variant="kolbox"; onAccent on a lit accent row. (F4, 2026-11-19)
const instance = figma.selectedInstance
const label = instance.getString('label')
const onAccent = instance.getEnum('onAccent', { false: false, true: true })
const example = figma.code`<Kbd variant="kolbox" size="sm"${onAccent ? ' onAccent' : ''}>${label}</Kbd>`

export default {
  example,
  imports: ["import { Kbd } from \"@kolkrabbi/kol-component\""],
  id: 'KbdKolbox',
  metadata: { nestable: true },
}
