import { ProjectCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

export default function ProjectCardPreview() {
  return (
    <div className="w-full max-w-[656px]">
      <ProjectCard eyebrow="Repo" status="Active" title="kol-studio" description="Local-only studio dashboard. Home of this board."
        progress={{ label: 'Completion', pct: 50, note: '1 / 2 done' }} action="Details" onAction={() => {}} />
    </div>
  )
}
