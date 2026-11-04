// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19809
// source=packages/shell/src/DocumentCapsule.jsx
// component=DocumentCapsule
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<DocumentCapsule name="Still in motion" status="✓ Saved" onBack={back} menuItems={menuItems}${sf} />`,
  imports: ["import { DocumentCapsule } from \"@kolkrabbi/kol-shell\""],
  id: 'DocumentCapsule',
}
