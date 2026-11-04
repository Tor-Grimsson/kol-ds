// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=496-15437
// source=packages/styleguide/src/StationeryMocks.jsx
// component=LetterheadCorrespondence
import figma from 'figma'

/* breakpoint is the viewport the mock was measured at (brand-hub /assets, 1440 / 390), not a prop: the mock fills its host's ratio box */
export default {
  example: figma.code`<LetterheadCorrespondence mark={<Logo variant="wordmark" />} info={info} />`,
  imports: ["import { LetterheadCorrespondence } from \"@kolkrabbi/kol-styleguide\""],
  id: 'LetterheadCorrespondence',
}
