import { Sparkline } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixtures — three trend series.
const up = [38, 42, 51, 47, 58, 61, 55, 66, 72, 64, 78, 81, 76, 90]
const down = [90, 84, 88, 79, 72, 74, 66, 60, 63, 55, 49, 52, 44, 40]
const flat = [50, 54, 48, 52, 49, 55, 51, 47, 53, 50, 56, 49, 52, 51]

const Row = ({ label, children }) => (
  <div className="flex items-center gap-4">
    <span className="dash-caption text-fg-64 w-20 shrink-0">{label}</span>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
)

export default function SparklineDemo() {
  return (
    <>
      <Row label="Visitors">
        <Sparkline data={up} height={32} fill color="var(--kol-palette-green)" />
      </Row>
      <Row label="Bounces">
        <Sparkline data={down} height={32} fill color="var(--kol-palette-red)" />
      </Row>
      <Row label="Sessions">
        <Sparkline data={flat} height={32} color="var(--kol-palette-blue)" />
      </Row>
    </>
  )
}
