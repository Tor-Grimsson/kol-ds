// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=10-38
// source=packages/component/src/molecules/Modal.jsx
// component=Modal
import figma from 'figma'

// kind = the useModal() call (prompt · confirm · alert · form); variant = the ModalShell look; options = confirm's toggle rows
const instance = figma.selectedInstance
const kind = instance.getEnum('kind', { "prompt": "prompt", "confirm": "confirm", "alert": "alert", "form": "form" })
const variant = instance.getEnum('variant', { "bordered": "bordered", "lift": "lift", "float": "float" })
const options = instance.getEnum('options', { "false": false, "true": true })
const look = variant === 'bordered' ? '' : variant === 'lift' ? "variant: 'lift'" : "variant: 'float', header: 'Upload', icon: 'upload'"
const o = (rest) => [look, rest].filter(Boolean).join(', ')

const example = kind === 'prompt'
  ? figma.code`const { prompt } = useModal()
const name = await prompt('Name this frame:', 'Untitled', { ${o("okLabel: 'Save'")} })`
  : kind === 'alert'
  ? figma.code`const { alert } = useModal()
await alert('Upload failed: quota exceeded', { ${o("okLabel: 'OK'")} })`
  : kind === 'form'
  ? figma.code`const { form } = useModal()
const values = await form('Sign in', [{ id: 'email', placeholder: 'Email' }, { id: 'password', placeholder: 'Password', type: 'password' }], { ${o("okLabel: 'Sign in'")} })`
  : options
  ? figma.code`const { confirm } = useModal()
const { ok, values } = await confirm('Web-optimise raster images?', { ${o("okLabel: 'Upload', options: [{ id: 'optimise', label: 'Optimise', hint: '≤2560 px, ≤500 KB', defaultValue: true }, { id: 'keepOriginals', label: 'Keep originals', hint: 'original/<name>', defaultValue: true }]")} })`
  : figma.code`const { confirm } = useModal()
const ok = await confirm('Discard unsaved changes?', { ${o("okLabel: 'Discard', cancelLabel: 'Cancel'")} })`

export default {
  example: example,
  imports: ["import { useModal } from \"@kolkrabbi/kol-component\""],
  id: 'Modal',
}
