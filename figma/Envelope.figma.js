// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=494-15427
// source=packages/styleguide/src/StationeryMocks.jsx
// component=Envelope
import figma from 'figma'

/* breakpoint is the viewport the mock was measured at (brand-hub /assets, 1440 / 390), not a prop: the mock fills its host's ratio box */
export default {
  example: figma.code`<Envelope mark={<Logo variant="logomark" />} info={info} />`,
  imports: ["import { Envelope } from \"@kolkrabbi/kol-styleguide\""],
  id: 'Envelope',
}
