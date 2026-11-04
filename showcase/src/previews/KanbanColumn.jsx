import { CaptureCard, KanbanColumn } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — the Lobby lane with one capture in it.
const Capture = () => (
  <div className="w-full h-full bg-[#0b0b0d] p-3 grid grid-cols-6 gap-1.5">
    {Array.from({ length: 18 }, (_, i) => <span key={i} className="block rounded-[2px]" style={{ background: i % 7 === 3 ? 'var(--kol-palette-purple)' : 'rgba(255,255,255,0.08)', height: 14 }} />)}
  </div>
)

export default function KanbanColumnPreview() {
  return (
    <div className="flex gap-4 items-start">
      <KanbanColumn className="w-[320px]" title="Lobby" count={1}>
        <CaptureCard image={<Capture />} title="#kol-ob bingo" meta="124d" onNext={() => {}} />
      </KanbanColumn>
      <KanbanColumn className="w-[320px]" title="In review" count={0} />
    </div>
  )
}
