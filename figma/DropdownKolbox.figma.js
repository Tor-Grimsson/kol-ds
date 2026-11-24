// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11884
// source=packages/component/src/molecules/Dropdown.jsx
// component=Dropdown
import figma from 'figma'

// Dropdown variant="kolbox"; outlined=false is tone="grey". (F4, 2026-11-19)
const instance = figma.selectedInstance
const value = instance.getString('value')
const outlined = instance.getEnum('outlined', { true: true, false: false })
const disabled = instance.getEnum('state', { default: false, hover: false, focus: false, disabled: true, invalid: false, open: false })
const example = figma.code`<Dropdown variant="kolbox"${outlined ? '' : ' tone="grey"'} value="${value}" options={['${value}']}${disabled ? ' disabled' : ''} />`

export default {
  example,
  imports: ["import { Dropdown } from \"@kolkrabbi/kol-component\""],
  id: 'DropdownKolbox',
  metadata: { nestable: true },
}
