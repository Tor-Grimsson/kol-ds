import { useState } from 'react'
import { FullscreenOverlay, KindPreview, PageHeader, QuickLookFrame, KIND_LABEL } from '@kolkrabbi/kol-component'
import { Contents } from './BrandGuide.jsx'

/* DOCUMENT INDEX — a folder's pages as the brand book's contents cards (BrandGuide's `Contents`, routed), grouped by
 * `part` (plan-2026-10-28-document W3.3; home here since W5.2). A compact page header, never a hero: the cards are the page.
 *
 * A FILE IS A CARD TOO (DocumentIndexFilesAndIcons049, kol-website 2026-10-28 — a point of the MarkdownPage ticket: *"a
 * folder may also hold PDFs and images; the contents index lists them beside the md pages and opens them in the DS
 * QuickLook, not as pages"*): a row with `file` sits in its part like a page, its kind on the card's small line, and
 * opens in the DS Quick Look window (`QuickLookFrame` over the dimmed page, `KindPreview` as the body — a PDF page by
 * page, an image at its size), paging through the folder's files with ‹ ›. `documentFiles(glob)` in kol-framework makes
 * the rows.
 *
 *   rows      [{ id, to, label?, title, part, meta? }] — a page: label is the card's eyebrow (an entry's parent), part the group
 *             [{ id, file, title, part, ext?, kind? }]  — a file: the served URL; kind from the DS's `kindOf` when not given
 *   title · lede   the header, when the index is a page of its own (Reviews); a folder's index sits under its document
 *   onNavigate(to) the app's router */
const fileLabel = (r) => KIND_LABEL[r.kind] ?? (r.ext ? r.ext.toUpperCase() : 'File')

export default function DocumentIndex({ rows, title, lede, onNavigate }) {
  const files = rows.filter((r) => r.file)
  const [open, setOpen] = useState(null)   // index into `files`
  const index = rows.map((r) => (r.file
    ? { ...r, href: r.file, meta: r.meta ?? fileLabel(r), onClick: (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); setOpen(files.indexOf(r)) } }
    : r))
  const cur = open === null ? null : files[open]
  const step = (d) => setOpen((i) => (i + d + files.length) % files.length)
  return (
    <div className="kol-page flex flex-col gap-6">
      {title && <PageHeader title={title} subtitle={lede} size="sm" voice="mono" />}
      <Contents index={index} onNavigate={onNavigate} />
      {cur && (
        /* QUICK LOOK DIMS, it does not black out — the list stays in view (MediaLibraryPages' rule) */
        <FullscreenOverlay open onClose={() => setOpen(null)} closeButton={false} scrim>
          <QuickLookFrame title={cur.title} meta={fileLabel(cur)} onClose={() => setOpen(null)} nav={files.length > 1 ? { index: open, total: files.length, onPrev: () => step(-1), onNext: () => step(1) } : undefined}>
            {cur.kind === 'image' || /^(png|jpe?g|webp|gif|svg|avif)$/i.test(cur.ext ?? '')
              ? <img src={cur.file} alt={cur.title} className="kol-quicklook-media" />
              : <KindPreview key={cur.file} o={{ key: cur.file.split('?')[0], url: cur.file }} fit="sheet" urlOf={(x) => x.url} />}
          </QuickLookFrame>
        </FullscreenOverlay>
      )}
    </div>
  )
}
