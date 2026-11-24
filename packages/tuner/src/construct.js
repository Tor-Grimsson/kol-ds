/* Construct: shapes on a harmonic grid, and the recipe language System writes in.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

import { numOf, hash, TAU, r2 } from './util.js'
import { HARMONY, divisions } from './harmonies.js'

// A number in a recipe: digits, + - * / and brackets, plus phi, t (the harmony's own cut) and d0, d1 … (its divisions).
function recipeNum(src, env) {
  var str = String(src).replace(/phi/g, '1.6180339887').replace(/d(\d+)/g, function (m0, k) { return env.d[+k] !== undefined ? String(env.d[+k]) : '0'; }).replace(/t/g, String(env.t)).replace(/\s+/g, ''), i = 0;
  var num0 = function () {
    if (str[i] === '(') { i++; var v = sum(); if (str[i] === ')') i++; return v; }
    if (str[i] === '-') { i++; return -num0(); }
    var st = i; while (i < str.length && /[0-9.]/.test(str[i])) i++;
    return st === i ? NaN : parseFloat(str.slice(st, i));
  };
  var prod = function () { var v = num0(); while (str[i] === '*' || str[i] === '/') { var op = str[i++], w = num0(); v = op === '*' ? v * w : v / w; } return v; };
  var sum = function () { var v = prod(); while (str[i] === '+' || str[i] === '-') { var op = str[i++], w = prod(); v = op === '+' ? v + w : v - w; } return v; };
  var out = sum(); return i < str.length ? NaN : out;
}
function construct(props, pos) {
  var p = props || {}, num = numOf(p), clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var hname = HARMONY[p.harmony] ? p.harmony : 'golden', H0 = HARMONY[hname], D = divisions(hname), L = D.length;
  var F = 480 * clamp(num('size', 1), 0.4, 1.4), short = H0.r ? H0.r[0] / H0.r[1] : 2 / 3;
  var W = p.frame === 'tall' ? F * short : F, HT = p.frame === 'wide' ? F * short : F, base = Math.min(W, HT);
  var xs = D.map(function (q) { return -W / 2 + W * q.d; }), ys = D.map(function (q) { return -HT / 2 + HT * q.d; });
  var n = clamp(Math.round(num('shapes', 3)), 1, 6), seed = Math.round(num('seed', 1)), fam = p.family || 'mixed', sl = Math.tan(clamp(num('slant', 20), -60, 60) * Math.PI / 180);
  var comb = p.combine || 'exclude', clip = !(p.clip === false || p.clip === 'false');
  var gaps = [], i, j;
  for (i = 0; i < L; i++) for (j = i + 1; j < L; j++) gaps.push(D[j].d - D[i].d);
  gaps.sort(function (a, b) { return a - b; });
  gaps = gaps.filter(function (g, k) { return !k || g - gaps[k - 1] > 0.004; });
  var shapes = [], anchors = [], recipe = typeof p.recipe === 'string' ? p.recipe.trim() : '', written = false, extraG = '', extraL = [], extraD = '', wedges = '', ownSteps = false;
  if (recipe) { // shapes written by hand, in shares of the frame from its top left. Each starts with + (add), - (cut) or x (flip), read in order.
    var env = { t: H0.r ? H0.r[0] / (H0.r[0] + H0.r[1]) : 0.5, d: D.map(function (q) { return q.d; }) };
    recipe.split(/[;\n]+/).forEach(function (line) {
      var tk = line.trim().split(/\s+/); if (!tk[0]) return;
      var op = /^[+\-x]$/.test(tk[0]) ? tk.shift() : 'x', kd = tk.shift();
      if (kd === 'label' && tk.length >= 3) { // a name placed by hand: label x y text
        var lx = recipeNum(tk[0], env), ly = recipeNum(tk[1], env);
        if (!isNaN(lx) && !isNaN(ly)) extraL.push({ x: r2(-W / 2 + W * lx), y: r2(-HT / 2 + HT * ly), t: tk.slice(2).join(' ') });
        return;
      }
      var a = (kd === 'steps' ? tk.slice(0, 4) : tk).map(function (q) { return recipeNum(q, env); });
      if (a.some(function (q) { return isNaN(q); })) return;
      var X = function (v) { return -W / 2 + W * v; }, Y = function (v) { return -HT / 2 + HT * v; };
      if (kd === 'circle' && a.length >= 3) shapes.push({ kind: 'circle', op: op, cx: X(a[0]), cy: Y(a[1]), r: base * a[2] });
      else if (kd === 'crescent' && a.length >= 6) shapes.push({ kind: 'crescent', op: op, cx: X(a[0]), cy: Y(a[1]), r: base * a[2], cx2: X(a[3]), cy2: Y(a[4]), r2: base * a[5] });
      else if (kd === 'band' && a.length >= 4) shapes.push({ kind: 'band', op: op, cx: X(a[0]), cy: Y(a[1]), r: base * a[2], th: Math.min(base * a[2], base * a[3]) });
      else if (kd === 'steps' && a.length >= 4) { // equal steps down a bracket, each one named: steps x y0 y1 n text
        var sx = X(a[0]), sn = Math.max(1, Math.min(24, Math.round(a[3]))), sy0 = Y(a[1]), sy1 = Y(a[2]), st = tk.slice(4).join(' ') || 'x', qs;
        ownSteps = true; extraD += 'M' + r2(sx) + ' ' + r2(sy0) + 'L' + r2(sx) + ' ' + r2(sy1);
        var sd = sx > 0 ? -1 : 1;
        for (qs = 0; qs <= sn; qs++) extraD += 'M' + r2(sx) + ' ' + r2(sy0 + (sy1 - sy0) * qs / sn) + 'L' + r2(sx + 9 * sd) + ' ' + r2(sy0 + (sy1 - sy0) * qs / sn);
        for (qs = 0; qs < sn; qs++) extraL.push({ x: r2(sd > 0 ? sx - 10 - st.length * 7.8 : sx + 10), y: r2(sy0 + (sy1 - sy0) * (qs + 0.5) / sn + 5), t: st });
      }
      else if (kd === 'ring' && a.length >= 3) { var rg = base * a[2], sg0 = Math.min(480, Math.max(72, Math.ceil(rg / 3))), kr; for (kr = 0; kr <= sg0; kr++) extraG += (kr ? 'L' : 'M') + r2(X(a[0]) + rg * Math.cos(TAU * kr / sg0)) + ' ' + r2(Y(a[1]) + rg * Math.sin(TAU * kr / sg0)); }
      else if (kd === 'line' && a.length >= 4) extraG += 'M' + r2(X(a[0])) + ' ' + r2(Y(a[1])) + 'L' + r2(X(a[2])) + ' ' + r2(Y(a[3]));
      else if (kd === 'angle' && a.length >= 3) { // a ray from a point, its level reference, the arc between them and the degrees. Negative runs downward.
        var ax = X(a[0]), ay = Y(a[1]), ar = a[2] * Math.PI / 180, rf = (a[3] || 0) * Math.PI / 180, sweep = ((((a[2] - (a[3] || 0)) % 360) + 540) % 360 - 180) * (a[3] ? -1 : 1), dx = Math.cos(ar), dy = -Math.sin(ar), far = 4000, k2;
        if (dx > 1e-6) far = Math.min(far, (W / 2 - ax) / dx); else if (dx < -1e-6) far = Math.min(far, (-W / 2 - ax) / dx);
        if (dy > 1e-6) far = Math.min(far, (HT / 2 - ay) / dy); else if (dy < -1e-6) far = Math.min(far, (-HT / 2 - ay) / dy);
        far = Math.max(40, far);
        extraG += 'M' + r2(ax) + ' ' + r2(ay) + 'L' + r2(ax + dx * far) + ' ' + r2(ay + dy * far) + 'M' + r2(ax) + ' ' + r2(ay) + 'L' + r2(ax + 60 * Math.cos(rf)) + ' ' + r2(ay - 60 * Math.sin(rf));
        for (k2 = 0; k2 <= 12; k2++) { var aa = rf + (ar - rf) * k2 / 12; extraG += (k2 ? 'L' : 'M') + r2(ax + 26 * Math.cos(aa)) + ' ' + r2(ay - 26 * Math.sin(aa)); }
        wedges += 'M' + r2(ax) + ' ' + r2(ay); for (k2 = 0; k2 <= 12; k2++) { var ab = rf + (ar - rf) * k2 / 12; wedges += 'L' + r2(ax + 26 * Math.cos(ab)) + ' ' + r2(ay - 26 * Math.sin(ab)); } wedges += 'Z';
        var am = (ar + rf) / 2, at = (Math.round(sweep * 10) / 10) + '\u00b0';
        extraL.push({ x: r2(ax + 34 * Math.cos(am) + (Math.cos(am) < 0 ? -at.length * 7.8 : 4)), y: r2(ay - 34 * Math.sin(am) + 4), t: at });
      }
      else if ((kd === 'bar' || kd === 'slant') && a.length >= 4) shapes.push({ kind: kd, op: op, cx: X(a[0]), cy: Y(a[1]), x0: X(Math.min(a[0], a[2])), x1: X(Math.max(a[0], a[2])), y0: Y(Math.min(a[1], a[3])), y1: Y(Math.max(a[1], a[3])), sl: kd === 'slant' ? Math.tan((a[4] || 0) * Math.PI / 180) : 0 });
    });
    written = shapes.length > 0;
  }
  for (i = 0; i < n && !written; i++) {
    var h = (function (i2) { return function (k) { return hash(i2 + 1, k, seed); }; })(i);
    var kind = fam === 'circles' ? 'circle' : fam === 'bands' ? 'band' : fam === 'bars' ? (h(1) > 0.5 ? 'bar' : 'slant') : ['circle', 'band', 'bar', 'slant', 'band', 'circle'][Math.floor(h(1) * 6) % 6];
    var ix = Math.floor(h(2) * L) % L, iy = Math.floor(h(3) * L) % L;
    if (pos && pos[i]) { ix = clamp(pos[i][0], 0, L - 1); iy = clamp(pos[i][1], 0, L - 1); }
    var cx = xs[ix], cy = ys[iy], sh = { kind: kind, cx: cx, cy: cy };
    if (kind === 'circle') sh.r = base * gaps[Math.floor(h(4) * gaps.length) % gaps.length];
    else if (kind === 'band') { // a ring: the outer radius from the larger gaps, its width from the smaller ones
      sh.r = base * gaps[Math.floor(gaps.length / 2 + h(4) * gaps.length / 2) % gaps.length];
      sh.th = Math.min(sh.r * 0.8, base * gaps[Math.floor(h(5) * Math.min(3, gaps.length))]);
    } else { // a bar between two division lines one way and two the other; slant leans it
      var ix2 = (ix + 1 + Math.floor(h(6) * (L - 1))) % L, iy2 = (iy + 1 + Math.floor(h(7) * (L - 1))) % L;
      sh.x0 = Math.min(xs[ix], xs[ix2]); sh.x1 = Math.max(xs[ix], xs[ix2]); sh.y0 = Math.min(ys[iy], ys[iy2]); sh.y1 = Math.max(ys[iy], ys[iy2]);
      sh.sl = kind === 'slant' ? sl : 0;
    }
    shapes.push(sh); anchors.push([cx, cy]);
  }
  // where each shape is ink along one horizontal line
  var spans = function (sh, y) {
    if (sh.kind === 'crescent') {
      var da = y - sh.cy, db = y - sh.cy2, inA = Math.abs(da) < sh.r, inB = Math.abs(db) < sh.r2;
      if (!inA && !inB) return [];
      if (!inA) { var wo2 = Math.sqrt(sh.r2 * sh.r2 - db * db); return [[sh.cx2 - wo2, sh.cx2 + wo2]]; }
      var wa = Math.sqrt(sh.r * sh.r - da * da), A0 = sh.cx - wa, A1 = sh.cx + wa;
      if (!inB) return [[A0, A1]];
      var wb = Math.sqrt(sh.r2 * sh.r2 - db * db), ps = [A0, A1, sh.cx2 - wb, sh.cx2 + wb].sort(function (q1, q2) { return q1 - q2; });
      return [[ps[0], ps[1]], [ps[2], ps[3]]].filter(function (q) { return q[1] - q[0] > 0.01; }); // inside one circle and not the other
    }
    if (sh.kind === 'circle' || sh.kind === 'band') {
      var dy = y - sh.cy; if (Math.abs(dy) >= sh.r) return [];
      var wo = Math.sqrt(sh.r * sh.r - dy * dy);
      if (sh.kind === 'circle') return [[sh.cx - wo, sh.cx + wo]];
      var ri = sh.r - sh.th; if (Math.abs(dy) >= ri) return [[sh.cx - wo, sh.cx + wo]];
      var wi = Math.sqrt(ri * ri - dy * dy); return [[sh.cx - wo, sh.cx - wi], [sh.cx + wi, sh.cx + wo]];
    }
    if (y < sh.y0 || y > sh.y1) return [];
    var lean = sh.sl * ((sh.y0 + sh.y1) / 2 - y); return [[sh.x0 + lean, sh.x1 + lean]];
  };
  var rowAt = function (y) { // the overlap rule, applied along one line
    var all = [], cuts = [], k, m;
    for (k = 0; k < shapes.length; k++) { var sp = spans(shapes[k], y); all.push(sp); for (m = 0; m < sp.length; m++) { cuts.push(sp[m][0]); cuts.push(sp[m][1]); } }
    cuts.sort(function (a, b) { return a - b; });
    var out = [];
    for (k = 0; k < cuts.length - 1; k++) {
      if (cuts[k + 1] - cuts[k] < 0.01) continue;
      var mid = (cuts[k] + cuts[k + 1]) / 2, cnt = 0, odd = false, even = false, state = false;
      for (m = 0; m < all.length; m++) for (var q = 0; q < all[m].length; q++) if (mid > all[m][q][0] && mid < all[m][q][1]) {
        cnt++; if (m % 2) even = true; else odd = true;
        state = shapes[m].op === '+' ? true : shapes[m].op === '-' ? false : !state; break;
      }
      var on = written ? state : comb === 'union' ? cnt > 0 : comb === 'overlap' ? cnt >= 2 : comb === 'subtract' ? odd && !even : cnt % 2 === 1;
      if (!on) continue;
      var lo = cuts[k], hi = cuts[k + 1];
      if (clip) { lo = Math.max(lo, -W / 2); hi = Math.min(hi, W / 2); if (hi - lo < 0.01) continue; }
      if (out.length && Math.abs(out[out.length - 1][1] - lo) < 0.011) out[out.length - 1][1] = hi; else out.push([lo, hi]);
    }
    return out;
  };
  // the mark: thin slices, each a quad from the line above to the line below, so curved edges stay smooth
  var d = '', y0 = clip ? -HT / 2 : -380, y1 = clip ? HT / 2 : 380, STEP = 2, y, prev, ev = [y0, y1], e;
  shapes.forEach(function (sh) {
    if (sh.kind === 'crescent') ev.push(sh.cy - sh.r, sh.cy + sh.r, sh.cy2 - sh.r2, sh.cy2 + sh.r2);
    else if (sh.kind === 'circle' || sh.kind === 'band') { ev.push(sh.cy - sh.r, sh.cy + sh.r); if (sh.kind === 'band') ev.push(sh.cy - sh.r + sh.th, sh.cy + sh.r - sh.th); }
    else ev.push(sh.y0, sh.y1);
  });
  ev = ev.filter(function (v) { return v >= y0 && v <= y1; }).sort(function (a, b) { return a - b; });
  for (e = 0; e < ev.length - 1; e++) {
    var ya = ev[e], yz = ev[e + 1];
    if (yz - ya < 0.02) continue;
    prev = rowAt(ya + 0.001);
    for (y = ya; y < yz - 0.001; y += STEP) {
      var yb = Math.min(yz, y + STEP), next = rowAt(yb - 0.001), a = prev, b = next;
      if (a.length !== b.length) { a = b = rowAt((y + yb) / 2); }
      for (i = 0; i < a.length; i++) d += 'M' + r2(a[i][0]) + ' ' + r2(y) + 'L' + r2(a[i][1]) + ' ' + r2(y) + 'L' + r2(b[i][1]) + ' ' + r2(yb) + 'L' + r2(b[i][0]) + ' ' + r2(yb) + 'Z';
      prev = next;
    }
  }
  // construction lines: the frame, every division, and each shape's full outline
  var g = '', ex = 26, ring = function (cx, cy, rr) { var o = '', sg = Math.min(480, Math.max(72, Math.ceil(rr / 3))); for (var k = 0; k <= sg; k++) o += (k ? 'L' : 'M') + r2(cx + rr * Math.cos(TAU * k / sg)) + ' ' + r2(cy + rr * Math.sin(TAU * k / sg)); return o; };
  var gd = '';
  for (i = 0; i < L; i++) { gd += 'M' + r2(xs[i]) + ' ' + r2(-HT / 2 - ex) + 'L' + r2(xs[i]) + ' ' + r2(HT / 2 + ex) + 'M' + r2(-W / 2 - ex) + ' ' + r2(ys[i]) + 'L' + r2(W / 2 + ex) + ' ' + r2(ys[i]); }
  g += 'M' + r2(-W / 2) + ' ' + r2(-HT / 2) + 'L' + r2(W / 2) + ' ' + r2(-HT / 2) + 'L' + r2(W / 2) + ' ' + r2(HT / 2) + 'L' + r2(-W / 2) + ' ' + r2(HT / 2) + 'Z'; // the frame itself
  var labels = [];
  for (i = 0; i < shapes.length; i++) {
    var s2 = shapes[i];
    if (s2.kind === 'crescent') { g += ring(s2.cx, s2.cy, s2.r) + ring(s2.cx2, s2.cy2, s2.r2); continue; }
    if (s2.kind === 'circle' || s2.kind === 'band') {
      g += ring(s2.cx, s2.cy, s2.r); if (s2.kind === 'band') g += ring(s2.cx, s2.cy, s2.r - s2.th);
      if (written) continue;
      g += 'M' + r2(s2.cx) + ' ' + r2(s2.cy) + 'L' + r2(s2.cx + s2.r) + ' ' + r2(s2.cy);
      labels.push({ x: r2(s2.cx + 8), y: r2(s2.cy - 8), t: 'r ' + (Math.round(s2.r / base * 1000) / 1000) });
    } else {
      var la = s2.sl * (s2.y1 - s2.y0) / 2 + s2.sl * ex, lb = -la, sh = s2.sl * (s2.y1 - s2.y0) / 2;
      if (written) { // a level bar shows its two long edges; a slanted one its whole outline
        g += 'M' + r2(s2.x0 + sh) + ' ' + r2(s2.y0) + 'L' + r2(s2.x1 + sh) + ' ' + r2(s2.y0) + (s2.sl ? 'L' : 'M') + r2(s2.x1 - sh) + ' ' + r2(s2.y1) + 'L' + r2(s2.x0 - sh) + ' ' + r2(s2.y1) + (s2.sl ? 'Z' : ''); continue; }
      g += 'M' + r2(s2.x0 + la) + ' ' + r2(s2.y0 - ex) + 'L' + r2(s2.x0 + lb) + ' ' + r2(s2.y1 + ex) + 'M' + r2(s2.x1 + la) + ' ' + r2(s2.y0 - ex) + 'L' + r2(s2.x1 + lb) + ' ' + r2(s2.y1 + ex);
      if (s2.sl) labels.push({ x: r2(s2.x1 + 8), y: r2(s2.y1 - 6), t: Math.round(90 - Math.atan(s2.sl) * 180 / Math.PI) + '°' });
    }
  }
  for (i = 0; i < L; i++) labels.push({ x: r2(xs[i] - 8), y: r2(-HT / 2 - ex - 8), t: D[i].t });
  labels.push({ x: r2(-W / 2), y: r2(HT / 2 + ex + 22), t: hname + (H0.r ? ', ' + H0.r[0] + ' : ' + H0.r[1] : '') });
  g += extraG;
  // the math: a bracket on every side of the frame with its measure, and a tick bracket wherever the divisions repeat, each step marked x
  var dm = extraD, dl = extraL.slice(), off = 62, tk = 9, cw = 7.8;
  var say = function (x, y, t, mid) { dl.push({ x: r2(mid ? x - t.length * cw / 2 : x), y: r2(y), t: t }); };
  var ratioT = H0.r ? '1 : ' + (Math.round(H0.r[1] / H0.r[0] * 1000) / 1000) : hname, cutX = -W / 2 + W * (H0.r ? H0.r[1] / (H0.r[0] + H0.r[1]) : 0.5);
  var brH = function (x0, x1, y, dir) { return 'M' + r2(x0) + ' ' + r2(y + dir * tk) + 'L' + r2(x0) + ' ' + r2(y) + 'L' + r2(x1) + ' ' + r2(y) + 'L' + r2(x1) + ' ' + r2(y + dir * tk); };
  var brV = function (y0, y1, x, dir) { return 'M' + r2(x + dir * tk) + ' ' + r2(y0) + 'L' + r2(x) + ' ' + r2(y0) + 'L' + r2(x) + ' ' + r2(y1) + 'L' + r2(x + dir * tk) + ' ' + r2(y1); };
  dm += brH(-W / 2, W / 2, -HT / 2 - off, 1); say(0, -HT / 2 - off - 10, '1', true);
  dm += brH(-W / 2, W / 2, HT / 2 + off, -1) + 'M' + r2(cutX) + ' ' + r2(HT / 2 + off) + 'L' + r2(cutX) + ' ' + r2(HT / 2 + off - tk); say(0, HT / 2 + off + 20, ratioT, true);
  dm += brV(-HT / 2, HT / 2, W / 2 + off, -1); say(W / 2 + off + 12, 4, '1', false);
  dm += brV(-HT / 2, HT / 2, -W / 2 - off, 1); say(-W / 2 - off - 14 - ratioT.length * cw, -HT / 2 + HT * 0.45, ratioT, false);
  for (i = ownSteps ? L : 0; i < L - 1; ) { // runs of equal steps down the left side
    j = i; while (j + 2 < L && Math.abs((D[j + 2].d - D[j + 1].d) - (D[i + 1].d - D[i].d)) < 0.004) j++;
    if (j > i) {
      var bx = -W / 2 - 30;
      dm += 'M' + r2(bx) + ' ' + r2(ys[i]) + 'L' + r2(bx) + ' ' + r2(ys[j + 1]);
      for (var q2 = i; q2 <= j + 1; q2++) dm += 'M' + r2(bx) + ' ' + r2(ys[q2]) + 'L' + r2(bx + tk) + ' ' + r2(ys[q2]);
      for (q2 = i; q2 <= j; q2++) say(bx - 14, (ys[q2] + ys[q2 + 1]) / 2 + 4, 'x', false);
      i = j + 1;
    } else i++;
  }
  return { d: d, guides: g, divs: gd, wedges: wedges, dims: dm, dimLabels: dl, labels: labels, anchors: anchors, grid: { xs: xs, ys: ys }, box: Math.max(W, HT) };
}

function constructSeeds(props) {
  var out = [], p = props || {};
  for (var n = 1; n <= 24; n++) {
    var q = {}; for (var k in p) q[k] = p[k]; q.seed = n;
    var v = construct(q, null);
    out.push({ label: 'seed ' + n, d: v.d, guides: p.construction === true || p.construction === 'true' ? v.divs + v.guides : '', rot: 'translate(240 160) scale(0.52)' });
  }
  return out;
}
export { recipeNum, construct, constructSeeds }
