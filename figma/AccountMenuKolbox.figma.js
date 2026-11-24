// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12874
// source=packages/component/src/molecules/AccountMenu.jsx
// component=AccountMenu
import figma from 'figma'

// AccountMenu variant="kolbox" (kolbox's AccountChip, the trigger). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<AccountMenu variant="kolbox" initial={account.name[0]} />`

export default {
  example,
  imports: ["import { AccountMenu } from \"@kolkrabbi/kol-component\""],
  id: 'AccountMenuKolbox',
  metadata: { nestable: true },
}
