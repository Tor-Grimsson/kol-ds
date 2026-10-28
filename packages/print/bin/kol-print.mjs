#!/usr/bin/env node
// kol-print <doc.md> --studio <studio.json> [--meta <print.json>] [--nn 07] [--out ~/Downloads] [--canvas-dir <dir>] [--work <dir>]
// One kol-docs markdown file → NN-<slug>-<doc>.{pdf,docx,md} in the Kolkrabbi A4 document style, then verifies them.
// The dotfiles kol-print's kol-print.js, carried (@kolkrabbi/kol-print, 2026-10-28); what changed is the studio: its details
// and logo come from --studio (a JSON with `studio · designer · address · contacts` and optional `logoSvg` / `logoPng`
// paths, relative to the JSON), because a published package carries no studio's personal details.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { flow, paginateHtml, printHtml, footLine, toDocxBuffer, toMarkdown, SHEET_CSS } from '../src/index.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2), opt = {}, pos = []
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (opt[argv[i].slice(2)] = argv[++i]) : pos.push(argv[i])
const die = (m) => { console.error('kol-print: ' + m); process.exit(1) }
const home = (p) => p && p.replace(/^~(?=\/|$)/, os.homedir())
if (!pos[0]) die('usage: kol-print <doc.md> --studio studio.json [--meta print.json] [--nn NN] [--out dir] [--canvas-dir dir]')
const MD = path.resolve(home(pos[0]))
if (!fs.existsSync(MD)) die('no such file: ' + MD)

/* headless Chrome from the CLI — the dotfiles' lib/chrome.js. `--virtual-time-budget` lets web fonts land before the print
 * (kol-website apps/record's render-pdf.mjs waited on document.fonts.ready for the same reason) */
const BIN = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const chrome = (work, args, ms = 90000) => execFileSync(BIN, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${path.join(work, 'chrome-profile')}`, ...args], { timeout: ms, maxBuffer: 256 << 20, stdio: ['ignore', 'pipe', 'ignore'] }).toString()

// the studio: --studio, else the nearest .kol/studio.json above the file
function findUp(dir, name) {
  for (; dir !== path.dirname(dir); dir = path.dirname(dir)) { const f = path.join(dir, '.kol', name); if (fs.existsSync(f)) return f }
}
const studioFile = home(opt.studio) || findUp(path.dirname(MD), 'studio.json')
if (!studioFile) die('no studio details: pass --studio studio.json ({ studio, designer, address, contacts, logoSvg?, logoPng? })')
const studio = JSON.parse(fs.readFileSync(studioFile, 'utf8'))
const rel = (p) => p && path.resolve(path.dirname(studioFile), home(p))
const logoSvg = studio.logoSvg ? fs.readFileSync(rel(studio.logoSvg), 'utf8') : ''
const logoPng = studio.logoPng ? fs.readFileSync(rel(studio.logoPng)) : undefined

// project details: --meta, else the nearest .kol/print.json above the file
const metaFile = home(opt.meta) || findUp(path.dirname(MD), 'print.json')
if (!metaFile) die('no project details: pass --meta or write .kol/print.json at the repo root (see the skill)')
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'))
for (const k of ['project', 'slug', 'client', 'dates']) if (!meta[k]) die(`${metaFile} is missing "${k}"`)

const base = path.basename(MD, '.md')
const nn = opt.nn || (base.match(/^(\d+)-/) || [])[1] || '01'
const docSlug = base.replace(/^\d+-/, '')
const name = `${nn}-${meta.slug}-${docSlug}`
const OUT = path.resolve(home(opt.out) || path.join(os.homedir(), 'Downloads'))
const work = home(opt.work) || fs.mkdtempSync(path.join(os.tmpdir(), 'kol-print-'))
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(work, { recursive: true })

async function main() {
  const src = fs.readFileSync(MD, 'utf8')
  const { doc, html } = flow(src, meta, studio)
  /* the pages, cut in headless Chrome by the same script PrintStudio runs in the browser */
  const pagFile = path.join(work, 'paginate.html')
  fs.writeFileSync(pagFile, paginateHtml(html, SHEET_CSS))
  const dom = chrome(work, ['--dump-dom', 'file://' + pagFile])
  const m = dom.match(/data-pages="([^"]+)"/)
  if (!m) die('pagination produced no pages — open ' + pagFile + ' in a browser to see why')
  const pages = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'))
  const n = pages.length
  const foot = footLine(studio, meta, doc)

  // PDF
  const printFile = path.join(work, 'print.html')
  fs.writeFileSync(printFile, printHtml(pages, { title: doc, studio, logoSvg, foot }))
  const pdf = path.join(OUT, name + '.pdf')
  chrome(work, ['--no-pdf-header-footer', '--print-to-pdf-no-header', '--virtual-time-budget=5000', `--print-to-pdf=${pdf}`, 'file://' + printFile])

  // DOCX
  const docxFile = path.join(OUT, name + '.docx')
  fs.writeFileSync(docxFile, await toDocxBuffer(pages, { foot, title: `${doc} ${meta.project}`, studio, logoPng }))

  // MD
  fs.writeFileSync(path.join(OUT, name + '.md'), toMarkdown(src, { meta, studio, doc }))

  // optional: the sheets as canvas boards (.dc.html) + the canvas.json entries to merge into the Design artifact
  if (opt['canvas-dir']) {
    const dir = path.resolve(home(opt['canvas-dir'])); fs.mkdirSync(dir, { recursive: true })
    const tpl = fs.readFileSync(path.join(HERE, '..', 'assets', 'sheet.dc.html'), 'utf8')
    const docKey = doc.replace(/[^\w]+/g, '-'), boards = {}
    pages.forEach((p, i) => {
      const f = `${docKey}-${i + 1}.dc.html`
      fs.writeFileSync(path.join(dir, f), tpl.replace('{{TITLE}}', `${meta.short || meta.project} ${doc} ${i + 1} of ${n}`)
        .replace('{{DOCREF}}', meta.project.toUpperCase()).replace('{{BODY}}', p).replace('{{FOOT}}', foot).replace('{{PAGE}}', `${i + 1} / ${n}`))
      boards[f] = { x: i * 1270, y: 0, w: 1190, h: 1684, title: `${doc} · ${i + 1}/${n}`, page: docSlug }
    })
    fs.writeFileSync(path.join(dir, 'canvas-entries.json'), JSON.stringify({ page: { id: docSlug, name: doc }, boards }, null, 2))
  }

  // verify: page count (poppler's pdfinfo when present)
  let pdfPages = null
  try { pdfPages = +(execFileSync('pdfinfo', [pdf]).toString().match(/Pages:\s+(\d+)/) || [])[1] } catch {}
  console.log(`sheets ${n} · pdf pages ${pdfPages ?? '? (no pdfinfo)'}${pdfPages == null || pdfPages === n ? '' : '  ✗ MISMATCH'}`)
  for (const e of ['pdf', 'docx', 'md']) console.log('wrote ' + path.join(OUT, `${name}.${e}`))
  if (opt['canvas-dir']) console.log('canvas: ' + path.resolve(home(opt['canvas-dir'])))
}

main().catch((e) => die(e.stack || String(e)))
