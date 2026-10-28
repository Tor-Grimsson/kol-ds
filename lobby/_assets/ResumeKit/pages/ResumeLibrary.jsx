import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, MediaLibrary } from '@kolkrabbi/kol-component'
import { KitOptionsFields } from '../components/KitOptions'
import { TREATMENTS, exportRequest } from '../lib/treatments'
import { useExportDownload } from '../lib/exportDownload'
import { readKitOptions } from '../lib/kitOptions'
import { readLang } from '../lib/i18n'

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
  /* an export writes into ../out — re-list the wall when one finishes */
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => { if (!busy) setRefreshKey((k) => k + 1) }, [busy])

  const run = (t, format) => {
    const { url, filename } = exportRequest(t, { lang, format, options })
    download(`${t.slug}:${format}`, url, filename)
  }

  return (
    <main className="p-8 md:p-12 max-w-5xl">
      <header className="mb-8">
        <p className="kol-helper-12 text-meta uppercase mb-2">Resume</p>
        <h1 className="kol-sans-display-03 text-emphasis mb-2">Library</h1>
        <p className="kol-sans-body-02 text-body max-w-prose">
          Every treatment of the source. Open one to preview it, or export it straight from here — the options apply to every card.
        </p>
      </header>

      <section className="border border-fg-08 rounded p-5 mb-10 max-w-md" aria-label="Export options">
        <KitOptionsFields />
      </section>

      {err && (
        <pre className="kol-mono-10 whitespace-pre-wrap text-red-700 bg-white/95 border border-red-200 rounded p-2 mb-6">
          {err}
        </pre>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TREATMENTS.map((t) => (
          <li key={t.slug} className="border border-fg-08 rounded p-5 flex flex-col gap-2">
            <p className="kol-helper-10 text-subtle uppercase">{t.kind === 'kit' ? 'Kit' : 'Layout'}</p>
            <h2 className="kol-sans-heading-04 text-emphasis">{t.label}</h2>
            <p className="kol-sans-body-03 text-body mb-3">{t.blurb}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button tone="outline" size="sm" onClick={() => navigate({ pathname: `/resume/t/${t.slug}`, search })}>
                Open
              </Button>
              <Button tone="outline" size="sm" disabled={!!busy} onClick={() => run(t, 'pdf')}>
                {busy === `${t.slug}:pdf` ? 'Generating…' : 'Download PDF'}
              </Button>
              {t.kind === 'kit' && (
                <Button tone="outline" size="sm" disabled={!!busy} onClick={() => run(t, 'svg')}>
                  {busy === `${t.slug}:svg` ? 'Generating…' : 'SVG (.zip)'}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-12" aria-label="Rendered files">
        <MediaLibrary variant="library" client={outClient} header={false} refreshKey={refreshKey} defaults={OUT_DEFAULTS} />
      </section>
    </main>
  )
}
