import { useEffect, useState } from 'react'
import FullscreenOverlay from '@kolkrabbi/kol-component/utilities/FullscreenOverlay'
import KindPreview from '@kolkrabbi/kol-component/molecules/KindPreview'
import Button from '@kolkrabbi/kol-component/atoms/Button'
import { kindOf, KIND_LABEL } from '@kolkrabbi/kol-component/utilities/mediaKinds'
import { formatSize } from '@kolkrabbi/kol-media-client'

/* Ported from kol-r2b2 verbatim — only the two class/family prefixes are renamed.
 *
 * WHAT THE SYSTEM CAN SHOW — the overview behind the grid button beside the settings gear.
 *
 * All kinds, in the vocabulary's own order, surveyed across ALL buckets rather than the open one.
 * That is the whole point: JSON, YAML, code, HLS, fonts and archives barely exist in any single
 * bucket, so a per-bucket view showed eight empty tiles and answered nothing. Each tile previews a
 * real file, says how many there are and where they live; clicking opens it large in place. */

/* WHICH FILE STANDS FOR A KIND. Smallest-wins was wrong — the smallest image in a bucket is a 2 KB
 * SVG, which KindPreview draws as a placeholder card, so the `image` tile was the one tile with no
 * picture in it. Rank by whether the file will actually RENDER, then by size. */
const RENDERS = /\.(jpe?g|png|webp|gif|avif|mp4|mov|webm|m4a|mp3|wav|flac|md|json|ya?ml|txt|csv|tsv|js|ts|jsx|tsx|css|html|sh|py|xml|woff2?|ttf|otf|m3u8)$/i
/* Rank: renders at all, then whether it clears a floor meaning "a real asset, not a thumbnail or a
 * stub", then smallest within that band — cheap AND worth looking at. */
const FLOOR = 40 * 1024
/* An HLS playlist's still lives beside it — the same folder, an image. Found from the full listing
 * rather than guessed from the name, so a renamed still still resolves. */
function withPoster(sample, all) {
  if (!sample || !['playlist', 'video'].includes(kindOf(sample))) return sample
  /* The still is NOT beside the playlist: a stream sits in `<name>/hls/1080p/index.m3u8` and its
   * poster two levels up. Walk the parents until one turns up. */
  let dir = sample.key.slice(0, sample.key.lastIndexOf('/') + 1)
  for (let i = 0; i < 4 && dir; i += 1) {
    const still = all.find((o) => o.bucket === sample.bucket && o.key.startsWith(dir) && /\.(jpe?g|png|webp|avif)$/i.test(o.key))
    if (still) return { ...sample, poster: still.key }
    dir = dir.replace(/[^/]+\/$/, '')
  }
  return sample
}

const representative = (objs) => [...objs].sort((a, b) => {
  const ra = RENDERS.test(a.key) ? 0 : 1
  const rb = RENDERS.test(b.key) ? 0 : 1
  if (ra !== rb) return ra - rb
  const fa = (a.size ?? 0) >= FLOOR ? 0 : 1
  const fb = (b.size ?? 0) >= FLOOR ? 0 : 1
  if (fa !== fb) return fa - fb
  return (a.size ?? 0) - (b.size ?? 0)
})[0]

/* A FONT IS RENDERABLE. KindPreview shows fonts as a placeholder, but the browser can load the file:
 * `FontFace` takes the URL and the tile shows the face setting its own name. Scoped to a generated
 * family so it can never collide with the app's type, and removed on unmount. */
function FontSample({ src, big = false }) {
  const [family, setFamily] = useState(null)
  useEffect(() => {
    let live = true
    let h = 0
    for (let i = 0; i < src.length; i += 1) h = (h * 31 + src.charCodeAt(i)) | 0
    const name = `media-preview-${Math.abs(h)}`
    const face = new FontFace(name, `url(${JSON.stringify(src)})`)
    face.load()
      .then((loaded) => { if (!live) return; document.fonts.add(loaded); setFamily(name) })
      .catch(() => {})
    return () => { live = false; document.fonts.delete(face) }
  }, [src])
  if (!family) return <span className="kol-mono-10 text-fg-32">loading the face…</span>
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3 text-fg-default overflow-hidden" style={{ fontFamily: family }}>
      <span style={{ fontSize: big ? 96 : 38, lineHeight: 1.05 }}>Aa</span>
      <span style={{ fontSize: big ? 24 : 12, lineHeight: 1.3 }} className="text-fg-64">AaBbCc 0123</span>
    </div>
  )
}

function Preview({ entry, client, big = false }) {
  const url = client.mediaUrl(entry.key, entry.bucket)
  /* IMAGES ARE THE CONSUMER'S. `KindPreview` has no image branch — it handles video, audio, HLS,
   * documents and placeholders, and leaves plain images to the caller. */
  if (entry.kind === 'image') {
    return <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
  }
  if (entry.kind === 'font') return <FontSample src={url} big={big} />
  /* HLS and video both show a STILL (user 2026-08-28 — "dont auto play hls, and fill it with no
   * text"). KindPreview mounts HlsVideo / VideoTile, which pull segments and — with no poster —
   * draw an unloaded black rectangle, so the `video` tile came up blank. */
  if (entry.kind === 'playlist' || entry.kind === 'video') {
    if (entry.poster) return <img src={client.mediaUrl(entry.poster, entry.bucket)} alt="" className="w-full h-full object-cover" loading="lazy" />
    if (entry.kind === 'playlist') return <span className="kol-mono-10 text-fg-32">HLS</span>
  }
  return <KindPreview o={entry} urlOf={() => url} />
}

