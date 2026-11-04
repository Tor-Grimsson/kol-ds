// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=561-19142
// source=packages/dashboards/src/cards/ProjectCard.jsx
// component=ProjectCard
import figma from 'figma'


export default {
  example: figma.code`<ProjectCard eyebrow="Repo" status="Active" title="kol-studio" description="Local-only studio dashboard." progress={{ label: 'Completion', pct: 50, note: '1 / 2 done' }} action="Details" onAction={open} />`,
  imports: ["import { ProjectCard } from \"@kolkrabbi/kol-dashboards\""],
  id: 'ProjectCard',
}
