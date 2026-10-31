// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=72-1561
// source=packages/framework/src/LinkPreview.jsx
// component=LinkPreview
import figma from 'figma'

export default {
  example: figma.code`<LinkPreview root={sheetRef} cardFor={(href) => card(href)} />`,
  imports: ["import { LinkPreview } from \"@kolkrabbi/kol-framework\""],
  id: 'LinkPreview',
}
