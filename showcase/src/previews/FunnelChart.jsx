import { FunnelChart } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — three steps from the home page to a project.
export default function FunnelChartPreview() {
  return (
    <div className="w-full max-w-[900px]">
      <FunnelChart title="Home to a project" steps={[
        { label: 'Visit /', visitors: 4200 },
        { label: 'Visit /work', visitors: 1650 },
        { label: 'Visit /work/*', visitors: 720 },
      ]} />
    </div>
  )
}
