// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11549
// source=packages/shell/src/DocumentCapsule.jsx
// component=DocumentCapsule
import figma from 'figma'

// DocumentCapsule variant="kolbox": the top rail's document title; open is its menu open. (F4, 2026-11-19)
const instance = figma.selectedInstance
const name = instance.getString('name')
const open = instance.getEnum('open', { false: false, true: true })
const example = figma.code`<DocumentCapsule variant="kolbox" name="${name}"${open ? ' open' : ''} menuItems={menuItems} />`

export default {
  example,
  imports: ["import { DocumentCapsule } from \"@kolkrabbi/kol-shell\""],
  id: 'DocumentCapsuleKolbox',
  metadata: { nestable: true },
}
