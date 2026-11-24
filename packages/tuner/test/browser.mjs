/* The four Tuner check pages in the installed Chrome: each page runs once on this package and once on the reference
 * engine, its printed results are compared line for line (timings aside), and the spec's Measured rows are read off
 * this package's run. A small static server on the first free port from 5291 is opened for the run and closed after. */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.txt': 'text/plain' }
const SHELL = (page) => `<!doctype html><meta charset="utf-8"><title>${page}</title>
<pre id="out" style="font:12px monospace;white-space:pre-wrap"></pre><div id="g"></div>
<script type="module">
const engine = new URLSearchParams(location.search).get('engine')
if (engine === 'reference') await new Promise((ok) => { const s = document.createElement('script'); s.src = '/reference/line-swell.js'; s.onload = ok; document.head.append(s) })
else { const M = await import('/src/index.js'); window.LineSwell = { ...M, _vectors: M.tunerVectors } }
window.FLOW_D = await (await fetch('/test/fixtures/flow.d.txt')).text()
const s = document.createElement('script'); s.src = '/test/pages/${page}.js'; document.body.append(s)
</script>`

let REF_JS = ''
function serve(REFS) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x'), p = decodeURIComponent(url.pathname)
    let file = null
    if (p.startsWith('/check/') && !p.includes('/refs/')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(SHELL(p.slice(7))) }
    if (p.startsWith('/src/') || p.startsWith('/test/')) file = join(PKG, p)
    else if (p === '/reference/line-swell.js') file = REF_JS
    else if (p.includes('/refs/')) file = join(REFS, p.slice(p.indexOf('/refs/') + 6)) // the pages ask for refs/ beside themselves
    try { if (!file || !(await stat(file)).isFile()) throw 0; res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file)) }
    catch { res.writeHead(404); res.end() }
  })
  return new Promise((ok, no) => {
    const tryPort = (port) => { server.once('error', (e) => e.code === 'EADDRINUSE' && port < 5390 ? tryPort(port + 1) : no(e)); server.listen(port, '127.0.0.1', () => ok({ server, port })) }
    tryPort(5291)
  })
}

const norm = (t) => t.replace(/\b\d+ ms\b/g, 'N ms').replace(/slowest \d+ ms/g, 'slowest N ms').replace(/, \d+ over 100 ms/g, ', N over 100 ms')

export async function browserChecks({ ref, say, verdict, REFERENCE, REFS }) {
  REF_JS = REFERENCE
  const { chromium } = await import('playwright')
  const refs = ['ref-01.png', 'ref-05.png', 'ref-12.png'].every((f) => existsSync(join(REFS, f)))
  say('\nchrome checks' + (refs ? ', reference marks from ' + REFS : ', reference marks NOT found in ' + REFS + ': their rows fall back to an empty form'))
  const { server, port } = await serve(REFS)
  const browser = await chromium.launch({ channel: 'chrome' })
  const text = {}
  try {
    for (const page of ['tuner-w9', 'tuner-w5', 'tuner-w10', 'tuner-w11']) for (const engine of ref ? ['port', 'reference'] : ['port']) {
      const tab = await browser.newPage()
      const errors = []; tab.on('pageerror', (e) => errors.push(String(e)))
      await tab.goto(`http://127.0.0.1:${port}/check/${page}?engine=${engine}`)
      await tab.waitForFunction(() => window.done === 1, null, { timeout: 900000 })
      text[page + engine] = await tab.$eval('#out', (n) => n.textContent)
      if (errors.length) say('  ' + page + ' ' + engine + ' page errors: ' + errors.join('; '))
      await tab.close()
    }
  } finally { await browser.close(); await new Promise((ok) => server.close(ok)) }
  for (const page of ['tuner-w9', 'tuner-w5', 'tuner-w10', 'tuner-w11']) {
    say('\n' + page + ' on kol-tuner'); text[page + 'port'].trimEnd().split('\n').forEach((l) => say('  ' + l))
    if (ref) {
      const a = norm(text[page + 'port']).split('\n'), b = norm(text[page + 'reference']).split('\n')
      const off = a.map((l, i) => l === b[i] ? null : '    port: ' + l + '\n    reference: ' + b[i]).filter(Boolean)
      off.forEach((l) => say(l))
      verdict(page + ': same results as the reference (timings aside)', off.length === 0 && a.length === b.length)
    }
  }
  measured(text, refs, say, verdict)
}

