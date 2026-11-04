// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=460-13908
// source=packages/styleguide/src/Brand.jsx
// component=Brand
import figma from 'figma'

/* view = brand (BrandBook) | assets (BrandAssets); variant (desktop | phone) is the window, not a prop */
const instance = figma.selectedInstance
const view = instance.getEnum('view', { brand: 'brand', assets: 'assets' })

export default {
  example: figma.code`<Brand brand={brand} logoSources={logoSources} view="${view}" onViewChange={onViewChange} />`,
  imports: ["import { Brand } from \"@kolkrabbi/kol-styleguide\""],
  id: 'Brand',
}