export default function KindOverview({ open, onClose, client, buckets }) {
  const [state, setState] = useState({ done: false, groups: [], error: null })
  const [shown, setShown] = useState(null) // the kind opened large, over the grid

  useEffect(() => {
    if (!open) return undefined
    let live = true
    // Every bucket, in parallel — a kind absent here is usually present next door.
    Promise.all(buckets.map((b) =>
      client.listMedia('', { bucket: b.id })
        .then((objs) => objs.map((o) => ({ ...o, bucket: b.id, bucketLabel: b.label, displayKey: o.displayKey ?? o.key })))
        .catch(() => [])))
      .then((lists) => {
        if (!live) return
        const by = new Map()
        for (const o of lists.flat()) {
          const kind = kindOf(o)
          if (!by.has(kind)) by.set(kind, [])
          by.get(kind).push({ ...o, kind })
        }
        const groups = Object.keys(KIND_LABEL).map((kind) => {
          const items = by.get(kind) ?? []
          const homes = [...new Set(items.map((o) => o.bucketLabel))]
          return {
            kind,
            count: items.length,
            bytes: items.reduce((n, o) => n + (o.size ?? 0), 0),
            homes,
            sample: items.length ? withPoster(representative(items), lists.flat()) : null,
          }
        })
        /* Present kinds first, empties gathered after them — the vocabulary's order is kept inside
         * each block. A grid that alternates populated squares with collapsed strips reads as broken
         * rather than as an answer. */
        groups.sort((a, b) => (b.count ? 1 : 0) - (a.count ? 1 : 0))
        setState({ done: true, groups, error: null })
      })
      .catch((e) => { if (live) setState({ done: true, groups: [], error: e.message }) })
    return () => { live = false }
  }, [open, client, buckets])

  // Esc steps back to the grid before it closes the dialog.
  useEffect(() => {
    if (!shown) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setShown(null) } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [shown])

  if (!open) return null
  const { done, groups, error } = state
  const present = groups.filter((g) => g.count).length

  return (
    <FullscreenOverlay open onClose={onClose}>
      <div className="w-[min(92vw,1500px)] h-[86vh] flex flex-col gap-5 p-2">
        {/* Both labels sit LEFT: the overlay's close button is absolute to the SCRIM, not to this
            box, so anything right-aligned here aligns against a different coordinate space. */}
        <div className="flex items-center gap-3 shrink-0">
          {shown && (
            <Button size="sm" variant="secondary" onClick={() => setShown(null)}>← All kinds</Button>
          )}
          <h2 className="kol-eyebrow text-fg-80">{shown ? KIND_LABEL[shown.kind] : 'What is in the buckets'}</h2>
          <span className="kol-mono-12 text-fg-48">
            {!done ? 'reading every bucket…'
              : shown ? `${shown.count} across ${shown.homes.join(' · ')}`
              : `${present} of ${groups.length} kinds present`}
          </span>
        </div>

        {error && <p className="kol-mono-12 text-ui-error">Couldn’t read the buckets: {error}</p>}

        {shown ? (
          <>
            <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center">
              <Preview entry={shown.sample} client={client} big />
            </div>
            <p className="kol-mono-12 text-fg-48 text-center shrink-0">
              {shown.sample.displayKey} · {formatSize(shown.sample.size)} · {shown.sample.bucketLabel}
            </p>
          </>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid gap-4 items-start pb-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
              {groups.map((g) => (
                <button
                  key={g.kind}
                  type="button"
                  disabled={!g.count}
                  onClick={() => setShown(g)}
                  aria-label={g.count ? `Open this ${KIND_LABEL[g.kind]}` : `No ${KIND_LABEL[g.kind]} in any bucket`}
                  className={`flex flex-col gap-2 text-left rounded p-2 transition-colors ${
                    g.count ? 'bg-fg-02 hover:bg-fg-04 cursor-pointer' : 'bg-fg-01 opacity-40 cursor-default'
                  }`}
                >
                  {/* A kind no bucket holds collapses to a strip — it still answers "the system can
                      show this", without a square of dead grid. */}
                  <div className={`media-kind-tile w-full rounded overflow-hidden flex items-center justify-center bg-fg-02 ${g.sample ? 'aspect-square' : 'h-10'}`}>
                    {g.sample
                      ? <Preview entry={g.sample} client={client} />
                      : <span className="kol-mono-10 text-fg-32">none in any bucket</span>}
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="kol-mono-12 text-fg-default">{KIND_LABEL[g.kind]}</span>
                    <span className="kol-mono-12 text-fg-48">{g.count}</span>
                  </div>
                  <span className="kol-mono-10 text-fg-32 truncate">
                    {g.count ? `${formatSize(g.bytes)} · ${g.homes.join(' · ')}` : '—'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </FullscreenOverlay>
  )
}
