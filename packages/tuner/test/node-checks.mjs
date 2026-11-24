/* The canvas's two node checks, check-system.js and check-comb.js (kol-branding 05-logo-shapes/_files/checks), carried
 * verbatim as functions of an engine `L`, so the same check runs on this package and on the reference engine. Each returns
 * its printed lines and the numbers the gate reads. */

export function checkSystem(L) {
  const out = []
  const log = (...a) => out.push(a.join(' '))
  const quads = (d) => { const rows = new Map(); (d.match(/M[^Z]+Z/g) || []).forEach((q) => { const n = q.slice(1, -1).split('L').map((s) => s.split(' ').map(Number)); const y0 = n[0][1], y1 = n[2][1]; const k = Math.floor(y0 / 2); for (let r = k - 1; r <= Math.floor(y1 / 2) + 1; r++) { if (!rows.has(r)) rows.set(r, []); rows.get(r).push(n); } }); return rows; };
  const inside = (rows, x, y) => { const list = rows.get(Math.floor(y / 2)) || []; for (const n of list) { const y0 = n[0][1], y1 = n[2][1]; if (y < y0 || y > y1 || y1 === y0) continue; const t = (y - y0) / (y1 - y0), a = n[0][0] + (n[3][0] - n[0][0]) * t, b = n[1][0] + (n[2][0] - n[1][0]) * t; if (x >= a && x <= b) return true; } return false; };
  const circlesOf = (m, W) => { const v = L.system(Object.assign({}, m, { join: 'flip' })); return v.recipe.split(';').map((s) => s.trim().split(/\s+/)).filter((t) => t[1] === 'circle' && t[0] === 'x').map((t) => ({ cx: -W / 2 + W * +t[2], cy: -W / 2 + W * +t[3], r: W * +t[4] })); };
  let cases = 0, missing = 0, stray = 0;
  for (const harmony of L.harmonies) for (let circles = 1; circles <= 12; circles++) {
    const base = { harmony, circles, bar: false, foot: false }, W = 480, cs = circlesOf(base, W);
    const fl = quads(L.system(Object.assign({}, base, { join: 'flip' })).d), un = quads(L.system(Object.assign({}, base, { join: 'union' })).d);
    cases++;
    for (let y = -238; y < 238; y += 4) for (let x = -238; x < 238; x += 4) {
      const near = cs.some((c) => Math.abs(Math.hypot(x - c.cx, y - c.cy) - c.r) < 2.5); if (near) continue; // within a slice of an outline: not judged
      const f = inside(fl, x, y), u = inside(un, x, y);
      if (f && !u) missing++;
      if (u && !f) { // must lie inside two bands: at least two outside-in pairs hold exactly one of their circles
        let bands = 0; for (let i = cs.length - 1; i >= 1; i -= 2) { const a = Math.hypot(x - cs[i].cx, y - cs[i].cy) < cs[i].r, b = Math.hypot(x - cs[i - 1].cx, y - cs[i - 1].cy) < cs[i - 1].r; if (a !== b) bands++; }
        if (cs.length % 2 && Math.hypot(x - cs[0].cx, y - cs[0].cy) < cs[0].r) bands++;
        if (bands < 2) stray++;
      }
    }
  }
  log('1.1 cases', cases, '| filled under flip but not union:', missing, '| filled only under union and not inside two bands:', stray);
  // 1.2: his tile, random 1. The two bands that cross share one stub on the axis.
  const v1 = L.system({ random: 1 }), m1 = v1.measures, W = v1.box, rows = quads(v1.d), rf = m1.footSize * m1.y, base = m1.foot ? 1 - rf : 1;
  const ax = -W / 2 + W * (m1.mirror ? 1 - m1.axisAt : m1.axisAt) + (m1.mirror ? -1.5 : 1.5), ya = -W / 2 + W * (base - 2 * m1.x), yb = -W / 2 + W * (base - m1.x);
  let gap = 0, n = 0; for (let y = Math.min(ya, yb) + 1; y < Math.max(ya, yb) - 1; y += 0.5) { n++; if (!inside(rows, ax, m1.flip ? -y : y)) gap++; }
  log('1.2 random 1:', m1.harmony, m1.circles, 'circles | axis samples', n, '| unfilled:', gap);
  // W2: each handle moves its own measure and nothing else
  const keys = ['y', 'axisAt', 'x', 'angle', 'footAt', 'footSize']; let ok = 0;
  for (const k of keys) { const v = L.system({}), h = v.handlePts.find((q) => q.k === k), val = L.systemDrag({}, k, h.p[0] + 40, h.p[1] + (k === 'x' || k === 'angle' ? 40 : 0)); const o = {}; o[k] = val; const v2 = L.system({ over: o });
    const changed = keys.filter((q) => v2.measures[q] !== v.measures[q]); const good = changed.length === 1 && changed[0] === k && v2.d !== v.d || (k === 'angle' && changed.length === 1 && changed[0] === k); if (good) ok++; log('  drag', k, v.measures[k], '->', val, '| changed:', changed.join(','), '| mark redraws:', v2.d !== v.d || v2.guides !== v.guides); }
  log('2.1 handles that move only their own measure:', ok, 'of', keys.length);
  // a handle sits where its measure says: dragging it by nothing leaves the measure as it was
  let still = 0; for (const k of keys) { const v = L.system({}), h = v.handlePts.find((q) => q.k === k); if (Math.abs(L.systemDrag({}, k, h.p[0], h.p[1]) - v.measures[k]) < 0.011 * (k === 'angle' ? 100 : 1)) still++; }
  log('2.1 handles at rest read their own value:', still, 'of', keys.length);
  return { out, pass: missing === 0 && stray === 0 && gap === 0 && ok === keys.length && still === keys.length, nums: { cases, missing, stray, gap, ok, still } }
}

