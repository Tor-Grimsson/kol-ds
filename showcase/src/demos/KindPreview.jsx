import { KindPreview } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const JSON_URL = 'data:application/json,' + encodeURIComponent(JSON.stringify({ name: 'kol', kinds: ['image', 'video', 'audio', 'text'] }, null, 2))
const MD_URL = 'data:text/markdown,' + encodeURIComponent('# Field notes\n\nThe **row** is the unit; the *column* is the path.\n\n- one\n- two\n\n```js\nconst x = 1\n```\n')
const FILES = [
  { key: 'labs/README.md', contentType: 'text/markdown', url: MD_URL },
  { key: 'labs/cdn-manifest.json', contentType: 'application/json', url: JSON_URL },
  { key: 'fonts/rot-vf.ttf', contentType: 'font/ttf', url: '#' },
]

/* a preview for any kind: markdown → prose in .kol-prose, json / yaml / text / code → CodeBlock,
 * audio → AudioPlayer, HLS → HlsVideo, the rest → AssetPlaceholder */
export default function KindPreviewDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      {FILES.map((o) => <KindPreview key={o.key} o={o} />)}
    </div>
  )
}
