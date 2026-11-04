// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-807
// source=packages/component/src/molecules/Menu.jsx
// component=MenuDatePicker
import figma from 'figma'
const instance = figma.selectedInstance
// variant float (float-everything W2 row 33, 2026-11-04): the date chip — the value in mono on the well
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
export default {
  example: variant === 'float'
    ? figma.code`<MenuDatePicker variant="float" groups={groups} value={value} onChange={setValue} label="2026-07-01" />`
    : figma.code`<MenuDatePicker groups={groups} value={value} onChange={setValue} label={labelOf(value)} />`,
  imports: ["import { MenuDatePicker } from \"@kolkrabbi/kol-component\""],
  id: 'MenuDatePicker',
}