// The comb's height against curvature measured from the drawn outline itself, in both modes.
export function checkComb(L) {
  const out = []
  const nums = (s) => s.trim().split(/[\s,]+/).map(Number);
  let worstAll = 0, farAll = 0
  for (const mode of ['circles', 'bezier']) for (const scale of [1, 2.5]) {
    const v = L.tuner({ strength: 1, curves: mode, comb: true, combScale: scale, harmonize: true }), size = v.stats.size, S = 1.25, K = S * S * size * size * 0.02 * scale, cap = 0.3 * size * S;
    // the outline as drawn: arcs (with their centers worked out) or cubics
    const segs = []; let cur = null;
    for (const c of v.d.match(/[MLACZ][^MLACZ]*/g)) { const t = c[0], q = nums(c.slice(1));
      if (t === 'M' || t === 'L') cur = [q[0], q[1]];
      else if (t === 'C') { segs.push({ kind: 'C', p0: cur, c1: [q[0], q[1]], c2: [q[2], q[3]], p3: [q[4], q[5]] }); cur = [q[4], q[5]]; }
      else if (t === 'A') { const P = cur, Q = [q[5], q[6]], dx = Q[0] - P[0], dy = Q[1] - P[1], d = Math.hypot(dx, dy) || 1e-9, h = Math.sqrt(Math.max(0, q[0] * q[0] - d * d / 4)), sg = q[4] ? 1 : -1; segs.push({ kind: 'A', r: q[0], p0: P, p3: Q, cx: (P[0] + Q[0]) / 2 + sg * h * (-dy / d), cy: (P[1] + Q[1]) / 2 + sg * h * (dx / d) }); cur = Q; } }
    const curvAt = (pt) => { let best = null, bd = 1e9; // curvature of the drawn outline at the point nearest pt
      for (const s of segs) { if (s.kind === 'A') { const dd = Math.abs(Math.hypot(pt[0] - s.cx, pt[1] - s.cy) - s.r) + (Math.hypot(pt[0] - (s.p0[0] + s.p3[0]) / 2, pt[1] - (s.p0[1] + s.p3[1]) / 2) > Math.hypot(s.p3[0] - s.p0[0], s.p3[1] - s.p0[1]) / 2 + 0.5 ? 1e6 : 0); if (dd < bd) { bd = dd; best = 1 / s.r; } }
        else for (let i = 0; i <= 40; i++) { const t = i / 40, u = 1 - t, x = u * u * u * s.p0[0] + 3 * u * u * t * s.c1[0] + 3 * u * t * t * s.c2[0] + t * t * t * s.p3[0], y = u * u * u * s.p0[1] + 3 * u * u * t * s.c1[1] + 3 * u * t * t * s.c2[1] + t * t * t * s.p3[1], dd = Math.hypot(pt[0] - x, pt[1] - y);
          if (dd < bd) { bd = dd; const x1 = 3 * (u * u * (s.c1[0] - s.p0[0]) + 2 * u * t * (s.c2[0] - s.c1[0]) + t * t * (s.p3[0] - s.c2[0])), y1 = 3 * (u * u * (s.c1[1] - s.p0[1]) + 2 * u * t * (s.c2[1] - s.c1[1]) + t * t * (s.p3[1] - s.c2[1])), x2 = 6 * (u * (s.c2[0] - 2 * s.c1[0] + s.p0[0]) + t * (s.p3[0] - 2 * s.c2[0] + s.c1[0])), y2 = 6 * (u * (s.c2[1] - 2 * s.c1[1] + s.p0[1]) + t * (s.p3[1] - 2 * s.c2[1] + s.c1[1])); best = Math.abs(x1 * y2 - y1 * x2) / Math.pow(x1 * x1 + y1 * y1, 1.5); } } }
      return { k: best, off: bd }; };
    let fins = 0, worst = 0, capped = 0, far = 0;
    for (const d of [v.comb0, v.comb1, v.comb2]) for (const q of (d.match(/M[^Z]+Z/g) || [])) { const p = q.slice(1, -1).split('L').map(nums), base = p[0], tip = p[3], h = Math.hypot(tip[0] - base[0], tip[1] - base[1]), c = curvAt(base);
      if (c.off > 0.6) { far++; continue; } // a base point that is not on the drawn outline would be a failure of its own
      fins++; if (h >= cap * 0.999) { capped++; continue; }
      const want = c.k * K; worst = Math.max(worst, Math.abs(h - want) / want); }
    out.push([mode.padEnd(8), 'combScale', scale, '| fins checked', fins, '| capped', capped, '| base points off the outline', far, '| worst height error', (worst * 100).toFixed(3) + '%'].join(' '));
    worstAll = Math.max(worstAll, worst); farAll += far
  }
  // the spec's Measured row: comb height against curvature within 0.06 percent
  return { out, pass: worstAll <= 0.0006 && farAll === 0, nums: { worst: worstAll, far: farAll } }
}
