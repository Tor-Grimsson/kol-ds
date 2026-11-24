// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-14260
// source=packages/component/src/utilities/EditorShell.jsx
// component=EditorShell
import figma from 'figma'

// EditorShell variant="kolbox" (kolbox's Shell): each rail a slot, shown by its toggle. (F4, 2026-11-19)
const instance = figma.selectedInstance
const on = (b) => instance.getBoolean(b)
const left = on('left rail') ? instance.getSlot('left rail slot') : undefined
const right = on('right rail') ? instance.getSlot('right rail slot') : undefined
const timeline = on('timeline') ? instance.getSlot('timeline slot') : undefined
const canvas = instance.getSlot('canvas slot')
const top = on('top rail')
const toolbar = on('transport toolbar')
const example = figma.code`<EditorShell variant="kolbox"${top ? ' topbar={topRail}' : ''}${left ? figma.code` left={${left}}` : ''}${right ? figma.code` right={${right}}` : ''}${timeline ? figma.code` canvasFooter={${timeline}}` : ''}${toolbar ? ' toolbar={<AppFloatNav variant="kolbox" transport />}' : ''}>${canvas}</EditorShell>`

export default {
  example,
  imports: ["import { EditorShell } from \"@kolkrabbi/kol-component\"", "import { AppFloatNav } from \"@kolkrabbi/kol-shell\""],
  id: 'EditorShellKolbox',
  metadata: { nestable: true },
}
