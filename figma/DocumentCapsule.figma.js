// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19788
// source=packages/shell/src/DocumentCapsule.jsx
// component=DocumentCapsule
import figma from 'figma'

export default {
  example: figma.code`<DocumentCapsule name="Still in motion" status="Saved" statusIcon="check" onBack={back} menuItems={menuItems} />`,
  imports: ["import { DocumentCapsule } from \"@kolkrabbi/kol-shell\""],
  id: 'DocumentCapsule',
}
