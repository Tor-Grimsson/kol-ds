// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1625-8555
// source=packages/component/src/molecules/ModalHeader.jsx
// component=ModalHeader
import figma from 'figma'

// lead = what sits before the title (avatar · icon · none); `actions` is the trailing close Button
const instance = figma.selectedInstance
const lead = instance.getEnum('lead', { "avatar": "avatar", "icon": "icon", "none": "none" })
const variant = instance.getEnum('variant', { "default": "", "float": ' variant="float"' })
const title = instance.getString('title')
const actions = instance.getBoolean('actions')
const l = lead === 'avatar' ? ' avatar="TG"' : lead === 'icon' ? ' icon="search"' : ''
const a = actions ? ' actions={<Button variant="float" size="sm" tone="ghost" iconOnly="x" aria-label="Close" />}' : ''
export default {
  example: figma.code`<ModalHeader${variant}${l} title="${title}"${a} />`,
  imports: ["import { ModalHeader, Button } from \"@kolkrabbi/kol-component\""],
  id: 'ModalHeader',
}
