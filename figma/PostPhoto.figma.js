// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=493-15403
// source=packages/styleguide/src/SocialMocks.jsx
// component=PostPhoto
import figma from 'figma'

/* breakpoint is the viewport the mock was measured at (brand-hub /assets, 1440 / 390), not a prop: the mock fills its host's ratio box */
export default {
  example: figma.code`<PostPhoto mark={<Logo variant="logomark" />} />`,
  imports: ["import { PostPhoto } from \"@kolkrabbi/kol-styleguide\""],
  id: 'PostPhoto',
}
