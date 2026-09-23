import { useEffect, useState } from 'react'
import { AudioTile, VideoTile } from './AudioPreview.jsx'
import HlsVideo from '../atoms/HlsVideo.jsx'
import CodeBlock from './CodeBlock.jsx'
import AssetPlaceholder from '../utilities/AssetPlaceholder.jsx'
import FileIcon from '../atoms/FileIcon.jsx'
import PdfPage, { PdfDocument } from './PdfPage.jsx'
import { kindOf as defaultKindOf, extOf as defaultExtOf, KIND_LABEL } from '../utilities/mediaKinds.js'
import markdownToHtml from '../utilities/markdownToHtml.js'
import { parseFrontmatter } from '../utilities/frontmatter.js'
import DocPage from './DocPage.jsx'

/* taxonomy-ok: molecule — nests the DS media atoms + CodeBlock (relative). */

/**
 * KindPreview — a preview for any kind of file: kol-r2b2's `KindPreview.jsx`,
 * promoted 2026-08-27 (SettingsPanelChromeAndColumnPreview). Before it, anything
 * that was not an image or a video showed a grey box with the word "text".
 * HLS → `HlsVideo` (inert — the DS's background-video atom, preview only),
 * video → `VideoTile` and audio → `AudioTile` (ColumnBrowserMediaFacts
 * 2026-08-27 — the square column tile with one play/pause control; no Figure, no
 * border — `VideoBlock`'s Figure border is why kol-r2b2 bypassed it; the overlay
 * player is `AudioPreview`), markdown → rendered prose in `.kol-prose`
 * (markdownToHtml, KindPreviewMarkdown 2026-08-27), json / yaml / text / code →
 * `CodeBlock` (language by kind or extension) — every document on ONE plate,
 * `DocPage` (DocPageAndKindShowcase 2026-08-27: the overlay's A-series page, the
 * column's zoomed frame; markdown's frontmatter rendered above the prose from
 * the same fetch), the rest
 * → `FileIcon` (the generic document). Images are the caller's (ColumnBrowser keeps its own
 * `<img>` so it can read the dimensions). Text fetches cap at `textLimit`.
 *
 * @param {object}   o          the object — `{ key, contentType?, displayKey?, segmentCount? }`
 * @param {string}   text       content ALREADY IN HAND — skips the fetch and joins the same render
 *                              path. For a source with no file behind it (a database row). Pass
 *                              `kind` with it: there is no extension to classify by
 * @param {string}   kind       classification override — `markdown` · `json` · `yaml` · `code` ·
 *                              `text` · `image` · `video` · `audio`. Wins over `kindOf(o)`
 * @param {Function} urlOf      (o) => string — the object's public URL (default: `o.url`)
 * @param {string}   poster     a poster URL for HLS (the sibling image)
 * @param {Function} kindOf · extOf   classification seams (defaults: the DS mediaKinds)
 * @param {Object}   kindLabel  kind → label
 * @param {number}   textLimit  bytes of text fetched for a preview (default 200 KB)
 */
const TEXT_LIMIT = 200 * 1024
/* The glyph a FileIcon carries per kind. A kind not listed gets the bare page + extension. */
export const KIND_GLYPH = { audio: 'music-note', video: 'video', image: 'image', code: 'code', json: 'code', yaml: 'code', font: 'type' }
const LANG = {
  js: 'javascript', mjs: 'javascript', cjs: 'javascript', jsx: 'javascript',
  ts: 'typescript', tsx: 'typescript', json: 'json', yaml: 'yaml', yml: 'yaml',
  css: 'css', html: 'html', sh: 'bash', py: 'python', md: 'markdown',
  csv: 'text', tsv: 'text', pgn: 'text', txt: 'text', xml: 'xml',
}

function useTextContent(url, enabled, limit) {
  const [result, setResult] = useState({ url: null, text: '', error: null, truncated: false })
  useEffect(() => {
    if (!enabled || !url) return undefined
    let cancelled = false
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        const size = Number(res.headers.get('content-length') || 0)
        const body = await res.text()
        if (cancelled) return
        const truncated = body.length > limit || size > limit
        setResult({ url, text: truncated ? body.slice(0, limit) : body, error: null, truncated })
      })
      .catch((e) => { if (!cancelled && e.name !== 'AbortError') setResult({ url, text: '', error: e.message, truncated: false }) })
    return () => { cancelled = true; controller.abort() }
  }, [url, enabled, limit])
  return { ...result, loading: enabled && result.url !== url }
}

