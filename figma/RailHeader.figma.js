// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1486-13691
// source=packages/component/src/organisms/RailKit.jsx
// component=RailHeader
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.getString('title')
const sub = instance.getBoolean('showSubtitle') ? ` subtitle="${instance.getString('subtitle')}"` : ''

export default {
  example: figma.code`<RailHeader title="${title}"${sub} />`,
  imports: ["import { RailHeader } from \"@kolkrabbi/kol-component\""],
  id: 'RailHeader',
}
