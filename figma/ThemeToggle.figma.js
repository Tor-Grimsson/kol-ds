// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1349-3579
// source=packages/framework/src/ThemeToggle.jsx
// component=ThemeToggle
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "button": "button", "flush": "flush", "row": "row" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })

export default {
  example: variant === 'button'
    ? figma.code`<ThemeToggle fill="none" label={false} size="${size}" />`
    : figma.code`<ThemeToggle variant="${variant}" />`,
  imports: ["import { ThemeToggle } from \"@kolkrabbi/kol-framework\""],
  id: 'ThemeToggle',
}
