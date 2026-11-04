// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=666-21294
// source=packages/shell/src/FloatLayout.jsx
// component=FloatLayout
import figma from 'figma'

/* the regions: nav (the Rail 280 · 72, or RailTrigger when hidden), bar (TopControlsBar's props), content (children),
 * inspector (PropertyRail, hidden with showInspector off), eyebrow (a line 25 under the bar, no height), bottom (a Rail under
 * content + inspector, 24 below) */
const instance = figma.selectedInstance
const rail = instance.getEnum('rail', { expanded: 'expanded', collapsed: 'collapsed', hidden: 'hidden' })
const eyebrow = instance.getBoolean('showEyebrow') ? ' eyebrow={eyebrow}' : ''
const bottom = instance.getBoolean('showBottom') ? ' bottom={dock}' : ''
const inspector = instance.getBoolean('showInspector') ? ' inspector={({ hide }) => <PropertyRail onCollapse={hide} sections={sections} />}' : ''

export default {
  example: figma.code`<FloatLayout nav={nav} currentPath={path} onNavigate={navigate} title={title} defaultRail="${rail}" bar={{ document: { name } }}${eyebrow}${inspector}${bottom}>{page}</FloatLayout>`,
  imports: ["import { FloatLayout } from \"@kolkrabbi/kol-shell\""],
  id: 'FloatLayout',
}
