/* Guides shared by System and the Tuner: grids, their score, the 24-unit keylines.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

import { r2 } from './util.js'

// ---------- grids: guides a form may sit on ----------
var GRIDS = { square: [0, 90], diagonal: [45, 135], isometric: [30, 90, 150], hexagonal: [30, 90, 150] };
function grid(kind, step, turn) { // lines `step` apart, centered on the board, out to its corners
  var dirs = GRIDS[kind], d = '', R = 760, i, j;
  if (!dirs || !(step > 2)) return '';
  if (kind === 'hexagonal') { // cells whose corners sit on the isometric grid's crossings
    var s = step / Math.sin(Math.PI / 3) , tr = (turn || 0) * Math.PI / 180, ct = Math.cos(tr), st = Math.sin(tr), w = s * Math.sqrt(3), rows = Math.ceil(R / (1.5 * s)) + 1, cols = Math.ceil(R / w) + 1;
    var P = function (x, y) { return r2(x * ct - y * st) + ' ' + r2(x * st + y * ct); };
    for (j = -rows; j <= rows; j++) for (i = -cols; i <= cols; i++) {
      var cx = i * w + (j & 1 ? w / 2 : 0), cy = j * 1.5 * s;
      d += 'M' + P(cx - w / 2, cy - s / 2) + 'L' + P(cx, cy - s) + 'L' + P(cx + w / 2, cy - s / 2) + 'L' + P(cx + w / 2, cy + s / 2); // three sides per cell: every edge is drawn once
    }
    return d;
  }
  dirs.forEach(function (deg) {
    var a = (deg + (turn || 0)) * Math.PI / 180, cx = Math.cos(a), sy = Math.sin(a), n = Math.ceil(R / step);
    for (i = -n; i <= n; i++) { var ox = -sy * i * step, oy = cx * i * step; d += 'M' + r2(ox - cx * R) + ' ' + r2(oy - sy * R) + 'L' + r2(ox + cx * R) + ' ' + r2(oy + sy * R); }
  });
  return d;
}
function gridScore(edges, corners, kind, step, size, turn) { // how much of a form sits on a grid at a given turn: its straight edges along the grid's directions, its corners on the crossings
  var dirs = GRIDS[kind], total = 0, on = 0, best = { edges: 0, turn: +turn || 0, corners: 0 }, i;
  if (!dirs) return best;
  edges.forEach(function (e) {
    total += e.len;
    for (i = 0; i < dirs.length; i++) { var df = Math.abs((((e.deg - dirs[i] - best.turn) % 180) + 270) % 180 - 90); if (df <= 2) { on += e.len; break; } }
  });
  best.edges = total ? on / total : 0;
  if (corners.length && step > 0) { // crossings: where two of the grid's lines meet
    var hit = 0, tol = 0.01 * size;
    corners.forEach(function (c) {
      var ds = dirs.map(function (deg) { var a = (deg + best.turn) * Math.PI / 180, off = -Math.sin(a) * c[0] + Math.cos(a) * c[1]; return Math.abs(off - Math.round(off / step) * step); }).sort(function (a, b) { return a - b; });
      if (ds[0] <= tol && ds[1] <= tol) hit++;
    });
    best.corners = hit / corners.length;
  }
  return best;
}

// ---------- keylines: the 24-unit keyline grid from kol-component atoms/IconPlate.jsx (KeylineGuide), scaled to a box ----------
// Dashed diagonals in teal; the three keyline rectangles 16x20, 18x18, 20x16 with radius 1 and the center circle r4 in magenta on a light ground, yellow on a dark one.
function keylines(box, ground, ox, oy) { // centered on (ox, oy)
  ox = +ox || 0; oy = +oy || 0;
  var u = box / 24, X = function (v) { return r2((v - 12) * u + ox); }, Y = function (v) { return r2((v - 12) * u + oy); }, rr = r2(u), key = '';
  [[4, 2, 16, 20], [3, 3, 18, 18], [2, 4, 20, 16]].forEach(function (q) {
    var x0 = q[0], y0 = q[1], x1 = q[0] + q[2], y1 = q[1] + q[3];
    key += 'M' + X(x0 + 1) + ' ' + Y(y0) + 'L' + X(x1 - 1) + ' ' + Y(y0) + 'A' + rr + ' ' + rr + ' 0 0 1 ' + X(x1) + ' ' + Y(y0 + 1) + 'L' + X(x1) + ' ' + Y(y1 - 1) + 'A' + rr + ' ' + rr + ' 0 0 1 ' + X(x1 - 1) + ' ' + Y(y1) +
      'L' + X(x0 + 1) + ' ' + Y(y1) + 'A' + rr + ' ' + rr + ' 0 0 1 ' + X(x0) + ' ' + Y(y1 - 1) + 'L' + X(x0) + ' ' + Y(y0 + 1) + 'A' + rr + ' ' + rr + ' 0 0 1 ' + X(x0 + 1) + ' ' + Y(y0) + 'Z';
  });
  var c4 = r2(4 * u); key += 'M' + X(8) + ' ' + Y(12) + 'A' + c4 + ' ' + c4 + ' 0 1 0 ' + X(16) + ' ' + Y(12) + 'A' + c4 + ' ' + c4 + ' 0 1 0 ' + X(8) + ' ' + Y(12);
  var g = String(ground || '#f4f4f4').replace('#', ''), lum = g.length === 6 ? (parseInt(g.slice(0, 2), 16) * 0.299 + parseInt(g.slice(2, 4), 16) * 0.587 + parseInt(g.slice(4, 6), 16) * 0.114) : 255;
  return { key: key, diag: 'M' + X(0) + ' ' + Y(0) + 'L' + X(24) + ' ' + Y(24) + 'M' + X(24) + ' ' + Y(0) + 'L' + X(0) + ' ' + Y(24),
    light: lum > 128, width: r2(0.1 * u) + 'px', dash: r2(0.4 * u) + ' ' + r2(0.6 * u) };
}
export { GRIDS, grid, gridScore, keylines }
