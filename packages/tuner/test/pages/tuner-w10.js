/* tuner-w10.html from the Line Swell canvas checks, its script carried verbatim. One change: the flow test form is drawn from
 * fixtures/flow.d.txt (the reference engine's flow({}).d) since the line effects are not this package's. */
const L = LineSwell, out = document.getElementById('out'), g = document.getElementById('g');
const drawn = (fn) => new Promise((res) => { const c = document.createElement('canvas'); c.width = c.height = 1200; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1200, 1200); x.fillStyle = '#000'; x.strokeStyle = '#000'; fn(x); const i = new Image(); i.onload = () => res(i); i.src = c.toDataURL(); });
const file = (u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = u; });
const pct = (v) => (v * 100).toFixed(2) + '%';
const show = (name, v) => { const f = document.createElement('figure'); f.style.margin = 0; f.style.color = '#eee'; f.style.font = '11px monospace';
  f.innerHTML = `<svg viewBox="0 0 1200 800" style="display:block;width:100%"><rect width="1200" height="800" fill="#f4f4f4"/><g transform="translate(600 400)"><path d="${v.d}" fill="#b3b3b3" fill-rule="${v.fillRule}"/><path d="${v.orig}" fill="none" stroke="#e5303f"/><path d="${v.circles}" fill="none" stroke="#111" opacity=".35"/><path d="${v.dots}" fill="#111"/>${v.labels.filter(l => l.y > 200).map(l => `<text x="${l.x}" y="${l.y}" font-size="14" font-family="monospace">${l.t}</text>`).join('')}</g></svg>${name}`; g.append(f); };
(async () => {
  let t = '';
  const refs = [['ref-01', await file('refs/ref-01.png')], ['ref-05', await file('refs/ref-05.png')], ['ref-12', await file('refs/ref-12.png')]];
  t += '10.1 line marks read as strokes (golden ladder, full strength)\n';
  for (const [name, img] of refs) {
    const o = L.tuner({ strength: 1, read: 'outline' }, img).stats; const t0 = performance.now(); const a = L.tuner({ strength: 1, read: 'strokes', raster: 512 }, img).stats, b = L.tuner({ strength: 1, read: 'strokes', raster: 1024 }, img), s = b.stats, ms = Math.round(performance.now() - t0);
    t += '  ' + name + '  as outline: ' + (o.arcs + o.lines) + ' pieces, fit ' + pct(o.fitDev) + ', left as fitted ' + o.untuned + ' of ' + o.outlines + ', worst joint ' + o.join.toFixed(0) + '°\n        as strokes: ' + s.outlines + ' lines, ' + (s.arcs + s.lines) + ' pieces (' + (a.arcs + a.lines) + ' at 512), fit ' + pct(s.fitDev) + ', left as fitted ' + s.untuned + ', worst joint ' + s.join.toFixed(1) + '°, moved ' + pct(s.tunedDev) + ', auto reads it as ' + L.tuner({ read: 'auto' }, img).read + ', ' + ms + ' ms\n';
    show(name + ' as strokes', b); }
  const ring = await drawn((x) => { x.lineWidth = 60; x.beginPath(); x.arc(600, 600, 400, 0, Math.PI * 2); x.stroke(); });
  { const v = L.tuner({ strength: 0, read: 'strokes' }, ring), s = v.stats; const sizePx = 860, k = s.size / sizePx; // the ring's outer size is 860 canvas px
    const rs = [...v.circles.matchAll(/A([\d.]+) /g)].map((m) => +m[1] / 1.25), lab = v.labels.find((l) => /read as/.test(l.t));
    t += '  ring drawn as one stroke: ' + s.outlines + ' line, ' + (s.arcs + s.lines) + ' pieces, radius ' + (rs.length ? (Math.max(...rs) / k).toFixed(1) : '?') + ' (true 400), auto reads it as ' + L.tuner({ read: 'auto' }, ring).read + '\n'; show('ring as one stroke', v);
    window.__ring = v; }
  t += '10.2 ends\n';
  const mk = (cap) => drawn((x) => { x.lineWidth = 90; x.lineCap = cap; x.beginPath(); x.moveTo(250, 800); x.bezierCurveTo(450, 300, 750, 900, 950, 400); x.stroke(); });
  for (const cap of ['butt', 'round']) { const img = await mk(cap), v = L.tuner({ strength: 0, read: 'strokes' }, img); window.__tn = []; L.tuner({ strength: 0, read: 'strokes', debug: true }, img);
    const st = window.__tn.map((q) => q.L).filter((q) => q.stroke); t += '  a stroke drawn with ' + cap + ' ends is read with ends: ' + st.map((q) => q.capA + ' and ' + q.capB).join('; ') + ' | weight ' + st.map((q) => (q.w[Math.floor(q.w.length / 2)] / v.stats.size * 100).toFixed(1) + '% of the form').join(', ') + '\n'; show('stroke with ' + cap + ' ends', v); }
  t += 'outline reading unchanged: ' + ['crescent', 'S', 'R'].map((n, i) => { const p = i ? { sample: 'letter', letter: n } : {}; return L.tuner({ ...p, strength: 1 }).d === L.tuner({ ...p, strength: 1, read: 'outline' }).d; }).join(', ') + '\n';
  out.textContent = t; window.done = 1;
})();
