// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20315
// source=packages/component/src/molecules/TaskRow.jsx
// component=TaskRow
import figma from 'figma'
const instance = figma.selectedInstance
const done = instance.getEnum('done', { "false": "false", "true": "true" })

export default {
  example: figma.code`<TaskRow title="Design the Tasks tab" date="2026-07-01"${done === 'true' ? ' done' : ''} onDone={setDone} onDate={pickDate} />`,
  imports: ["import { TaskRow } from \"@kolkrabbi/kol-component\""],
  id: 'TaskRow',
}
