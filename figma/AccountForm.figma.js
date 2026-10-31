// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1264
// source=packages/shell/src/AccountForm.jsx
// component=AccountForm
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''

export default {
  example: figma.code`<AccountForm variant="box"${sf} title="Sign in" fields={fields} okLabel="Sign in" footer={footer} onSubmit={signIn} />`,
  imports: ["import { AccountForm } from \"@kolkrabbi/kol-shell\""],
  id: 'AccountForm',
}
