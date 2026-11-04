// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1236
// source=packages/shell/src/AppFloatNav.jsx
// component=AppFloatNav
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "mobile": "mobile", "dock": "dock", "panel": "panel", "transport": "transport" })
const labels = instance.getEnum('labels', { "true": "true", "false": "false" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const shape = instance.getEnum('shape', { "pill": "pill", "bar": "bar" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
const lb = labels === 'true' ? ' labels' : ''

export default {
  example: variant === 'transport'
    ? figma.code`<AppFloatNav variant="transport"${sf} items={transportItems} />`
    : figma.code`<AppFloatNav variant="${variant}" shape="${shape}"${sf}${lb} items={items} sheetItems={moreItems} currentPath={path} onNavigate={navigate} />`,
  imports: ["import { AppFloatNav } from \"@kolkrabbi/kol-shell\""],
  id: 'AppFloatNav',
}
