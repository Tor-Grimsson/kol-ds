// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20257
// source=packages/shell/src/ReaderBar.jsx
// component=ProgressDock
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<ProgressDock page={page} pages={pages} onPrev={prev} onNext={next} onSeek={seek}${sf} />`,
  imports: ["import { ProgressDock } from \"@kolkrabbi/kol-shell\""],
  id: 'ProgressDock',
}
