import { DashboardGrid, GridCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'full'

/* Centered span label — placeholder content so the geometry reads. */
const Cell = ({ children }) => (
  <div className="h-full flex items-center justify-center kol-mono-12 text-fg-48">
    {children}
  </div>
)

/* The span sampler: GridCard maps 'CxR' onto grid-column / grid-row spans
 * inside a DashboardGrid (dense flow, 4 columns from 540px, 2 below —
 * where 3- and 4-wide spans clamp to 2). `asCard` opts plain content into
 * the dash-card chrome; real dashboard cards bring their own. */
export default function GridCardDemo() {
  return (
    <DashboardGrid>
      <GridCard asCard>
        <Cell>1x1</Cell>
      </GridCard>
      <GridCard span="2x1" asCard>
        <Cell>2x1</Cell>
      </GridCard>
      <GridCard span="1x2" asCard>
        <Cell>1x2 — tall</Cell>
      </GridCard>
      <GridCard span="2x2" asCard>
        <Cell>2x2</Cell>
      </GridCard>
      <GridCard asCard>
        <Cell>1x1</Cell>
      </GridCard>
      <GridCard span="3x1" asCard>
        <Cell>3x1</Cell>
      </GridCard>
      <GridCard span="4x1" asCard>
        <Cell>4x1 — full-width strip</Cell>
      </GridCard>
    </DashboardGrid>
  )
}
