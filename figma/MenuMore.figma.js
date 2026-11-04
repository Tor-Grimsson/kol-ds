// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-912
// source=packages/component/src/molecules/Menu.jsx
// component=MenuMore
import figma from 'figma'
const instance = figma.selectedInstance
// variant float (float-everything W4 row 53, 2026-11-04): the ⋮ circle and the More sheet
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const xv = variant === 'float' ? ' variant="float"' : ''
export default {
  example: figma.code`<MenuMore${xv} label="Graph settings" items={items} />`,
  imports: ["import { MenuMore } from \"@kolkrabbi/kol-component\""],
  id: 'MenuMore',
}
