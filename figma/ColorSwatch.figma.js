// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-59
// source=packages/component/src/molecules/ColorSwatch.jsx
// component=ColorSwatch
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "halo": "halo" })
const size = instance.getEnum('size', { "24": "24", "32": "32" })

export default {
  example: figma.code`<ColorSwatch hex={hex} variant="${variant}" size={${size}} selected={selected} onClick={pick} />`,
  imports: ["import { ColorSwatch } from \"@kolkrabbi/kol-component\""],
  id: 'ColorSwatch',
}