/* A FONT SHOWS ITSELF (user 2026-09-23: *"Font needs a preview, we have a big font based collection
 * here"*). The browser loads the file with `FontFace` and the specimen sets it: `Aa`, then the
 * alphabet and the figures. Scoped to a generated family so it can never collide with the app's
 * type, and removed on unmount. Lifted from the media app's overview so the pane and Quick Look
 * get it too — no `kol-foundry` dependency, which sits above this package. */
function useFontFace(src) {
  const [family, setFamily] = useState({ src: null, name: null, failed: false })
  useEffect(() => {
    let live = true
    let h = 0
    for (let i = 0; i < src.length; i += 1) h = (h * 31 + src.charCodeAt(i)) | 0
    const name = `kol-font-preview-${Math.abs(h)}`
    const face = new FontFace(name, `url(${JSON.stringify(src)})`)
    face.load()
      .then((loaded) => { if (!live) return; document.fonts.add(loaded); setFamily({ src, name, failed: false }) })
      .catch(() => { if (live) setFamily({ src, name: null, failed: true }) })
    return () => { live = false; document.fonts.delete(face) }
  }, [src])
  return family.src === src ? family : { name: null, failed: false }
}
function FontSpecimen({ src, fit, fallback }) {
  const { name, failed } = useFontFace(src)
  if (failed) return fallback
  if (!name) return <span className="kol-mono-12 text-meta">Loading the face…</span>
  const big = fit === 'sheet'
  return (
    <div className={`kol-font-specimen${big ? ' kol-font-specimen--sheet' : ''}`} style={{ fontFamily: `"${name}"` }}>
      <span className="kol-font-specimen-aa">Aa</span>
      <span className="kol-font-specimen-set">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</span>
    </div>
  )
}

/* A PDF IS A DOCUMENT AND SHOWS ITS FIRST PAGE (user 2026-09-23: *"pdf is not showing any
 * preview … this is all mapped in finder dropbox google drive"*). Every one of those renders page
 * one; we drew a placeholder card. `PdfPage` draws it with pdf.js.
 *
 * THE SIZE GATE is the honest part: pdf.js pulls the whole file to paint one page, which against
 * a live bucket is a 40MB download for a thumbnail. Past the limit the file icon stands. */
const PDF_LIMIT = 8 * 1024 * 1024

