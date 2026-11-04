// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=26-51
// source=packages/styleguide/src/AssetCard.jsx
// component=AssetCard
import figma from 'figma'

const instance = figma.selectedInstance
const caption = instance.getString('caption')

export default {
  example: figma.code`<AssetCard caption="${caption}">{children}</AssetCard>`,
  imports: ["import { AssetCard } from \"@kolkrabbi/kol-styleguide\""],
  id: 'AssetCard',
}
