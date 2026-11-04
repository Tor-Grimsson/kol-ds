// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-498
// source=packages/component/src/molecules/Menu.jsx
// component=MenuTrigger
import figma from 'figma'

const instance = figma.selectedInstance
const iconOnly = instance.getEnum('iconOnly', { "true": "true", "false": "false" })
// variant float (2026-11-04): the capsule on the well
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const xv = variant === 'float' ? ' variant="float"' : ''
const open = instance.getEnum('open', { "true": "true", "false": "false" })
const xo = open === 'true' ? ' open' : ''

export default {
  example: iconOnly === 'true'
    ? figma.code`<MenuTrigger${xv}${xo} iconOnly aria-label="More" {...props} />`
    : figma.code`<MenuTrigger${xv}${xo} icon="filter-lines" {...props}>Filter</MenuTrigger>`,
  imports: ["import { MenuTrigger } from \"@kolkrabbi/kol-component\""],
  id: 'MenuTrigger',
}
