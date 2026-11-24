/* tuner-w9.html from the Line Swell canvas checks, its script carried verbatim. One change: the flow test form is drawn from
 * fixtures/flow.d.txt (the reference engine's flow({}).d) since the line effects are not this package's. */
const L = LineSwell, out = document.getElementById('out');
const drawn = (fn) => new Promise((res) => { const c = document.createElement('canvas'); c.width = c.height = 1200; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1200, 1200); x.fillStyle = '#000'; fn(x); const i = new Image(); i.onload = () => res(i); i.src = c.toDataURL(); });
const file = (u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = u; });
const svgImg = (text) => new Promise((res) => { const i = new Image(); i.onload = () => { i.__svg = text; res(i); }; i.onerror = () => res(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text); });
const pct = (v) => (v * 100).toFixed(3) + '%';
(async () => {
  let t = '';
  const forms = [
    ['circle', await drawn((x) => { x.beginPath(); x.arc(600, 600, 440, 0, 7); x.fill(); }), {}],
    ['ring', await drawn((x) => { x.beginPath(); x.arc(600, 600, 480, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(600, 600, 300, 0, Math.PI * 2); x.fill(); }), {}],
    ['crescent (built in)', null, {}], ['letter S', null, { sample: 'letter', letter: 'S' }], ['letter R', null, { sample: 'letter', letter: 'R' }],
    ['ref-01', await file('refs/ref-01.png'), {}], ['ref-05', await file('refs/ref-05.png'), {}], ['ref-12', await file('refs/ref-12.png'), {}]];
  t += '9.1 same behavior at 1024 and 2048 (pieces = arcs + lines, corners), and time at 2048\n';
  for (const [name, img, p] of forms) {
    const a = L.tuner({ ...p, raster: 1024 }, img).stats; const t0 = performance.now(); const b = L.tuner({ ...p, raster: 2048 }, img).stats, ms = Math.round(performance.now() - t0);
    t += '  ' + name.padEnd(20) + ' 1024: ' + (a.arcs + a.lines) + ' pieces, ' + a.corners + ' corners | 2048: ' + (b.arcs + b.lines) + ' pieces, ' + b.corners + ' corners | fit strays ' + pct(b.fitDev) + ' | area off ' + pct(b.areaOff) + ' | ' + ms + ' ms\n';
  }
  for (const name of ['circle', 'ring']) { const img = forms.find((f) => f[0] === name)[1], v = L.tuner({ raster: 2048 }, img); let worst = 0;
    for (const pts of v.outline) { const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length, r = pts.reduce((s, q) => s + Math.hypot(q[0] - cx, q[1] - cy), 0) / pts.length; for (const q of pts) worst = Math.max(worst, Math.abs(Math.hypot(q[0] - cx, q[1] - cy) - r)); }
    t += '  ' + name + ': traced outline strays from a true circle by ' + pct(worst / v.stats.size) + '\n'; }
  t += '9.2 SVG read as vectors\n';
  const svgs = { circle: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>',
    ring: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill-rule="evenodd" d="M50 5a45 45 0 1 0 0 90a45 45 0 1 0 0-90zm0 20a25 25 0 1 1 0 50a25 25 0 1 1 0-50z"/></svg>',
    blob: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g transform="translate(10 10)"><path d="M90 0C140 0 180 40 180 90C180 150 130 180 90 180C40 180 0 150 0 100C0 60 30 50 50 40C70 30 70 0 90 0Z"/></g></svg>',
    'blob x1000': '<svg xmlns="http://www.w3.org/2000/svg" width="200000" height="200000"><g transform="scale(1000) translate(10 10)"><path d="M90 0C140 0 180 40 180 90C180 150 130 180 90 180C40 180 0 150 0 100C0 60 30 50 50 40C70 30 70 0 90 0Z"/></g></svg>',
    'stroke only (falls back)': '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="50" cy="50" r="30" fill="none" stroke="#000" stroke-width="12"/></svg>' };
  const res = {};
  for (const k in svgs) { const img = await svgImg(svgs[k]); const v = L.tuner({ strength: 1 }, img), s = v.stats; res[k] = v;
    let worst = null; if (k === 'circle') { worst = 0; for (const pts of v.outline) for (const q of pts) worst = Math.max(worst, Math.abs(Math.hypot(q[0] - 256, q[1] - 256) - 215)); }
    t += '  ' + k.padEnd(26) + v.source.padEnd(28) + ' outlines ' + v.outline.length + ' | fit strays ' + pct(s.fitDev) + (worst !== null ? ' | outline strays from the true circle ' + pct(worst / s.size) : '') + ' | pieces ' + (s.arcs + s.lines) + ' | tuned moved ' + pct(s.tunedDev) + ' | join ' + s.join.toFixed(2) + '\n'; }
  t += '9.3 scale: the blob at x1 and at x1000 give the same drawn form: ' + (res.blob.d === res['blob x1000'].d) + '\n';
  if (res.blob.d !== res['blob x1000'].d) { const na = res.blob.d.match(/-?\d+\.?\d*/g).map(Number), nb = res['blob x1000'].d.match(/-?\d+\.?\d*/g).map(Number); let w = 0; for (let i = 0; i < Math.min(na.length, nb.length); i++) w = Math.max(w, Math.abs(na[i] - nb[i])); t += '   numbers ' + na.length + ' vs ' + nb.length + ', largest difference ' + w + ' board px (' + pct(w / res.blob.box) + ' of the form)\n'; }
  out.textContent = t; window.done = 1;
})();
