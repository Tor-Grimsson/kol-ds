// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=91-224
// source=packages/component/src/molecules/QuickLookFrame.jsx
// component=QuickLookFrame
import figma from 'figma'

export default {
  example: figma.code`<QuickLookFrame title={name} meta={meta} actions={actions} onClose={close} nav={{ index, total, onPrev, onNext }}>
  {body}
</QuickLookFrame>`,
  imports: ["import { QuickLookFrame } from \"@kolkrabbi/kol-component\""],
  id: 'QuickLookFrame',
}
