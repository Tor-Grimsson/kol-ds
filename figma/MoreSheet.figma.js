// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1398
// source=packages/shell/src/AppFloatNav.jsx
// component=AppFloatNav
import figma from 'figma'

// the float menu is AppFloatNav's ··· sheet: it opens from the nav, fed by sheetItems
const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''

export default {
  example: figma.code`<AppFloatNav variant="mobile" shape="pill"${sf} items={items} sheetItems={[{ path: '/library', icon: 'nav-library', label: 'Library' }, …]} />`,
  imports: ["import { AppFloatNav } from \"@kolkrabbi/kol-shell\""],
  id: 'MoreSheet',
}
