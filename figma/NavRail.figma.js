// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=277-527
// source=packages/component/src/organisms/NavRail.jsx
// component=NavRail
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { side: 'side', top: 'top', float: 'float' })
const collapsed = instance.getEnum('collapsed', { "false": false, "true": true })

export default {
  example: variant === 'float' ? figma.code`<NavRail variant="float"${collapsed ? ' collapsed onCollapsedChange={setCollapsed} onHide={hide}' : ' title="Studio" onSwitch={switchWorkspace}'} items={items} currentPath={path} onNavigate={navigate} onSearch={openSearch} />`
    : variant === 'top'
    ? figma.code`<NavRail variant="top" logomark={logomark} items={items} currentPath={path} onNavigate={navigate} actions={actions} />`
    : figma.code`<NavRail items={items} bottomItems={bottomItems} currentPath={path} onNavigate={navigate} />`,
  imports: ["import { NavRail } from \"@kolkrabbi/kol-component\""],
  id: 'NavRail',
}
