import { useMemo, useState } from 'react'
import { KindPreview, FullscreenOverlay, Button, AudioSheet, PlaybackBar, KIND_LABEL } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Kind preview',
  description: 'Every one of the 14 file kinds the media surfaces classify — each in the column preview and in the overlay — plus the QuickTime bar and both audio sheets',
  category: 'editor',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-08-27',
  tags: ['domain/design-system', 'pattern/media'],
}
export const stage = 'full'

/* "where we can view properly" — asked three times (DocPageAndKindShowcase,
 * kol-r2b2 2026-08-27). One row per kind: the object, its column preview (the
 * `.kol-column-browser-preview` frame — documents zoom 0.5 there) and a button
 * that opens the same preview in the overlay (documents become the A-series
 * page; the arrows' 10rem gutters apply). The showcase carries no video, so the
 * video kinds show their tiles over a poster and the QuickTime bar runs on a
 * simulated clock; audio is a silent WAV built at runtime. */
const svg = (hue, w = 800, h = 600) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="hsl(${hue} 30% 45%)"/><circle cx="${w / 2}" cy="${h / 2}" r="${h / 4}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/></svg>`)
const text = (mime, body) => `data:${mime},${encodeURIComponent(body)}`
const MD = `---\ntitle: Field notes\ntype: reference\nstatus: active\ncreated: 2026-08-01\nupdated: 2026-08-27\ntags: [domain/components, pattern/media]\n---\n\n# Field notes\n\nThe **row** is the unit; the *column* is the path.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n`
function silentWav(seconds = 2, rate = 8000) {
  const n = seconds * rate
  const buf = new ArrayBuffer(44 + n)
  const v = new DataView(buf)
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true)
  str(36, 'data'); v.setUint32(40, n, true)
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128)
  let bin = ''
  new Uint8Array(buf).forEach((b) => { bin += String.fromCharCode(b) })
  return 'data:audio/wav;base64,' + btoa(bin)
}

const KINDS = (wav) => [
  { kind: 'image', o: { key: 'prints/aurora-2840.jpg', contentType: 'image/jpeg', url: svg(210) }, image: true },
  { kind: 'video', o: { key: 'reel/cut-04.mp4', contentType: 'video/mp4', url: '' }, poster: svg(20, 960, 540) },
  { kind: 'audio', o: { key: 'field/recording-01.wav', contentType: 'audio/wav', url: wav } },
  { kind: 'markdown', o: { key: 'docs/README.md', contentType: 'text/markdown', url: text('text/markdown', MD) } },
  { kind: 'JSON', o: { key: 'data/manifest.json', contentType: 'application/json', url: text('application/json', JSON.stringify({ name: 'kol', kinds: 14, nested: { a: [1, 2, 3] } }, null, 2)) } },
  { kind: 'YAML', o: { key: 'data/config.yaml', contentType: 'text/yaml', url: text('text/yaml', 'name: kol\nkinds: 14\nnested:\n  a:\n    - 1\n    - 2\n') } },
  { kind: 'text', o: { key: 'notes/field.txt', contentType: 'text/plain', url: text('text/plain', 'field notes\n— the row is the unit\n— the column is the path\n') } },
  { kind: 'code', o: { key: 'src/tilt.js', contentType: 'text/javascript', url: text('text/javascript', 'export const snap = (v, zones = 3) => Math.round(v * zones) / zones\n') } },
  { kind: 'HLS playlist', o: { key: 'hls/reel-04/master.m3u8', contentType: 'application/vnd.apple.mpegurl', url: text('application/vnd.apple.mpegurl', '#EXTM3U\n') }, poster: svg(140, 960, 540) },
  { kind: 'font', o: { key: 'fonts/jetbrains-mono/JetBrainsMono-Variable.woff2', contentType: 'font/woff2', url: '/fonts/jetbrains-mono/JetBrainsMono-Variable.woff2' } },
  { kind: 'archive', o: { key: 'exports/2026-08.zip', contentType: 'application/zip', url: '#' } },
  { kind: 'HLS segments', o: { key: 'hls/reel-04/segment_001.ts', contentType: 'video/mp2t', url: '#', segmentCount: 2012 } },
  { kind: 'system', o: { key: 'prints/.DS_Store', contentType: 'application/octet-stream', url: '#' } },
  { kind: 'file', o: { key: 'misc/blob.bin', contentType: 'application/octet-stream', url: '#' } },
]

