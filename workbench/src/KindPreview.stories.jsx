import { KindPreview } from '@kolkrabbi/kol-component'

const JSON_URL = 'data:application/json,' + encodeURIComponent(JSON.stringify({ name: 'kol', kinds: ['image', 'video', 'audio', 'text'] }, null, 2))
const MD_URL = 'data:text/markdown,' + encodeURIComponent('# Field notes\n\nThe **row** is the unit; the *column* is the path.\n\n- one\n- two\n')
const FILES = [
  { key: 'labs/README.md', contentType: 'text/markdown', url: MD_URL },
  { key: 'labs/cdn-manifest.json', contentType: 'application/json', url: JSON_URL },
  { key: 'fonts/rot-vf.ttf', contentType: 'font/ttf', url: '#' },
]

/* one previewer, three sizes — the pane, a grid tile, a row thumbnail */
const Fit = ({ fit, box }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
    {FILES.map((o) => (
      <div key={o.key} style={{ width: box, height: fit === 'pane' ? undefined : box }}>
        <KindPreview o={o} fit={fit} />
      </div>
    ))}
  </div>
)

export const Pane = () => <Fit fit="pane" box={320} />
export const Tile = () => <Fit fit="tile" box={140} />
export const Thumb = () => <Fit fit="thumb" box={44} />
