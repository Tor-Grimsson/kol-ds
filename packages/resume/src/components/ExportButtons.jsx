import { useExportDownload } from '../lib/exportDownload'
import { exportRequest } from '../lib/treatments'
import { useResume } from '../data.jsx'

/**
 * Fixed top-right download controls for a treatment preview. Kit treatments
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

  const btn =
    'kol-mono-12 px-3 py-1.5 rounded bg-[#121215] text-white cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-wait'

  return (
    <div className="fixed top-4 right-4 z-50 print:hidden flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button type="button" disabled={!!busy} onClick={() => run('pdf')} className={btn}>
          {busy === 'pdf' ? 'Generating…' : 'Download PDF'}
        </button>
        {treatment.kind === 'kit' && (
          <button type="button" disabled={!!busy} onClick={() => run('svg')} className={btn}>
            {busy === 'svg' ? 'Generating…' : 'SVG (.zip)'}
          </button>
        )}
      </div>
      {err && (
        <pre className="kol-mono-10 max-w-xs whitespace-pre-wrap text-right text-red-700 bg-white/95 border border-red-200 rounded p-2">
          {err}
        </pre>
      )}
    </div>
  )
}