function Preview({ row }) {
  if (row.image) return <img src={row.o.url} alt="" className="max-w-full max-h-full object-contain" />
  return <KindPreview o={row.o} poster={row.poster} />
}

function BarOnAClock() {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(12)
  const [rate, setRate] = useState(1)
  const duration = 25
  useMemo(() => null, [])
  if (playing && time >= duration) setPlaying(false)
  return (
    <div className="relative w-full max-w-[960px] aspect-video rounded overflow-hidden" onMouseMove={() => { if (playing && time < duration) setTime((t) => Math.min(duration, t + 0.05 * rate)) }}>
      <img src={svg(20, 960, 540)} alt="" className="w-full h-full object-cover" />
      <PlaybackBar playing={playing} time={time} duration={duration} rate={rate} onToggle={() => setPlaying((p) => !p)} onSeek={(t) => setTime(Math.max(0, Math.min(duration, t)))} onVolume={() => {}} onRate={setRate} />
    </div>
  )
}

export default function KindPreviewSet() {
  const wav = useMemo(() => silentWav(), [])
  const rows = useMemo(() => KINDS(wav), [wav])
  const [open, setOpen] = useState(null)
  return (
    <div className="flex w-full flex-col gap-10 p-8">
      <header className="flex flex-col gap-2">
        <div className="kol-eyebrow text-fg-80">Kind preview</div>
        <h1 className="kol-sans-heading-03 text-emphasis">Every kind, in the column and in the overlay</h1>
        <p className="kol-mono-14 text-body max-w-[65ch]">{Object.keys(KIND_LABEL).length} kinds the media surfaces classify. Each row is one — its column preview on the left, the same preview opened in the overlay on the right. Documents share one page plate; video runs on a poster (the showcase carries no video); audio is a silent WAV built on the fly.</p>
      </header>

      <ul className="flex flex-col gap-6">
        {rows.map((row) => (
          <li key={row.o.key} className="grid grid-cols-[160px_360px_1fr] items-start gap-6 border-t pt-6" style={{ borderColor: 'var(--kol-oq-08)' }}>
            <div className="flex flex-col gap-1">
              <span className="kol-helper-12 text-emphasis">{row.kind}</span>
              <span className="kol-mono-12 text-meta break-all">{row.o.key}</span>
            </div>
            {/* the column preview frame — ColumnBrowser's Preview column, verbatim geometry */}
            <div className="kol-column-browser-preview w-[360px] shrink-0 overflow-y-auto p-4 flex flex-col gap-4 border rounded" style={{ borderColor: 'var(--kol-oq-08)', maxHeight: 360 }}>
              <div className="w-full min-h-[160px] max-h-[60vh] overflow-auto rounded bg-fg-04 flex items-center justify-center">
                <Preview row={row} />
              </div>
            </div>
            <div><Button variant="outline" size="sm" onClick={() => setOpen(row)}>Open in overlay</Button></div>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-6 border-t pt-8" style={{ borderColor: 'var(--kol-oq-08)' }}>
        <h2 className="kol-sans-heading-04 text-emphasis">The QuickTime bar</h2>
        <p className="kol-mono-12 text-meta">PlaybackBar over a poster on a simulated clock (move the pointer while playing) — VideoSheet floats exactly this over the video, inset 16, radius 12.</p>
        <BarOnAClock />
      </section>

      <section className="flex flex-col gap-6 border-t pt-8" style={{ borderColor: 'var(--kol-oq-08)' }}>
        <h2 className="kol-sans-heading-04 text-emphasis">AudioSheet · sheet</h2>
        <AudioSheet src={wav} ext="wav" />
      </section>

      {open && (
        <FullscreenOverlay open onClose={() => setOpen(null)}>
          <div className="flex items-center justify-center max-w-[calc(100vw-10rem)]">
            <Preview row={open} />
          </div>
        </FullscreenOverlay>
      )}
    </div>
  )
}
