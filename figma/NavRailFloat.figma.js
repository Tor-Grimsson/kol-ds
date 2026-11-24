// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2085-16101
// source=packages/component/src/organisms/NavRailFloat.jsx
// component=NavRailFloat
import figma from 'figma'
// The float nav Rail: one RailFloat filling its height, the search Input and the page groups (LabeledControlSection of
// TreeRow) in its body slot; collapse-h=true is the 72 icon column (plan-2026-11-12-one-header W9.2). Rendered by NavRail.
const instance = figma.selectedInstance
const collapsed = instance.getEnum('collapse-h', { "false": false, "true": true })

export default {
  example: collapsed
    ? figma.code`<NavRail variant="float" collapsed onCollapsedChange={setCollapsed} items={items} currentPath={path} onNavigate={navigate} onSearch={openSearch} onHide={hide} />`
    : figma.code`<NavRail variant="float" title={title} icon="grid" items={items} currentPath={path} onNavigate={navigate} onSearch={openSearch} onCollapsedChange={setCollapsed} footer={footer} />`,
  imports: ["import { NavRail } from \"@kolkrabbi/kol-component\""],
  id: 'NavRailFloat',
}
