// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19883
// source=packages/shell/src/WorkspaceStrips.jsx
// component=AccountFooter
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<AccountFooter name="Kolkrabbi" workspace="Personal workspace" initial="K" onPress={openAccount} />`,
  imports: ["import { AccountFooter } from \"@kolkrabbi/kol-shell\""],
  id: 'AccountFooter',
}
