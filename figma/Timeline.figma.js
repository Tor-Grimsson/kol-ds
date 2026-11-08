// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=567-19890
// source=packages/design-editor/src/editor/params/Timeline.jsx
// component=TimelineRail
import figma from 'figma'
/* TimelineRail is the Rail with no engine under it (design-editor/core); the editor's Timeline renders through it */
const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''

export default {
  example: figma.code`<TimelineRail${sf} title={title} count={count} view={timelineView(loop, zoom, now)} rows={rows} />`,
  imports: ["import { TimelineRail, timelineView } from \"@kolkrabbi/design-editor/core\""],
  id: 'TimelineRail',
}
