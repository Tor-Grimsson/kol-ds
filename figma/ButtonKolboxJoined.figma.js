// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11434
// source=packages/component/src/molecules/ButtonGroup.jsx
// component=ButtonGroup
import figma from 'figma'

// One cell of ButtonGroup layout="joined" variant="kolbox": an entry of its `options`. (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const icon = glyph('icon glyph')
const example = figma.code`{ icon: '${icon}', label: '${icon}' }`

export default {
  example,
  imports: ["import { ButtonGroup } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonKolboxJoined',
  metadata: { nestable: true },
}
