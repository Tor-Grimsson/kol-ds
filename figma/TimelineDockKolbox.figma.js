// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-13572
// source=packages/component/src/organisms/TimelineDock.jsx
// component=TimelineDock
import figma from 'figma'

// TimelineDock variant="kolbox" (kolbox's MotionTimeline): the track rows become `tracks`. (F4, 2026-11-19)
const instance = figma.selectedInstance
const names = instance.findLayers((n) => n.name === 'TimelineDock kolbox track' && n.type === 'INSTANCE').map((t) => t.getString('label'))
const tracks = names.map((n, i) => `{ id: 't${i}', name: '${n}', keyframes: [] }`).join(', ')
const example = figma.code`<TimelineDock variant="kolbox" tracks={[${tracks}]} />`

export default {
  example,
  imports: ["import { TimelineDock } from \"@kolkrabbi/kol-component\""],
  id: 'TimelineDockKolbox',
  metadata: { nestable: true },
}
