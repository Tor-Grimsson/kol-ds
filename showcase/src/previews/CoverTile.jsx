import { CoverTile } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* a typeset jacket, as a reader app would draw one — the tile only sizes it */
export const Jacket = ({ title = 'The Waves', author = 'Virginia Woolf', edition = 'The folio editions' }) => (
  <div className="relative w-full h-full" style={{ background: '#a9c3d9', color: '#354e66', fontFamily: 'var(--kol-font-family-float)' }}>
    <span className="absolute left-[7.5%] top-[5%] text-[3.5cqw] font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.56em' }}>{edition}</span>
    <span className="absolute left-[7.5%] top-[13.5%] right-[7.5%] font-bold leading-[1.02] tracking-[-0.03em] whitespace-pre-line" style={{ fontSize: '2.1em' }}>{title.replace(' ', '\n')}</span>
    {[0.39, 0.59, 0.8].map((t) => <span key={t} className="absolute left-0 right-0" style={{ top: `${t * 100}%`, height: '10.3%', background: '#eeeadc' }} />)}
    <span className="absolute rounded-full" style={{ left: '24%', top: '46%', width: '53%', height: '42%', background: 'radial-gradient(circle, #5f8ab0 0, rgba(95,138,176,0) 70%)' }} />
    <span className="absolute left-[7.5%] bottom-[5%] font-semibold uppercase tracking-[0.05em]" style={{ fontSize: '0.56em' }}>{author}</span>
  </div>
)

export default function CoverTilePreview() {
  return (
    <div className="flex gap-6 items-start text-[12px]">
      <CoverTile cover={<Jacket />} title="The Waves" author="Virginia Woolf" onClick={() => {}} />
      <CoverTile cover={<Jacket title="Orlando" edition="The folio editions" />} title="Orlando" author="Virginia Woolf" onClick={() => {}} />
    </div>
  )
}
