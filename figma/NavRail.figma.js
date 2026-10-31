// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=277-527
// source=packages/component/src/organisms/NavRail.jsx
// component=NavRail
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { side: 'side', top: 'top' })

export default {
  example: variant === 'top'
    ? figma.code`<NavRail variant="top" logomark={logomark} items={items} currentPath={path} onNavigate={navigate} actions={actions} />`
    : figma.code`<NavRail items={items} bottomItems={bottomItems} currentPath={path} onNavigate={navigate} />`,
  imports: ["import { NavRail } from \"@kolkrabbi/kol-component\""],
  id: 'NavRail',
}
