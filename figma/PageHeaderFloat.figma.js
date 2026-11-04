// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20701
// source=packages/component/src/molecules/SectionText.jsx
// component=PageHeader/float
import figma from 'figma'

// PageHeader is deprecated (2026-10-22) → SectionText; the float page header is SectionText variant="float" with actions
export default {
  example: figma.code`<SectionText variant="float" eyebrow="DASHBOARD  /  TASKS" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace." actions={<Button variant="float" tone="inverted" size="md" iconLeft="plus">New task</Button>} />`,
  imports: ["import { Button, SectionText } from \"@kolkrabbi/kol-component\""],
  id: 'PageHeaderFloat',
}
