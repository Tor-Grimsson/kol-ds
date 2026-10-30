import { useExportDownload } from '../lib/exportDownload.js'
import { Button } from '@kolkrabbi/kol-component'
import { exportRequest } from '../lib/treatments.js'
import { useResume } from '../data.jsx'

/**
 * A treatment's download controls, in its toolbar. Kit treatments
 * offer the flat PDF and the editable-text SVG zip; layouts the PDF only. Both
 * go through /api/export (~30–45s: build + headless render), so the running
 * button shows progress. `print:hidden` keeps the chrome out of the file.
 */
export default function ExportButtons({ treatment, lang = 'en', options }) {
  const { busy, err, download } = useExportDownload()
  const { FILE_STEM } = useResume()
  const run = (format) => {
    const { url, filename } = exportRequest(treatment, { lang, format, options, name: FILE_STEM })
    download(format, url, filename)
  }

  /* in a treatment's toolbar, in flow — never pinned over the page's corner (LayoutsAppPages: the floating pair sat on the
     variants control); `Button`, not record's hand-styled buttons */
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button size="sm" tone="inverted" disabled={!!busy} onClick={() => run('pdf')}>
        {busy === 'pdf' ? 'Generating…' : 'Download PDF'}
      </Button>
      {treatment.kind === 'kit' && (
        <Button size="sm" tone="outline" disabled={!!busy} onClick={() => run('svg')}>
          {busy === 'svg' ? 'Generating…' : 'SVG (.zip)'}
        </Button>
      )}
      {err && <pre className="basis-full kol-mono-10 max-w-md whitespace-pre-wrap text-meta border border-fg-12 rounded-[var(--kol-radius-sm)] p-2">{err}</pre>}
    </div>
  )
}
