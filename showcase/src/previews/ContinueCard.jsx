import { ContinueCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* the jacket at 88 wide — the same typeset cover CoverTile shows, scaled by its em */
const Jacket = () => (
  <div className="relative w-full h-full text-[5.5px]" style={{ background: '#a9c3d9', color: '#354e66', fontFamily: 'var(--kol-font-family-float)' }}>
    <span className="absolute left-[7.5%] top-[5%] font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.56em' }}>The folio editions</span>
    <span className="absolute left-[7.5%] top-[13.5%] right-[7.5%] font-bold leading-[1.02] tracking-[-0.03em] whitespace-pre-line" style={{ fontSize: '2.1em' }}>{'The\nWaves'}</span>
    {[0.39, 0.59, 0.8].map((t) => <span key={t} className="absolute left-0 right-0" style={{ top: `${t * 100}%`, height: '10.3%', background: '#eeeadc' }} />)}
    <span className="absolute rounded-full" style={{ left: '24%', top: '46%', width: '53%', height: '42%', background: 'radial-gradient(circle, #5f8ab0 0, rgba(95,138,176,0) 70%)' }} />
    <span className="absolute left-[7.5%] bottom-[5%] font-semibold uppercase tracking-[0.05em]" style={{ fontSize: '0.56em' }}>Virginia Woolf</span>
  </div>
)

export default function ContinueCardPreview() {
  return (
    <div className="w-full max-w-[624px]">
      <ContinueCard cover={<Jacket />} eyebrow="The third interlude" title="The Waves" author="Virginia Woolf" page="Page 125 of 297" pct={42} onResume={() => {}} lastRead="Last read 2 hours ago" />
    </div>
  )
}
