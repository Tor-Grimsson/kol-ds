// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=493-15443
// source=packages/styleguide/src/SocialMocks.jsx
// component=StoryPhoto
import figma from 'figma'

/* breakpoint is the viewport the mock was measured at (brand-hub /assets, 1440 / 390), not a prop: the mock fills its host's ratio box */
export default {
  example: figma.code`<StoryPhoto mark={<Logo variant="logomark" />} />`,
  imports: ["import { StoryPhoto } from \"@kolkrabbi/kol-styleguide\""],
  id: 'StoryPhoto',
}