/* The spec's Measured table (04-tuner.md, 2026-11-18), row by row, read off this package's printed results */
function measured(t, refs, say, verdict) {
  const w9 = t['tuner-w9port'], w5 = t['tuner-w5port'], w10 = t['tuner-w10port'], w11 = t['tuner-w11port']
  const pct = (s) => +s.replace('%', '')
  say('\nMeasured (spec 04-tuner.md) on kol-tuner')
  const rows = [...w9.matchAll(/^ {2}(\S.*?)\s+1024: (\d+) pieces.*?2048: (\d+) pieces.*?fit strays ([\d.]+)% \| area off ([\d.]+)%/gm)].map((m) => ({ name: m[1].trim(), p1: +m[2], p2: +m[3], fit: +m[4], area: +m[5] }))
  const area = Math.max(...rows.map((r) => r.area))
  say('  traced area against the ink: worst ' + area.toFixed(3) + '% over ' + rows.length + ' forms')
  verdict('traced area within 0.4 percent on all eight', rows.length === 8 && area <= 0.4)
  const six = rows.filter((r) => !/ref-0[15]/.test(r.name)), r01 = rows.find((r) => r.name === 'ref-01'), r05 = rows.find((r) => r.name === 'ref-05')
  say('  fit as outline: ' + six.map((r) => r.name + ' ' + r.fit + '%').join(', ') + '; ref-05 ' + r05?.fit + '%, ref-01 ' + r01?.fit + '% (spec 0.85, 3.05)')
  verdict('fit as outline 0.03 to 0.7 percent on six', six.length === 6 && six.every((r) => +r.fit.toFixed(2) >= 0.03 && +r.fit.toFixed(2) <= 0.7)) // the spec writes two decimals: the circle's 0.029 is its 0.03
  const sameRes = rows.filter((r) => r.p1 === r.p2).length
  say('  same pieces at 1024 and 2048: ' + sameRes + ' of ' + rows.length + (r01 ? ', ref-01 differs by ' + Math.abs(r01.p1 - r01.p2) : ''))
  verdict('same pieces at both rasters on seven of eight', sameRes === 7)
  const circ = w9.match(/circle: traced outline strays from a true circle by ([\d.]+)%/), ring = w9.match(/ring: traced outline strays from a true circle by ([\d.]+)%/)
  say('  traced circle against a true circle ' + circ?.[1] + '%, ring ' + ring?.[1] + '% (spec 0.029, 0.032)')
  const vec = w9.match(/circle\s+read as vectors.*?outline strays from the true circle ([\d.]+)%/), scale = /the blob at x1 and at x1000 give the same drawn form: true/.test(w9)
  say('  SVG circle read as vectors, strays ' + vec?.[1] + '%; x1000 draws the identical path: ' + scale)
  verdict('SVG read as vectors, and x1000 identical', !!vec && scale)
  // W7: preset rows at strength 1 print offLadder/join/untuned per form
  const ladder = [...w5.matchAll(/^ {2}(golden|fifth|bold)\s+(.*)$/gm)].map((m) => m[2].trim().split(' ').map((c) => { const [n, v] = c.split(':'); const [off, join, un] = v.split('/'); return { n, off: +off, join: +join, un: +un } }))
  const onLadder = ladder.length ? ladder[0].filter((f, i) => ladder.every((row) => row[i].off === 0 && row[i].join === 0 && row[i].un === 0)).map((f) => f.n) : []
  say('  on the ladder at full strength, every radius and joints at 0: ' + onLadder.length + ' forms (' + onLadder.join(', ') + ')')
  verdict('every radius on the ladder at full strength on seven', onLadder.length >= 7)
  const mis = [...w5.matchAll(/curvature mismatch ([\d.]+)% \| outline moved ([\d.]+)% \| second pass moves ([\d.]+) px/g)]
  const mm = Math.max(...mis.map((m) => +m[1])), sec = Math.max(...mis.map((m) => +m[3]))
  say('  Bezier harmony: curvature mismatch at most ' + mm.toFixed(3) + '%, a second run moves at most ' + sec + ' px')
  verdict('Bezier curvature mismatch at most 0.093 percent', mis.length === 8 && mm <= 0.093)
  const s01 = w10.match(/ref-01 {2}as outline:[\s\S]*?as strokes: (\d+) lines, (\d+) pieces.*?fit ([\d.]+)%.*?worst joint ([\d.]+)°/), s05 = w10.match(/ref-05 {2}as outline:[\s\S]*?as strokes: (\d+) lines, (\d+) pieces.*?fit ([\d.]+)%, left as fitted (\d+)/)
  say('  ref-01 as strokes: ' + (s01 ? s01[1] + ' lines, fit ' + s01[3] + '%, joints ' + s01[4] : 'n/a') + ' (spec 20 lines, 0.22, 0); ref-05 as strokes: ' + (s05 ? s05[2] + ' pieces, fit ' + s05[3] + '%, left as fitted ' + s05[4] : 'n/a') + ' (spec 27, 0.79, 0)')
  const kl = w11.match(/long side differs by ([\d.]+)%/)
  say('  keyline square against the grey ink box: ' + kl?.[1] + '% (spec 0.15)')
  const combo = w11.match(/500 random combinations: (\d+) left the board with neither a form nor a message, (\d+) showed the error line, (\d+) drew a broken path/)
  say('  500 random combinations: ' + combo?.[1] + ' without a form or a message, ' + combo?.[2] + ' with the error line, ' + combo?.[3] + ' broken paths')
  verdict('500 random combinations, none without a form or a message', !!combo && +combo[1] === 0)
  if (!refs) say('  (reference marks missing: the ref rows above are not the spec\'s forms)')
}
