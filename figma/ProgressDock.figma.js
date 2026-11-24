// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20224
// source=packages/shell/src/ReaderBar.jsx
// component=ProgressDock
import figma from 'figma'

export default {
  example: figma.code`<ProgressDock page={page} pages={pages} onPrev={prev} onNext={next} onSeek={seek} />`,
  imports: ["import { ProgressDock } from \"@kolkrabbi/kol-shell\""],
  id: 'ProgressDock',
}
