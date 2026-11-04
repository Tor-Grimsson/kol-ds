// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20198
// source=packages/styleguide/src/ThemeTile.jsx
// component=ThemeTile
import figma from 'figma'
const instance = figma.selectedInstance
const selected = instance.getEnum('selected', { "true": "true", "false": "false" })
const label = instance.getString('label')
const xs = selected === 'true' ? ' selected' : ''
export default {
  example: figma.code`<ThemeTile label="${label}" bg="#101012" ink="#fafafa"${xs} onClick={() => setTheme('${label.toLowerCase()}')} />`,
  imports: ["import { ThemeTile } from \"@kolkrabbi/kol-styleguide\""],
  id: 'ThemeTile',
}
