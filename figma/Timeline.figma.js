// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=560-19188
// source=packages/design-editor/src/editor/params/Timeline.jsx
// component=TimelineRail
import figma from 'figma'
/* TimelineRail is the Rail with no engine under it (design-editor/core); the editor's Timeline renders through it */

export default {
  example: figma.code`<TimelineRail title={title} count={count} view={timelineView(loop, zoom, now)} rows={rows} />`,
  imports: ["import { TimelineRail, timelineView } from \"@kolkrabbi/design-editor/core\""],
  id: 'TimelineRail',
}
