// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=567-19890
// source=packages/design-editor/src/editor/params/Timeline.jsx
// component=Timeline
import figma from 'figma'

/* The editor mounts it under the canvas (the motion pack's `canvas.footer`); `TimelineDock` is its mounted name. */
const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''

export default {
  example: figma.code`<motion.TimelineDock${sf} />`,
  imports: ["import { motion } from \"@kolkrabbi/design-editor/motion\""],
  id: 'Timeline',
}
