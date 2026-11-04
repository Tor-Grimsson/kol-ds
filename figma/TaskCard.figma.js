// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=561-19045
// source=packages/dashboards/src/cards/TaskCard.jsx
// component=TaskCard
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "lg": "lg", "sm": "sm" })
const selected = instance.getEnum('selected', { "true": "true", "false": "false" })

export default {
  example: figma.code`<TaskCard size="${size}" title="Design the Tasks tab" group="Brief" date="2026-07-01" done={done} onToggle={setDone}${selected === 'true' ? ' selected' : ''} />`,
  imports: ["import { TaskCard } from \"@kolkrabbi/kol-dashboards\""],
  id: 'TaskCard',
}
