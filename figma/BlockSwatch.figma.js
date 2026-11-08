// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=175-241
// source=packages/styleguide/src/BlockSwatch.jsx
// component=BlockSwatch
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "chip": "chip", "cell": "cell" })
const lead = instance.getEnum('lead', { "true": " lead", "false": "" })
const anchor = instance.getEnum('anchor', { "true": " anchor", "false": "" })
export default {
  example: figma.code`<BlockSwatch hex={hex} name={name} variant="${variant}"${lead}${anchor} />`,
  imports: ["import { BlockSwatch } from \"@kolkrabbi/kol-styleguide\""],
  id: 'BlockSwatch',
}
