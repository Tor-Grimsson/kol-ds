/* tuner-w5.html from the Line Swell canvas checks, its script carried verbatim. One change: the flow test form is drawn from
 * fixtures/flow.d.txt (the reference engine's flow({}).d) since the line effects are not this package's. */
const L = LineSwell, out = document.getElementById('out'), g = document.getElementById('g');
const drawn = (fn) => new Promise((res) => { const c = document.createElement('canvas'); c.width = c.height = 1200; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1200, 1200); x.fillStyle = '#000'; fn(x); const i = new Image(); i.onload = () => res(i); i.src = c.toDataURL(); });
const file = (u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = u; });
const poly = (x, pts) => { x.beginPath(); pts.forEach((q, i) => i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.closePath(); x.fill(); };
const pct = (v) => (v * 100).toFixed(3) + '%';
const show = (name, v) => { const f = document.createElement('figure'); f.style.margin = 0; f.style.color = '#eee'; f.style.font = '11px monospace';
  f.innerHTML = `<svg viewBox="0 0 1200 800" style="display:block;width:100%"><rect width="1200" height="800" fill="#f4f4f4"/><g transform="translate(600 400)"><path d="${v.gridD || ''}" fill="none" stroke="#111" opacity=".22"/><path d="${v.d}" fill="#b3b3b3" fill-rule="evenodd"/><path d="${v.comb0}" fill="#f2c14e" opacity=".8"/><path d="${v.comb1}" fill="#e8743b" opacity=".8"/><path d="${v.comb2}" fill="#c2255c" opacity=".8"/><path d="${v.orig}" fill="none" stroke="#e5303f"/><path d="${v.circles + v.guides}" fill="none" stroke="#111" opacity=".7"/><path d="${v.dots}" fill="#111"/>${v.kl ? `<path d="${v.kl.key}" fill="none" stroke="${v.kl.keyColor}" stroke-width="${v.kl.width}" stroke-dasharray="${v.kl.dash}"/><path d="${v.kl.diag}" fill="none" stroke="#0A8DA4" stroke-width="${v.kl.width}" stroke-dasharray="${v.kl.dash}"/>` : ''}${v.labels.map(l => `<text x="${l.x}" y="${l.y}" font-size="14" font-family="monospace">${l.t}</text>`).join('')}</g></svg>${name}`; g.append(f); };
(async () => {
  let t = '';
  const flowImg = await drawn((x) => { x.translate(600, 600); x.fill(new Path2D(FLOW_D)); });
  const forms = [
    ['circle', await drawn((x) => { x.beginPath(); x.arc(600, 600, 440, 0, 7); x.fill(); }), {}],
    ['ring', await drawn((x) => { x.beginPath(); x.arc(600, 600, 480, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(600, 600, 300, 0, Math.PI * 2); x.fill(); }), {}],
    ['crescent (built in)', null, {}], ['letter S', null, { sample: 'letter', letter: 'S' }], ['letter R', null, { sample: 'letter', letter: 'R' }],
    ['ref-01', await file('refs/ref-01.png'), {}], ['ref-05', await file('refs/ref-05.png'), {}], ['ref-12', await file('refs/ref-12.png'), {}]];
  t += 'W5 bezier, drift limit 0.5%, golden ladder at full strength\n';
  for (const [name, img, p] of forms) {
    const v = L.tuner({ ...p, strength: 1, curves: 'bezier', harmonize: true, drift: 0.5 }, img), b = v.stats.bez, n0 = L.tuner({ ...p, strength: 1, curves: 'bezier', harmonize: false }, img).stats.bez;
    const refusedLabels = v.labels.filter((l) => l.t === 'refused').length;
    t += '  ' + name.padEnd(20) + ' cubic vs circles ' + pct(n0.arcErr) + ' | harmonized ' + b.harmonized + ', left alone ' + b.left + ', refused ' + b.refused + ' (marked ' + refusedLabels + ') | curvature mismatch ' + pct(b.mismatch) + ' | outline moved ' + pct(b.drift) + ' | second pass moves ' + b.second.toFixed(4) + ' px\n';
  }
  t += 'W7 presets on all eight forms: off-ladder arcs at full strength, worst joint, outlines left as fitted\n';
  for (const pr of Object.keys(L.tunerPresets)) { let line = '  ' + pr.padEnd(9);
    for (const [name, img, p] of forms) { const s = L.tuner({ ...p, preset: pr }, img).stats; line += ' ' + name.split(' ')[0] + ':' + (L.tunerPresets[pr].strength === 1 ? s.offLadder : '-') + '/' + s.join.toFixed(0) + '/' + s.untuned; }
    t += line + '\n'; }
  let same = 0; for (const pr of Object.keys(L.tunerPresets)) for (const [name, img, p] of forms) if (L.tuner({ ...p, preset: pr }, img).d === L.tuner({ ...p, preset: 'custom', ...L.tunerPresets[pr] }, img).d) same++;
  t += '  preset equals custom with the same values: ' + same + ' of ' + Object.keys(L.tunerPresets).length * forms.length + '\n';
  t += 'W6 keylines: the form\'s long side in grid units, and how far the tuned outline pokes past the 20-unit square on that axis\n';
  for (const [name, img, p] of forms.concat([['flow', flowImg, {}]])) { const v = L.tuner({ ...p, strength: 1 }, img), box = v.box * 1.2, u = box / 24, nums = v.d.match(/[MLA][^MLAZ]*/g).map((c) => { const q = c.slice(1).trim().split(/[\s,]+/).map(Number); return q.slice(-2); });
    const xs = nums.map((q) => q[0]), ys = nums.map((q) => q[1]), wide = Math.max(...xs) - Math.min(...xs) >= Math.max(...ys) - Math.min(...ys), a = wide ? xs : ys, poke = Math.max(0, Math.max(...a) - 10 * u, -10 * u - Math.min(...a));
    t += '  ' + name.padEnd(20) + ' long side ' + (v.box / u).toFixed(3) + ' units | tuned joints past the keyline by ' + pct(poke / v.box) + ' of the form\n'; }
  t += 'W8 grids\n';
  for (const k of ['square', 'diagonal', 'isometric', 'hexagonal']) { const d = L.grid(k, 40, 0), segs = d.match(/M[^M]+/g).map((sg) => sg.slice(1).split('L').map((q) => q.split(' ').map(Number))); const angs = new Set(), offs = {};
    segs.forEach((sg) => { for (let i = 0; i < sg.length - 1; i++) { const a = ((Math.atan2(sg[i + 1][1] - sg[i][1], sg[i + 1][0] - sg[i][0]) * 180 / Math.PI) % 180 + 180) % 180, r = Math.round(a * 100) / 100 % 180; angs.add(r); if (k !== 'hexagonal') { const an = a * Math.PI / 180, o = -Math.sin(an) * sg[i][0] + Math.cos(an) * sg[i][1]; (offs[r] = offs[r] || []).push(o); } } });
    let sp = ''; for (const r in offs) { const o = offs[r].sort((a, b) => a - b), gaps = o.slice(1).map((v, i) => v - o[i]); sp += ' ' + r + '°: spacing ' + Math.min(...gaps).toFixed(2) + ' to ' + Math.max(...gaps).toFixed(2); }
    t += '  ' + k.padEnd(10) + ' line angles ' + [...angs].sort((a, b) => a - b).join(', ') + (sp ? ' |' + sp : '') + '\n'; }
  const iso = await drawn((x) => { const c = [600, 600], r = 420, p = (a, rr) => [c[0] + rr * Math.cos(a * Math.PI / 180), c[1] + rr * Math.sin(a * Math.PI / 180)]; poly(x, [p(-90, r), p(-30, r), p(30, r), p(90, r), p(150, r), p(210, r)]); x.fillStyle = '#fff'; poly(x, [p(-90, r * 0.5), p(-30, r * 0.5), p(30, r * 0.5), p(90, r * 0.5), p(150, r * 0.5), p(210, r * 0.5)]); });
  const sq = await drawn((x) => { poly(x, [[200, 200], [1000, 200], [1000, 500], [600, 500], [600, 1000], [200, 1000]]); });
  for (const [name, img] of [['hexagon ring (isometric)', iso], ['L shape (square)', sq], ['circle', forms[0][1]], ['flow', flowImg]]) { const v = L.tuner({ grid: 'auto', strength: 0 }, img), sc = v.stats.grid;
    t += '  ' + name.padEnd(26) + Object.keys(sc).map((k) => k + ' ' + Math.round(sc[k].edges * 100) + '%').join(', ') + ' | auto draws: ' + v.stats.gridKind + (v.stats.gridKind !== 'off' ? ', turned ' + v.stats.gridTurn + '°' : '') + '\n'; }
  out.textContent = t;
  const fl = L.tuner({ strength: 1, harmony: 'major scale', curves: 'bezier', comb: true }, flowImg); fl.kl = L.keylines(fl.box * 1.2, '#f4f4f4'); show('flow: bezier, comb, keylines', fl);
  const fc = L.tuner({ strength: 1, comb: true }, flowImg); show('flow: circles with comb', fc);
  show('hexagon ring: auto grid', L.tuner({ grid: 'auto', strength: 0 }, iso)); show('S: preset smooth with comb', L.tuner({ sample: 'letter', letter: 'S', preset: 'smooth', comb: true }));
  show('L shape: auto grid', L.tuner({ grid: 'auto', strength: 0 }, sq)); show('crescent: hexagonal grid', L.tuner({ grid: 'hexagonal', gridStep: 2 }));
  window.done = 1;
})();
