// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1332-11693
// source=packages/component/src/molecules/ModalShell.jsx
// component=ModalShell
import figma from 'figma'

const instance = figma.selectedInstance
// header, body and footer are slots; padding and gap are the caller's className
const variant = instance.getEnum('variant', { "lift": "lift", "bordered": "bordered", "float": "float", "settings": "settings" })
const v = variant === 'lift' ? '' : ` variant="${variant}"`

export default {
  example: figma.code`<ModalShell${v} header={header} footer={footer} className="gap-4 p-5">{body}</ModalShell>`,
  imports: ["import { ModalShell } from \"@kolkrabbi/kol-component\""],
  id: 'ModalShell',
}
