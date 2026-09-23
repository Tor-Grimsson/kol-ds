import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import FullscreenOverlay from '@kolkrabbi/kol-component/utilities/FullscreenOverlay'
import KindPreview from '@kolkrabbi/kol-component/molecules/KindPreview'
import { MediaInspector } from '@kolkrabbi/kol-component/organisms/MediaLibraryPages'
import { kindOf, isSegment } from '@kolkrabbi/kol-component/utilities/mediaKinds'
import { formatSize } from '@kolkrabbi/kol-media-client'

/* FILE FORMATS — every preview type the product has, each shown with a real file (user 2026-09-23:
 * *"the point of the button is just to show supported file types and to see how they preview"*).
 * It replaced "What is in the buckets", which listed KINDS — the filter vocabulary — so PDF sat
 * under "File", JSON and YAML each took a card, and a type with no file collapsed to a grey strip
 * that said nothing about why.
 *
 * One card per PREVIEW TYPE, in the order a file manager meets them. Each names the extensions it
 * covers, shows the file that stands for it, and opens that file in the real Quick Look window.
 * A card with no file says why — and the fixture carries a real file for every type that can
 * have one, so an empty card here is a missing file, not a missing feature. */

const TYPES = [
  { id: 'image', label: 'Image', exts: 'jpg · png · webp · gif · avif · svg', kinds: ['image'] },
  { id: 'video', label: 'Video', exts: 'mp4 · mov · webm', kinds: ['video'] },
  { id: 'hls', label: 'HLS stream', exts: 'm3u8 — its .ts segments fold into it', kinds: ['playlist'] },
  { id: 'audio', label: 'Audio', exts: 'mp3 · wav · flac · m4a · ogg · aif', kinds: ['audio'] },
  { id: 'pdf', label: 'PDF', exts: 'pdf', kinds: ['pdf'] },
  { id: 'text', label: 'Text', exts: 'md · txt · csv · tsv', kinds: ['markdown', 'text'] },
  { id: 'code', label: 'Code', exts: 'json · yaml · js · ts · jsx · css · html · sh · py · xml', kinds: ['json', 'yaml', 'code'] },
  { id: 'font', label: 'Font', exts: 'ttf · otf · woff · woff2', kinds: ['font'] },
  { id: 'archive', label: 'Archive', exts: 'zip · gz · tar · rar · 7z', kinds: ['archive'],
    note: 'No preview — the contents need unpacking. It shows its file icon.' },
  { id: 'other', label: 'Other', exts: 'any other extension', kinds: ['other'],
    note: 'No renderer matches, so it shows its file icon and extension.' },
  { id: 'folder', label: 'Folder', exts: 'a prefix in the bucket', folder: true },
  { id: 'bucket', label: 'Bucket', exts: 'a source — R2 · B2', bucket: true },
]

/* The file that stands for a type: the one that renders best, smallest within that — cheap AND
 * worth looking at. Markdown before plain text, JSON before the rest of code: the richest render. */
const PREFER = ['markdown', 'json', 'playlist']
/* a photograph stands for "image" better than a 2 KB favicon SVG */
const rank = (o) => (PREFER.includes(o.kind) || (o.kind === 'image' && !/\.svg$/i.test(o.key)) ? 0 : 1)
const representative = (items) => [...items].sort((a, b) => {
  const pa = rank(a)
  const pb = rank(b)
  if (pa !== pb) return pa - pb
  return (a.size ?? 0) - (b.size ?? 0)
})[0]

/* A stream's or a video's still sits in a parent folder; walk up until one turns up. */
function posterOf(sample, all) {
  if (!sample || !['playlist', 'video'].includes(sample.kind)) return null
  let dir = sample.key.slice(0, sample.key.lastIndexOf('/') + 1)
  for (let i = 0; i < 4 && dir; i += 1) {
    const still = all.find((o) => o.bucket === sample.bucket && o.key.startsWith(dir) && /\.(jpe?g|png|webp|avif)$/i.test(o.key))
    if (still) return still.key
    dir = dir.replace(/[^/]+\/$/, '')
  }
  return null
}

function CardPreview({ type, sample, client, folders }) {
  if (type.folder) {
    return (
      <span className="flex flex-col items-center gap-2 text-oq-48">
        <Icon name="folder" size={72} />
        {folders && <span className="kol-mono-12 text-meta">{folders.path}</span>}
      </span>
    )
  }
  if (type.bucket) {
    return (
      <span className="flex flex-col items-center gap-2 text-oq-48">
        <Icon name="database" size={64} />
        <span className="kol-mono-12 text-meta">{folders?.buckets}</span>
      </span>
    )
  }
  if (!sample) return null
  const url = client.mediaUrl(sample.key, sample.bucket)
  if (sample.kind === 'image') return <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
  /* video and HLS show their STILL on the card (user 2026-08-28: "dont auto play hls") */
  if (sample.poster) return <img src={client.mediaUrl(sample.poster, sample.bucket)} alt="" className="w-full h-full object-cover" loading="lazy" />
  /* `kol-media-thumb` is the grid tile's wrapper: documents zoom to the tile the same way there
   * and here, so a text card and a code card read at one scale */
  return <span className="kol-media-thumb block w-full h-full"><KindPreview fit="tile" o={sample} urlOf={() => url} /></span>
}

