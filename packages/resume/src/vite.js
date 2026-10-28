/**
 * kitExportPlugin — the kit's export endpoint, for an app's vite config (ResumeKit, 2026-10-28; kol-website apps/record's
 * `pdfExportPlugin`, carried). GET /api/export?lang=en|is&format=pdf|svg&mode=a4|continuous&layout=<slug> runs the
 * package's `export-kit.sh` in the app's root — build, `vite preview` on its own port, headless Chrome through
 * `render-pdf.mjs` (fonts and images waited), `pdfunite` — and streams the file back. ~30–45s. Serve-only.
 *
 *   import { kitExportPlugin } from '@kolkrabbi/kol-resume/vite'
 *   plugins: [react(), tailwindcss(), kitExportPlugin({ name: 'ada-voyager' })]
 *
 * `name` is the file stem (`<name>-kit.pdf`), the person's — nothing is baked in. The app must route the kit's treatments
 * at `/resume/t/:slug` (ResumeTreatment). `format=svg` needs the app's own `scripts/render-svg.mjs` (record's), not
 * shipped. Needs Google Chrome and poppler (`pdfunite`).
 */
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// run through bash, never directly: npm sets the exec bit on "bin" files only, so an installed copy is rw-r--r--
// (KolResumeExportNotExecutable)
const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'export-kit.sh')

export function kitExportPlugin({ name = 'kit' } = {}) {
  return {
    name: 'kit-pdf-export',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      server.middlewares.use('/api/export', (req, res) => {
        const params = new URL(req.url, 'http://x').searchParams
        const lang = params.get('lang') === 'is' ? 'is' : 'en'
        const svg = params.get('format') === 'svg'
        const continuous = params.get('mode') === 'continuous'
        const layout = params.get('layout') // one resume layout treatment → single-page PDF
        const suffix = lang === 'is' ? '-icelandic' : ''
        const langFlag = lang === 'is' ? ' --icelandic' : ''
        const LAYOUT_SLUGS = ['marginalia', 'rail', 'grid'] // whitelist — this arg reaches bash (mirrors lib/treatments.js)
        let cmd, file, mime, filename
        if (layout && LAYOUT_SLUGS.includes(layout)) {
          const stem = `${name}-layout-${layout}${suffix}`
          cmd = `bash "${SCRIPT}" --single=/resume/t/${layout}:${stem}${langFlag}`
          file = join(root, 'out', `${stem}.pdf`)
          mime = 'application/pdf'
          filename = `${stem}.pdf`
        } else if (svg) {
          filename = `${name}-kit${suffix}-svg.zip`
          cmd = `bash "${SCRIPT}" --svg${langFlag} && cd out && rm -f "${filename}" && zip -j -q "${filename}" svg/*.svg`
          file = join(root, 'out', filename)
          mime = 'application/zip'
        } else if (continuous) {
          cmd = `bash "${SCRIPT}" --continuous${langFlag}`
          file = join(root, 'out', `${name}-kit-continuous${suffix}.pdf`)
          mime = 'application/pdf'
          filename = `${name}-kit${suffix}-continuous.pdf`
        } else {
          cmd = `bash "${SCRIPT}" --v2${langFlag}`
          file = join(root, 'out', `${name}-kit-light-v2${suffix}.pdf`)
          mime = 'application/pdf'
          filename = `${name}-kit${suffix}.pdf`
        }
        /* Kit options (page selection + letter Role/Company) reach the headless render as extra URL query on the preview
           route — handed to bash as an ENV var, never interpolated into the command string: they are user-typed. */
        const KIT_PAGE_IDS = ['cover', 'resume', 'letter', 'portfolio', 'back']
        const kitQuery = []
        const pages = params.get('pages')
        if (pages !== null) {
          const picked = pages.split(',').filter((id) => KIT_PAGE_IDS.includes(id))
          kitQuery.push(`pages=${picked.join(',')}`)
        }
        for (const k of ['role', 'company']) {
          const v = (params.get(k) ?? '').trim().slice(0, 120)
          if (v) kitQuery.push(`${k}=${encodeURIComponent(v)}`)
        }
        const KIT_QUERY = kitQuery.length ? `&${kitQuery.join('&')}` : ''

        const child = spawn('bash', ['-c', cmd], { cwd: root, env: { ...process.env, KIT_QUERY, KIT_NAME: name, KIT_APP: root } })
        let log = ''
        child.stderr.on('data', (d) => { log += d })
        child.stdout.on('data', (d) => { log += d })
        child.on('close', async (code) => {
          let buf
          if (code === 0) { try { buf = await readFile(file) } catch (e) { log += `\n${e}` } }
          if (!buf) { res.statusCode = 500; res.end(`export failed (exit ${code})\n${log}`); return }
          res.setHeader('Content-Type', mime)
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
          res.end(buf)
        })
      })
    },
  }
}
