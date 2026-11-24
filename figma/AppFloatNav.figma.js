// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1236
// source=packages/shell/src/AppFloatNav.jsx
// component=AppFloatNav
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "mobile": "mobile", "dock": "dock", "panel": "panel", "transport": "transport" })
const labels = instance.getEnum('labels', { "true": "true", "false": "false" })
const shape = instance.getEnum('bar', { "true": "bar", "false": "pill" })
const inline = instance.getEnum('inline', { "true": "true", "false": "false" })
// collapse-h (W11): the inline capsule collapses to play/pause + timecode (+ Loop while on)
const collapsedH = instance.getEnum('collapse-h', { "true": true, "false": false })
const lb = labels === 'true' ? ' labels' : ''

export default {
  example: variant === 'transport'
    ? inline === 'true'
      ? figma.code`<AppFloatNav variant="transport" inline collapsibleH${collapsedH ? ' defaultCollapsedH' : ' defaultCollapsedH={false}'} onCollapseH={setCollapsedH} items={transportItems} timecode={{ current, total }} />`
      : figma.code`<AppFloatNav variant="transport" items={transportItems} />`
    : figma.code`<AppFloatNav variant="${variant}" shape="${shape}"${lb} items={items} sheetItems={moreItems} currentPath={path} onNavigate={navigate} />`,
  imports: ["import { AppFloatNav } from \"@kolkrabbi/kol-shell\""],
  id: 'AppFloatNav',
}