export default function FileFormats({ open, onClose, client, buckets }) {
  const [state, setState] = useState({ done: false, cards: [], error: null })
  const [look, setLook] = useState(null) // the card's file, open in Quick Look

  useEffect(() => {
    if (!open) return undefined
    let live = true
    Promise.all(buckets.map((b) =>
      client.listMedia('', { bucket: b.id })
        .then((objs) => objs.map((o) => ({ ...o, bucket: b.id, bucketLabel: b.label, kind: kindOf(o) })))
        .catch(() => [])))
      .then((lists) => {
        if (!live) return
        const all = lists.flat().filter((o) => !isSegment(o.key))
        const tree = client.folderTree?.() ?? {}
        const folderCount = Object.values(tree).reduce((n, b) => n + (b.folders?.length ?? 0), 0)
        const deepest = Object.entries(tree).flatMap(([, b]) => b.folders ?? []).sort((a, b) => b.split('/').length - a.split('/').length)[0]
        const cards = TYPES.map((type) => {
          if (type.folder) return { type, count: folderCount, folders: { path: deepest } }
          if (type.bucket) return { type, count: buckets.length, folders: { buckets: buckets.map((b) => b.label).join(' · ') } }
          const items = all.filter((o) => type.kinds.includes(o.kind))
          const sample = items.length ? representative(items) : null
          return {
            type,
            count: items.length,
            sample: sample && { ...sample, poster: posterOf(sample, lists.flat()) },
          }
        })
        setState({ done: true, cards, error: null })
      })
      .catch((e) => { if (live) setState({ done: true, cards: [], error: e.message }) })
    return () => { live = false }
  }, [open, client, buckets])

  if (!open) return null
  const { done, cards, error } = state
  const withFile = cards.filter((c) => c.count).length

  return (
    /* ABOVE THE SETTINGS DRAWER (user 2026-09-23): opened from the drawer, it covers it; its X
     * closes only this, so you land back where you were — settings still open. The overlay sits on
     * the modal tier, the drawer below it, so nothing has to be closed and reopened to get there. */
    /* A STACKING CONTEXT over the drawer: its scrim sits on the modal tier (100) and its panel on
     * 200, so this sheet takes 210 — above both, still under the tooltip tier (300) so its own
     * tooltips show (measured 2026-09-23: the scrim covered every card, the panel the close X). */
    <div style={{ position: 'relative', zIndex: 'calc(var(--kol-z-toast) + 10)' }}>
    <FullscreenOverlay open onClose={onClose}>
      <div className="w-[min(92vw,1500px)] h-[86vh] flex flex-col gap-5 p-2">
        <div className="flex items-center gap-3 shrink-0">
          <h2 className="kol-eyebrow text-fg-80">File formats</h2>
          <span className="kol-mono-12 text-meta">
            {!done ? 'reading every bucket…' : `${withFile} of ${cards.length} types have a file here`}
          </span>
        </div>

        {error && <p className="kol-mono-12 text-ui-error">Couldn’t read the buckets: {error}</p>}

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* EVERY CARD THE SAME HEIGHT (user 2026-09-23 — the video card sat shorter): rows stretch,
            * the tile is a square whose content is absolutely placed, so nothing inside can grow it,
            * and each text line holds one line whatever it says. */}
          <div className="grid gap-4 pb-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
            {cards.map(({ type, count, sample, folders }) => {
              const openable = !!sample
              return (
                /* a div, not a <button>: an audio card carries its own play button, and a button
                 * cannot hold one */
                <div key={type.id} role="button" tabIndex={openable ? 0 : -1} aria-disabled={!openable}
                  onClick={openable ? (e) => { if (!e.target.closest('button')) setLook(sample) } : undefined}
                  onKeyDown={openable ? (e) => { if (e.key === 'Enter') setLook(sample) } : undefined}
                  className={`kol-format-card flex flex-col gap-2 text-left rounded p-2 bg-oq-02 transition-colors ${openable ? 'hover:bg-oq-04 cursor-pointer' : 'cursor-default'}`}>
                  <span className="relative block w-full aspect-square rounded overflow-hidden bg-oq-04">
                    <span className="absolute inset-0 flex items-center justify-center">
                      {count || type.folder || type.bucket
                        ? <CardPreview type={type} sample={sample} client={client} folders={folders} />
                        : <span className="kol-mono-12 text-meta text-center px-6">No {type.label.toLowerCase()} file in any bucket — add one to see its preview.</span>}
                    </span>
                  </span>
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="kol-mono-12 text-strong">{type.label}</span>
                    <span className="kol-mono-12 text-meta">{count}</span>
                  </span>
                  <span className="kol-mono-12 text-meta truncate">{type.exts}</span>
                  <span className="kol-mono-12 text-meta line-clamp-2 min-h-8">
                    {type.note ?? (sample ? `${sample.key.split('/').pop()} · ${formatSize(sample.size)}` : type.folder || type.bucket ? `${count} here` : '—')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {look && (
        <MediaInspector files={[look]} index={0} onClose={() => setLook(null)} onPrev={() => {}} onNext={() => {}}
          mediaUrl={(key) => client.mediaUrl(key, look.bucket)} downloadUrl={(key) => client.downloadUrl(key, look.bucket)}
          keySet={new Set(look.poster ? [look.poster] : [])} />
      )}
    </FullscreenOverlay>
    </div>
  )
}
