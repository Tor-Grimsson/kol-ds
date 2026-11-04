// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=584-20282
// source=packages/component/src/molecules/Modal.jsx
// component=Dialog
import figma from 'figma'

const instance = figma.selectedInstance
// body is a slot — the dialog's children

export default {
  example: figma.code`<Dialog variant="float" open={open} onClose={close} onMinimise={minimise} icon="share" title="${instance.getString('title')}" width={418}>{fields}</Dialog>`,
  imports: ["import { Dialog } from \"@kolkrabbi/kol-component\""],
  id: 'Dialog',
}
