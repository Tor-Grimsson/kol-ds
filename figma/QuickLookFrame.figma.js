// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=584-20281
// source=packages/component/src/molecules/QuickLookFrame.jsx
// component=QuickLookFrame
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })

export default {
  example: variant === 'float'
    ? figma.code`<QuickLookFrame variant="float" icon="align-vertical-center" title="Scene settings" onMinimise={minimise} onClose={close} status="Changes saved automatically">{fields}</QuickLookFrame>`
    : figma.code`<QuickLookFrame title={name} meta={meta} actions={actions} onClose={close} nav={{ index, total, onPrev, onNext }}>{body}</QuickLookFrame>`,
  imports: ["import { QuickLookFrame } from \"@kolkrabbi/kol-component\""],
  id: 'QuickLookFrame',
}
