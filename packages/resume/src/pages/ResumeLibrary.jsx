import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, ContentCard, ContentCollection, LabeledControlSection, MediaLibrary, SectionText } from '@kolkrabbi/kol-component'
import { KitOptionsFields } from '../components/KitOptions.jsx'
import { TREATMENTS, exportRequest } from '../lib/treatments.js'
import { useExportDownload } from '../lib/exportDownload.js'
import { readKitOptions } from '../lib/kitOptions.js'
import { readLang } from '../lib/i18n.js'

/* Every treatment of the source, as cards: open one to preview it at
 * /resume/t/:slug, or export it from here. The options panel writes the URL
 * and the same query rides every Open link — preview, library and headless
 * export always agree.
 *
 * Below the cards, the rendered files themselves (../out, via the dev
 * /api/out endpoint) on KOL's media library wall — browse, Quick Look,
 * download. Read-only: the client carries no write verbs. */
const outClient = {
  listMedia: async (_prefix, { signal } = {}) => {
    const res = await fetch('/api/out', { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()).objects ?? []
  },
  mediaUrl: (key) => `/api/out/file/${key.split('/').map(encodeURIComponent).join('/')}`,
}

/* the wall on, as a grid; PDFs and zips are not in the package's default kinds */
const OUT_DEFAULTS = { layout: 'grid', kinds: ['pdf', 'image', 'archive', 'markdown'] }

export default function ResumeLibrary() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const lang = readLang(params)
  const options = readKitOptions(params)
  const { busy, err, download } = useExportDownload()
  /* the wall of rendered files needs the host's /api/out (kitExportPlugin serves it); a host without it shows no wall,
     never an error */
  const [hasOut, setHasOut] = useState(false)
  useEffect(() => {
    let live = true
    fetch('/api/out').then((r) => (r.ok && /json/.test(r.headers.get('content-type') ?? '') ? setHasOut(live) : null)).catch(() => {})
    return () => { live = false }
  }, [])
  /* an export writes into ../out — re-list the wall when one finishes */
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => { if (!busy) setRefreshKey((k) => k + 1) }, [busy])

  const run = (t, format) => {
    const { url, filename } = exportRequest(t, { lang, format, options })
    download(`${t.slug}:${format}`, url, filename)
  }

  return (
    <main className="p-8 md:p-12 max-w-5xl">
      {/* ON THE SYSTEM'S PARTS (LayoutsAppPages, 2026-10-29 — user: *"nothing here is DS, all inline"*): the page header is
        * `SectionText`, the options a `LabeledControlSection`, the treatments the catalog's `ContentCard` in a
        * `ContentCollection` — record had hand-built each; its logic is unchanged */}
      <SectionText
        level="page"
        eyebrow="Resume"
        headline="Library"
        body="Every treatment of the source. Open one to preview it, or export it straight from here — the options apply to every card."
      />

      <LabeledControlSection label="Export options" className="my-10 max-w-md">
        <KitOptionsFields />
      </LabeledControlSection>

      {err && <pre className="kol-mono-10 whitespace-pre-wrap text-meta border border-fg-12 rounded-[var(--kol-radius-sm)] p-2 mb-6">{err}</pre>}

      <ContentCollection min="320px">
        {TREATMENTS.map((t) => (
          <ContentCard
            key={t.slug}
            variant="article"
            /* a treatment has no cover: no media slot, never the MISSING plate */
            media={false}
            eyebrow={t.kind === 'kit' ? 'Kit' : 'Layout'}
            title={t.label}
            body={t.blurb}
            onClick={() => navigate({ pathname: `/resume/t/${t.slug}`, search })}
            /* the card opens the treatment; its downloads are the card's icon actions, as a catalog card's are */
            actions={
              <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" iconOnly="download" aria-label={busy === `${t.slug}:pdf` ? 'Generating PDF…' : 'Download PDF'} title={busy === `${t.slug}:pdf` ? 'Generating PDF…' : 'Download PDF'} disabled={!!busy} onClick={() => run(t, 'pdf')} />
                {t.kind === 'kit' && <Button size="sm" iconOnly="code" aria-label={busy === `${t.slug}:svg` ? 'Generating SVG…' : 'SVG (.zip)'} title={busy === `${t.slug}:svg` ? 'Generating SVG…' : 'SVG (.zip)'} disabled={!!busy} onClick={() => run(t, 'svg')} />}
              </span>
            }
          />
        ))}
      </ContentCollection>

      {hasOut && (
        <section className="mt-12" aria-label="Rendered files">
          <MediaLibrary variant="library" client={outClient} header={false} refreshKey={refreshKey} defaults={OUT_DEFAULTS} />
        </section>
      )}
    </main>
  )
}
