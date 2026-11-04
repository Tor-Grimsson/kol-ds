// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20296
// source=packages/component/src/molecules/IndexRow.jsx
// component=IndexRow
import figma from 'figma'
const instance = figma.selectedInstance
const selected = instance.getEnum('selected', { "false": "false", "true": "true" })

export default {
  example: figma.code`<IndexRow title="Design the Tasks tab" cells={['Briefs', { value: '—', mono: true }, 'Open']}${selected === 'true' ? ' selected' : ''} checked={done} onCheck={setDone} onClick={open} />`,
  imports: ["import { IndexRow } from \"@kolkrabbi/kol-component\""],
  id: 'IndexRow',
}
