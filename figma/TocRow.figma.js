// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20277
// source=packages/component/src/molecules/TocRow.jsx
// component=TocRow
import figma from 'figma'
const instance = figma.selectedInstance
const current = instance.getEnum('current', { "false": "false", "true": "true" })

export default {
  example: figma.code`<TocRow number={1} label="First interlude"${current === 'true' ? ' current' : ''} href="#first-interlude" />`,
  imports: ["import { TocRow } from \"@kolkrabbi/kol-component\""],
  id: 'TocRow',
}
