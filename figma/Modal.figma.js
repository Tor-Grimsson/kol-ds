// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=10-38
// source=packages/component/src/molecules/Modal.jsx
// component=Modal
import figma from 'figma'

const instance = figma.selectedInstance
const dialog = instance.getEnum('dialog', { "confirm": "confirm", "prompt": "prompt" })
const variant = instance.getEnum('variant', { "bordered": "bordered", "lift": "lift", "float": "float" })
const xv = variant === 'lift' ? ", variant: 'lift'" : ''

const example = variant === 'float'
  ? figma.code`const { confirm } = useModal()
const ok = await confirm('Delete “Orbit field”?', { variant: 'float', header: 'Delete layer', icon: 'alert-triangle', body: 'This removes the layer and its 4 keyframes.', tone: 'danger', okLabel: 'Delete layer', cancelLabel: 'Keep layer' })`
  : dialog === 'prompt'
  ? figma.code`const { prompt } = useModal()
const name = await prompt('Name this frame:', 'Untitled'${xv ? `, { variant: 'lift' }` : ''})`
  : figma.code`const { confirm } = useModal()
const ok = await confirm('Discard unsaved changes?', { okLabel: 'Discard', cancelLabel: 'Cancel'${xv} })`

export default {
  example: example,
  imports: ["import { useModal } from \"@kolkrabbi/kol-component\""],
  id: 'Modal',
}
