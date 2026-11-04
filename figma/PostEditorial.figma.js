// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=493-15428
// source=packages/styleguide/src/SocialMocks.jsx
// component=PostEditorial
import figma from 'figma'

/* breakpoint is the viewport the mock was measured at (brand-hub /assets, 1440 / 390), not a prop: the mock fills its host's ratio box */
export default {
  example: figma.code`<PostEditorial mark={<Logo variant="logomark" />} />`,
  imports: ["import { PostEditorial } from \"@kolkrabbi/kol-styleguide\""],
  id: 'PostEditorial',
}
