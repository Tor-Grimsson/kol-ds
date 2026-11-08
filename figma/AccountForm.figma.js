// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1264
// source=packages/shell/src/AccountForm.jsx
// component=AccountForm
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "box": "box", "column": "column" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const title = instance.getString('title')
const footerText = instance.getString('footerText')
const footerLink = instance.getString('footerLink')
const done = instance.getEnum('state', { "done": instance.getString('done') })
// `fields` (slot): one Input per field — the placeholder is the field's name; state error is AccountForm's own (a throw from onSubmit), busy the pending submit
const sf = variant === 'box' && surface !== 'solid' ? ` surface="${surface}"` : ''
const v = variant === 'box' ? ' variant="box"' : ''
const d = done ? ` done="${done}"` : ''
export default {
  example: figma.code`<AccountForm${v}${sf} title="${title}" fields={fields} okLabel={okLabel} footer={{ text: "${footerText}", link: "${footerLink}", onPress }} onSubmit={onSubmit}${d} />`,
  imports: ["import { AccountForm } from \"@kolkrabbi/kol-shell\""],
  id: 'AccountForm',
}
