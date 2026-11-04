import { CaptureCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a captured screen drawn in place of a screenshot.
export const Capture = () => (
  <div className="w-full h-full bg-[#0b0b0d] p-3 grid grid-cols-6 gap-1.5">
    {Array.from({ length: 18 }, (_, i) => <span key={i} className="block rounded-[2px]" style={{ background: i % 7 === 3 ? 'var(--kol-palette-purple)' : 'rgba(255,255,255,0.08)', height: 14 }} />)}
  </div>
)

export default function CaptureCardPreview() {
  return (
    <div className="w-[296px]">
      <CaptureCard image={<Capture />} title="#kol-ob bingo" meta="124d" onNext={() => {}} onOpen={() => {}} />
    </div>
  )
}
