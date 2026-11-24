// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=277-527
// source=packages/component/src/organisms/NavRail.jsx
// component=NavRail
import figma from 'figma'

const instance = figma.selectedInstance
// variant="float" is a RailFloat instance: header ← Header variant=nav (glyph · title · ⌄ 12, collapse-v), body ← its own content (NavRailFloat.figma.js — collapse-h, the 72 column;
// NavRailFloatBody retired 2026-11-13), footer ← RailDisplayControls (plan-2026-11-12-float-rails-figma 4.2) — RailFloat.figma.js
const variant = instance.getEnum('variant', { side: 'side', top: 'top', site: 'site' })
const collapsed = instance.getEnum('collapsed', { "false": false, "true": true })

export default {
  example: variant === 'top'
    ? figma.code`<NavRail variant="top" logomark={logomark} items={items} currentPath={path} onNavigate={navigate} actions={actions} />`
    : figma.code`<NavRail logomark={{ svgUrl, title: "${instance.getString('title')}" }} items={items} bottomItems={bottomItems} currentPath={path} onNavigate={navigate} />`,
  imports: ["import { NavRail } from \"@kolkrabbi/kol-component\""],
  id: 'NavRail',
}
