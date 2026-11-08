// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1043-26465
// source=packages/component/src/molecules/Modal.jsx
// component=Dialog
import figma from 'figma'

const instance = figma.selectedInstance
// body is a slot — the dialog's children

const variant = instance.getEnum('variant', { "lift": "lift", "bordered": "bordered", "float": "float", "settings": "settings" })
export default {
  example: variant === 'settings'
    ? figma.code`<Dialog variant="settings" open={open} onClose={close} title={title} kind="Generate" headerEnd={presets} sections={sections} section={section} onSection={setSection} aside={aside} footer={footer}>{groups}</Dialog>`
    : variant === 'lift'
    ? figma.code`<Dialog open={open} onClose={close} title={title} width={420}>{children}</Dialog>`
    : variant === 'bordered'
    ? figma.code`<Dialog variant="bordered" open={open} onClose={close} title={title} width={420}>{children}</Dialog>`
    : figma.code`<Dialog variant="float" open={open} onClose={close} onMinimise={minimise} icon="share" title={title} width={418}>{fields}</Dialog>`,
  imports: ["import { Dialog } from \"@kolkrabbi/kol-component\""],
  id: 'Dialog',
}
