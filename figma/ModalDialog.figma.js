// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1043-26465
// source=packages/component/src/molecules/Modal.jsx
// component=ModalDialog
import figma from 'figma'

const instance = figma.selectedInstance
// header ← Header (variant=modal on float, variant=settings on settings); body is a slot — the dialog's children

const variant = instance.getEnum('variant', { "lift": "lift", "bordered": "bordered", "float": "float", "settings": "settings", "kolbox": "kolbox" })
export default {
  example: variant === 'kolbox'
    ? figma.code`<ModalDialog variant="kolbox" open onClose={onClose} title={title} footer={footer}>{children}</ModalDialog>`
    : variant === 'settings'
    ? figma.code`<ModalDialog variant="settings" open={open} onClose={close} title={title} kind="Generate" headerEnd={presets} sections={sections} section={section} onSection={setSection} aside={aside} footer={footer}>{groups}</ModalDialog>`
    : variant === 'lift'
    ? figma.code`<ModalDialog open={open} onClose={close} title={title} width={420}>{children}</ModalDialog>`
    : variant === 'bordered'
    ? figma.code`<ModalDialog variant="bordered" open={open} onClose={close} title={title} width={420}>{children}</ModalDialog>`
    : figma.code`<ModalDialog variant="float" open={open} onClose={close} onMinimise={minimise} icon="share" title={title}>{fields}</ModalDialog>`,
  imports: ["import { ModalDialog } from \"@kolkrabbi/kol-component\""],
  id: 'ModalDialog',
}
