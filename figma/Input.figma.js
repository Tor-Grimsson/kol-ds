// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-20
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "filled": "filled", "outline": "outline", "float": "float" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
// state (float-everything W3 row 36, 2026-11-04): focus is the field's own (click in); error is the `error` message; disabled is `disabled`
const state = instance.getEnum('state', { "default": "default", "focus": "focus", "error": "error", "disabled": "disabled" })
const xs = state === 'error' ? ' error="Enter a valid email address."' : state === 'disabled' ? ' disabled' : state === 'focus' ? ' autoFocus' : ''

export default {
  example: figma.code`<Input variant="${variant}" size="${size}" value={value} onChange={setValue} placeholder="Placeholder"${xs} />`,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'Input',
}
