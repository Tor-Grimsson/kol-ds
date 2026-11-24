// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-59
// source=packages/component/src/molecules/ColorSwatch.jsx
// component=ColorSwatch
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('halo', { "false": "default", "true": "halo" })
const size = instance.getEnum('lg', { "false": "24", "true": "32" })
// one chip per state (2026-11-07): transparent nests TransparentX
const state = instance.getEnum('state', { "rest": "", "selected": " selected", "transparent": " transparent" })

export default {
  example: figma.code`<ColorSwatch hex={hex} variant="${variant}" size={${size}} ${state} onClick={pick} />`,
  imports: ["import { ColorSwatch } from \"@kolkrabbi/kol-component\""],
  id: 'ColorSwatch',
}
