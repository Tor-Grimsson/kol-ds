import Button from '../atoms/Button.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import QuickLookFrame from '../molecules/QuickLookFrame.jsx'
import KindPreview from '../molecules/KindPreview.jsx'
import { kindOf, extOf, KIND_LABEL } from '../utilities/mediaKinds.js'

/* taxonomy-ok: organism — nests FullscreenOverlay (utility) + QuickLookFrame / KindPreview (molecules) + Button (atom). */

/**
 * FileQuickLook — Quick Look over a list of files. The composition three places drew by hand — kol-styleguide's
 * `DocumentIndex`, record's `QuickLook` (Bucket.jsx) and its documents table (DocumentLibraryAndBoardParts, kol-website
 * 2026-10-29 — *"I already asked for tables, and download and file preview"*): `FullscreenOverlay` dims the page,
 * `QuickLookFrame` holds the file, pages ‹ › through the list and carries a download; an image shows directly, anything
 * else through `KindPreview`.
 *
 * @param {Array}    files     `[{ key, name?, title?, url?, size?, type? }]` — `key` classifies (its extension), `type` is
 *                             the content type when known
 * @param {number}   index     the open file; `null` closes
 * @param {Function} onIndex   (i) => void — ‹ › paging
 * @param {Function} onClose
 * @param {Function} urlOf     (file) => string — default `file.url`
 * @param {boolean}  download  the download button in the header (default true)
 * @param {Function} meta      (file) => node — the header's facts (default: the size, else the kind)
 * @param {ReactNode} actions  more header controls, before the download
 */
const sizeLabel = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
const nameOf = (f) => f.name ?? f.title ?? f.key?.split('/').pop() ?? ''

export default function FileQuickLook({ files = [], index, onIndex, onClose, urlOf = (f) => f.url, download = true, meta, actions }) {
  const f = index == null ? null : files[index]
  if (!f) return null
  const url = urlOf(f)
  const kind = kindOf({ key: f.key ?? nameOf(f), contentType: f.type ?? f.contentType })
  const facts = meta ? meta(f) : (f.size ? sizeLabel(f.size) : (KIND_LABEL[kind] ?? extOf(f.key ?? '').toUpperCase()))
  const nav = files.length > 1
    ? { index, total: files.length, onPrev: () => onIndex?.((index - 1 + files.length) % files.length), onNext: () => onIndex?.((index + 1) % files.length) }
    : undefined
  return (
    /* QUICK LOOK DIMS, it does not black out — the list stays in view (MediaLibraryPages' rule) */
    <FullscreenOverlay open onClose={onClose} closeButton={false} scrim>
      <QuickLookFrame
        title={nameOf(f)}
        meta={facts}
        actions={<>{actions}{download && url && <Button variant="nav" size="sm" iconOnly="download" href={url} download={nameOf(f)} aria-label="Download" />}</>}
        onClose={onClose}
        nav={nav}
      >
        {kind === 'image'
          ? <img src={url} alt={nameOf(f)} className="kol-quicklook-media" />
          : <KindPreview key={url} o={{ key: (f.key ?? url).split('?')[0], contentType: f.type ?? f.contentType, size: f.size, url }} fit="sheet" urlOf={() => url} />}
      </QuickLookFrame>
    </FullscreenOverlay>
  )
}
