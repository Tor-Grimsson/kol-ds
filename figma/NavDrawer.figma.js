// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=584-20372
// source=packages/component/src/organisms/NavDrawer.jsx
// component=NavDrawer
import figma from 'figma'

export default {
  example: figma.code`<NavDrawer open={open} onClose={close} title="Studio" items={items} currentPath={path} onNavigate={navigate} footer={allPages} />`,
  imports: ["import { NavDrawer } from \"@kolkrabbi/kol-component\""],
  id: 'NavDrawer',
}