export default function KindPreview({
  o, text: textProp, kind: kindProp, urlOf = (x) => x.url, poster, kindOf = defaultKindOf,
  extOf = defaultExtOf, kindLabel = KIND_LABEL, textLimit = TEXT_LIMIT,
  /* ONE RENDERER, THREE FITS (user 2026-09-23: *"theres just a bunch of different views, why? you
   * know what consistency means?"*). Five surfaces each patched this component with their own CSS
   * or bypassed it — the pane, the wall tile, the row thumb, the kind overview and the overlay. The
   * fit says how much room there is; the LADDER below stays one ladder.
   *
   *   pane  — the column preview and the overlay: captions, full controls
   *   tile  — a card in the wall or the overview: the render, no prose beside it
   *   thumb — a 44px box: no embed, no player; whatever paints instantly or nothing
   *   sheet — the body of the Quick Look window: every page of a PDF with a thumbnail rail
   */
  fit = 'pane',
  pdfLimit = PDF_LIMIT,
}) {
  /* CONTENT IN HAND, OR A URL TO FETCH (content-card-needs-no-cover,
   * kol-client-olina 2026-09-04; shape ruled by kol-r2b2, whose component this
   * is). A markdown note in a D1 row has no file and no URL behind it, so the
   * fetch has nothing to pull — but the RENDER path is the one this component
   * already owns, and a second previewer in the estate is what the lobby exists
   * to prevent.
   *
   * `text` sits BESIDE `o`, not inside it: `o` is the media object — key, size,
   * contentType, uploaded — and that shape is what `kindOf`, `posterFor` and
   * the resolution-set grouping all read. Prose inside it would make the object
   * mean two things.
   *
   * `kind` is not optional sugar. Classification reads the EXTENSION off the
   * key, and a database row has no filename, so `text` alone lands on `other`
   * and renders the right content as the wrong thing — worse than the
   * placeholder it replaces. The two ship together or the seam half-works for
   * the only caller that asked. Precedent: `urlOf`, `kindOf`, `kindLabel` and
   * `partition` are already caller-supplied for the same reason — the DS does
   * not decide what a consumer's object IS. */
  const kind = kindProp ?? kindOf(o)
  const url = urlOf(o)
  const ext = extOf(o.key)
  const name = o.displayKey ?? o.key
  const isText = kind === 'text' || kind === 'code' || kind === 'markdown' || kind === 'json' || kind === 'yaml'
  const fetched = useTextContent(url, isText && textProp == null, textLimit)
  /* content in hand is never loading and never errors — there is nothing to
   * wait for. It still honours `textLimit`, so one long note cannot outgrow a
   * tile the way a fetched one cannot. */
  const { loading, text, error, truncated } = textProp != null
    ? { loading: false, error: null, text: String(textProp).slice(0, textLimit), truncated: String(textProp).length > textLimit }
    : fetched

  /* NOTHING TO DRAW → THE FILE AS A PAGE (user 2026-09-23). An empty file, audio without artwork
   * and a kind no renderer handles all show the same generic document, sized by the fit. */
  const icon = (
    <FileIcon ext={ext} glyph={KIND_GLYPH[kind]}
      className={fit === 'thumb' ? 'h-full w-auto' : fit === 'tile' ? 'w-[38%] max-w-[160px]' : fit === 'sheet' ? 'w-[200px] m-16' : 'w-[40%] max-w-[180px] my-6'} />
  )
  if (o.size === 0) return <div className="w-full h-full flex items-center justify-center">{icon}</div>

  if (kind === 'playlist') {
    /* the caption is pane chrome — in a tile it is a line of prose over the picture */
    if (fit !== 'pane') return <HlsVideo src={url} poster={poster} className="w-full h-full object-cover" />
    return (
      <div className="flex flex-col items-center gap-2">
        <HlsVideo src={url} poster={poster} className="max-w-full max-h-[70vh] rounded" />
        <span className="kol-mono-12 text-meta">HLS stream · playback is preview-only, no controls</span>
      </div>
    )
  }
  if (kind === 'video') return <VideoTile src={url} poster={poster} />
  if (kind === 'audio') return <AudioTile src={url} fallback={icon} />
  if (isText) {
    if (loading) return <span className="kol-mono-12 text-meta">Loading…</span>
    if (error) return <span className="kol-mono-12 text-ui-error">Couldn’t load: {error}</span>
    if (kind === 'markdown') {
      const meta = parseFrontmatter(text)
      return (
        <DocPage frontmatter={Object.keys(meta).length ? meta : null}>
          <div className="kol-prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
          {truncated && <p className="kol-mono-12 text-meta">truncated at {textLimit / 1024} KB</p>}
        </DocPage>
      )
    }
    const language = kind === 'json' ? 'json' : kind === 'yaml' ? 'yaml' : LANG[ext] || 'text'
    return (
      <DocPage>
        <CodeBlock code={text} language={language} filename={name} copy={false} />
        {truncated && <p className="kol-mono-12 text-meta">truncated at {textLimit / 1024} KB</p>}
      </DocPage>
    )
  }
  /* PDF — drawn by pdf.js at every fit but `thumb` (a 44px box cannot show a page and the
   * download is the same size either way): page one in a tile or the pane, every page with a
   * thumbnail rail in the Quick Look window — Finder's layout. The browser's `<embed>` is gone:
   * it is a viewer, and Chrome paints its toolbar over a tile whatever the URL fragment says.
   * Only for a URL a browser can fetch: a placeholder scheme (a fixture, an unresolved key) gets
   * the icon, not a console error and an empty frame. The size gate stands — the whole file is
   * pulled to paint one page. */
  const servableUrl = /^(https?:|data:|blob:|\/)/.test(String(url ?? ''))
  if (ext === 'pdf' && servableUrl && fit !== 'thumb' && (o.size ?? 0) <= pdfLimit) {
    if (fit === 'sheet') return <PdfDocument src={url} fallback={icon} />
    return (
      <PdfPage src={url} fallback={icon}
        className={fit === 'tile' ? 'w-full h-full object-cover object-top' : 'w-full h-auto rounded'} />
    )
  }
  if (kind === 'font' && servableUrl && fit !== 'thumb') return <FontSpecimen src={url} fit={fit} fallback={icon} />
  if (kind === 'segments') {
    return <AssetPlaceholder category="HLS" name={`${o.segmentCount} segments`} note="STREAM CHUNKS" className="w-[420px] max-w-full" />
  }
  return <div className="w-full h-full flex items-center justify-center">{icon}</div>
}
