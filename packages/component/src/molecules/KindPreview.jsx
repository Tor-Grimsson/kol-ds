import { useEffect, useState } from 'react'
import { AudioTile, VideoTile } from './AudioPreview.jsx'
import HlsVideo from '../atoms/HlsVideo.jsx'
import CodeBlock from './CodeBlock.jsx'
import AssetPlaceholder from '../utilities/AssetPlaceholder.jsx'
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
 * → `AssetPlaceholder`. Images are the caller's (ColumnBrowser keeps its own
 * `<img>` so it can read the dimensions). Text fetches cap at `textLimit`.
 *
 * @param {object}   o          the object — `{ key, contentType?, displayKey?, segmentCount? }`
 * @param {Function} urlOf      (o) => string — the object's public URL (default: `o.url`)
 * @param {string}   poster     a poster URL for HLS (the sibling image)
 * @param {Function} kindOf · extOf   classification seams (defaults: the DS mediaKinds)
 * @param {Object}   kindLabel  kind → label
 * @param {number}   textLimit  bytes of text fetched for a preview (default 200 KB)
 */
const TEXT_LIMIT = 200 * 1024
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

export default function KindPreview({ o, urlOf = (x) => x.url, poster, kindOf = defaultKindOf, extOf = defaultExtOf, kindLabel = KIND_LABEL, textLimit = TEXT_LIMIT }) {
  const kind = kindOf(o)
  const url = urlOf(o)
  const ext = extOf(o.key)
  const name = o.displayKey ?? o.key
  const isText = kind === 'text' || kind === 'code' || kind === 'markdown' || kind === 'json' || kind === 'yaml'
  const { loading, text, error, truncated } = useTextContent(url, isText, textLimit)

  if (kind === 'playlist') {
    return (
      <div className="flex flex-col items-center gap-2">
        <HlsVideo src={url} poster={poster} className="max-w-full max-h-[70vh] rounded" />
        <span className="kol-mono-12 text-meta">HLS stream · playback is preview-only, no controls</span>
      </div>
    )
  }
  if (kind === 'video') return <VideoTile src={url} poster={poster} />
  if (kind === 'audio') return <AudioTile src={url} />
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
        <CodeBlock code={text} language={language} filename={name} />
        {truncated && <p className="kol-mono-12 text-meta">truncated at {textLimit / 1024} KB</p>}
      </DocPage>
    )
  }
  if (kind === 'segments') {
    return <AssetPlaceholder category="HLS" name={`${o.segmentCount} segments`} note="STREAM CHUNKS" className="w-[420px] max-w-full" />
  }
  return <AssetPlaceholder category={kindLabel[kind] || 'file'} name={name} note={ext ? ext.toUpperCase() : 'FILE'} className="w-[420px] max-w-full" />
}
