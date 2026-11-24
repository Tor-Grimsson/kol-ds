/* Tuner: read a form, rebuild its outline from circles and lines, pull the radii onto one ladder.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

import { numOf, ext, TAU } from './util.js'
import { HARMONY, systemGrow } from './harmonies.js'
import { GRIDS, grid, gridScore } from './guides.js'

var seq = 0

// ---------- tuner: read a form, rebuild its outline from circles and lines, then pull the radii onto one ladder ----------
var TN = 512, tunerCache = { key: '', fit: null }, tunerCanvas = null;
function tunerMask(p, img, R) { // 1 where the form is, on an R by R raster. Lengths are written for the 512 working square and scaled by q.
  var m = new Uint8Array(R * R), x, y, i, q = R / TN;
  if (!img && p.sample !== 'letter') { // the built-in form, a crescent and a dot, needs no canvas
    for (y = 0; y < R; y++) for (x = 0; x < R; x++) {
      var wx = (x + 0.5) / q, wy = (y + 0.5) / q;
      var a = (wx - 240) * (wx - 240) + (wy - 270) * (wy - 270) < 183 * 183, b = (wx - 322) * (wx - 322) + (wy - 204) * (wy - 204) < 157 * 157, c = (wx - 358) * (wx - 358) + (wy - 172) * (wy - 172) < 47 * 47;
      m[y * R + x] = (a && !b) || c ? 1 : 0;
    }
    return m;
  }
  try {
    if (!tunerCanvas) tunerCanvas = document.createElement('canvas');
    if (tunerCanvas.width !== R) tunerCanvas.width = tunerCanvas.height = R;
    var c2 = tunerCanvas.getContext('2d', { willReadFrequently: true });
    c2.clearRect(0, 0, R, R);
    var gx = 0, gy = 0;
    if (img) {
      var iw = img.naturalWidth || img.width || 1, ih = img.naturalHeight || img.height || 1, k = Math.min(430 * q / iw, 430 * q / ih);
      c2.drawImage(img, (R - iw * k) / 2, (R - ih * k) / 2, iw * k, ih * k);
      gx = Math.ceil((R - iw * k) / 2) + 1; gy = Math.ceil((R - ih * k) / 2) + 1; // the image's own corner, not the empty canvas around it
    } else {
      var ch = (p.letter ? String(p.letter) : 'S').slice(0, 2), fam = (p.letterFont ? String(p.letterFont) + ', ' : '') + 'Helvetica, Arial, sans-serif', fs = 400 * q, mt;
      c2.fillStyle = '#000'; c2.textAlign = 'left'; c2.textBaseline = 'alphabetic';
      c2.font = '900 ' + fs + 'px ' + fam; mt = c2.measureText(ch);
      fs = fs * Math.min(410 * q / Math.max(1, mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent), 410 * q / Math.max(1, mt.actualBoundingBoxRight + mt.actualBoundingBoxLeft));
      c2.font = '900 ' + fs + 'px ' + fam; mt = c2.measureText(ch);
      c2.fillText(ch, R / 2 - (mt.actualBoundingBoxRight - mt.actualBoundingBoxLeft) / 2, R / 2 + (mt.actualBoundingBoxAscent - mt.actualBoundingBoxDescent) / 2);
    }
    var px = c2.getImageData(0, 0, R, R).data, bi = (gy * R + gx) * 4, b0 = px[bi], b1 = px[bi + 1], b2 = px[bi + 2], b3 = px[bi + 3]; // the corner is the ground; the form is whatever differs from it
    for (i = 0; i < R * R; i++) m[i] = (!img || (i % R >= gx && i % R < R - gx && i >= gy * R && i < (R - gy) * R)) && Math.abs(px[i * 4] - b0) + Math.abs(px[i * 4 + 1] - b1) + Math.abs(px[i * 4 + 2] - b2) + Math.abs(px[i * 4 + 3] - b3) > 190 ? 1 : 0;
    if (img) {
      var bx0 = R, bx1 = 0, by0 = R, by1 = 0;
      for (i = 0; i < R * R; i++) if (m[i]) { var qx = i % R, qy = (i - qx) / R; if (qx < bx0) bx0 = qx; if (qx > bx1) bx1 = qx; if (qy < by0) by0 = qy; if (qy > by1) by1 = qy; }
      var grow = bx1 > bx0 && by1 > by0 ? 430 * q / Math.max(bx1 - bx0 + 1, by1 - by0 + 1) : 1;
      if (grow > 1.15) { // draw it again, larger, with the form's own bounds centered
        var k2 = k * grow, ox = R / 2 - ((bx0 + bx1) / 2 - (R - iw * k) / 2) * grow, oy = R / 2 - ((by0 + by1) / 2 - (R - ih * k) / 2) * grow;
        c2.clearRect(0, 0, R, R); c2.fillStyle = 'rgba(' + b0 + ',' + b1 + ',' + b2 + ',' + (b3 / 255) + ')'; c2.fillRect(0, 0, R, R);
        c2.drawImage(img, ox, oy, iw * k2, ih * k2);
        px = c2.getImageData(0, 0, R, R).data;
        for (i = 0; i < R * R; i++) m[i] = Math.abs(px[i * 4] - b0) + Math.abs(px[i * 4 + 1] - b1) + Math.abs(px[i * 4 + 2] - b2) + Math.abs(px[i * 4 + 3] - b3) > 190 ? 1 : 0;
      }
    }
    for (i = 0; i < R; i++) m[i] = m[(R - 1) * R + i] = m[i * R] = m[i * R + R - 1] = 0;
  } catch (e) {}
  return m;
}
function tunerTrace(m, R) { // closed outlines traced on the raster, smoothed just enough to lose the pixel stairs, handed back in working-square units
  var sc = R / TN, V = R + 1, nx1 = new Int32Array(V * V).fill(-1), nx2 = new Int32Array(V * V).fill(-1), x, y, s, loops = [];
  var add = function (a, b) { if (nx1[a] < 0) nx1[a] = b; else nx2[a] = b; };
  var at = function (xx, yy) { return xx >= 0 && yy >= 0 && xx < R && yy < R && m[yy * R + xx]; };
  for (y = 0; y < R; y++) for (x = 0; x < R; x++) if (m[y * R + x]) {
    if (!at(x, y - 1)) add(y * V + x, y * V + x + 1);
    if (!at(x + 1, y)) add(y * V + x + 1, (y + 1) * V + x + 1);
    if (!at(x, y + 1)) add((y + 1) * V + x + 1, (y + 1) * V + x);
    if (!at(x - 1, y)) add((y + 1) * V + x, y * V + x);
  }
  for (s = 0; s < V * V; s++) while (nx1[s] >= 0) {
    var raw = [], cur = s, guard = 0;
    do { var nx = nx1[cur]; if (nx < 0) break; nx1[cur] = nx2[cur]; nx2[cur] = -1; raw.push([cur % V, Math.floor(cur / V)]); cur = nx; } while (cur !== s && ++guard < 4000000);
    var n = raw.length; if (n < 16 * sc) continue;
    var mid = [], i, j;
    for (i = 0; i < n; i++) mid.push([(raw[i][0] + raw[(i + 1) % n][0]) / 2, (raw[i][1] + raw[(i + 1) % n][1]) / 2]);
    var sm = [], hw = Math.max(2, Math.round(2 * sc)), stepN = Math.max(1, Math.floor(sc / 2)), wsum = (hw + 1) * (hw + 1); // a tent 2 working units to each side, whatever the raster
    for (i = 0; i < n; i += stepN) { var sx = 0, sy = 0; for (j = -hw; j <= hw; j++) { var q = mid[(i + j + n) % n], wq = hw + 1 - Math.abs(j); sx += q[0] * wq; sy += q[1] * wq; } sm.push([sx / wsum / sc, sy / wsum / sc]); }
    var rs = tunerResample(sm);
    if (!rs) continue;
    loops.push(rs);
  }
  return loops;
}
function tunerResample(sm) { // a closed outline at an even step of 2.5 working units, with its signed area
  var n = sm.length, len = 0, cum = [0], i;
  for (i = 0; i < n; i++) { var a2 = sm[i], b2 = sm[(i + 1) % n]; len += Math.sqrt((b2[0] - a2[0]) * (b2[0] - a2[0]) + (b2[1] - a2[1]) * (b2[1] - a2[1])); cum.push(len); }
  var cnt = Math.max(16, Math.round(len / 2.5)), pts = [], seg = 0, area = 0;
  for (i = 0; i < cnt; i++) {
    var want = len * i / cnt; while (seg < n - 1 && cum[seg + 1] < want) seg++;
    var t = (want - cum[seg]) / Math.max(1e-9, cum[seg + 1] - cum[seg]), p0 = sm[seg], p1 = sm[(seg + 1) % n];
    pts.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]);
  }
  for (i = 0; i < cnt; i++) area += pts[i][0] * pts[(i + 1) % cnt][1] - pts[(i + 1) % cnt][0] * pts[i][1];
  return Math.abs(area / 2) < 40 ? null : { pts: pts, area: area / 2 };
}
// An SVG's own outlines, read from its shapes instead of from pixels: every filled path, circle, ellipse, rect and polygon, sampled along its true curve.
function tunerVectors(text) {
  var host = null;
  try {
    var doc = new DOMParser().parseFromString(String(text), 'image/svg+xml'), root = doc.documentElement;
    if (!root || String(root.nodeName).toLowerCase() !== 'svg') return null;
    [].slice.call(root.querySelectorAll('script, foreignObject, image, a, iframe, object, embed, audio, video, animate, set')).forEach(function (nd) { nd.parentNode.removeChild(nd); });
    [].slice.call(root.querySelectorAll('*')).concat([root]).forEach(function (nd) { // nothing in the file may run or load anything
      [].slice.call(nd.attributes).forEach(function (at) { if (/^on/i.test(at.name) || (/href$/i.test(at.name) && !/^#/.test(at.value))) nd.removeAttribute(at.name); });
    });
    host = document.importNode(root, true);
    if (!host.getAttribute('width') || /%/.test(host.getAttribute('width'))) host.setAttribute('width', '1000');
    if (!host.getAttribute('height') || /%/.test(host.getAttribute('height'))) host.setAttribute('height', '1000');
    host.setAttribute('style', 'position:absolute;left:-99999px;top:0;pointer-events:none');
    document.body.appendChild(host);
    var bb = host.getBBox(), step = Math.max(bb.width, bb.height) * 0.0005, out = [], first = true;
    if (!(step > 0)) return null;
    [].slice.call(host.querySelectorAll('path, circle, ellipse, rect, polygon')).forEach(function (el) {
      if (el.closest('defs, clipPath, mask, symbol, pattern, marker')) return;
      var cs = window.getComputedStyle(el); if (cs.fill === 'none' || cs.display === 'none') return;
      var mt = el.getCTM(); if (!mt) return;
      if (cs.fillOpacity === '0' || cs.opacity === '0') return;
      if (first) { first = false; var eb = el.getBBox(); if (eb.width * eb.height >= bb.width * bb.height * 0.98 && el.nodeName.toLowerCase() === 'rect') return; }
      var isPath = el.nodeName.toLowerCase() === 'path', subs = isPath ? String(el.getAttribute('d') || '').split(/(?=[Mm])/).filter(function (q) { return q.trim(); }) : [null];
      var probe = isPath ? el.cloneNode(false) : el, acc = '', prev = 0, ls = step / (Math.sqrt(Math.abs(mt.a * mt.d - mt.b * mt.c)) || 1); // the step in the shape's own units, before its transform
      if (isPath) el.parentNode.insertBefore(probe, el);
      subs.forEach(function (sub) {
        if (sub !== null) { acc += sub; probe.setAttribute('d', acc); }
        var len = probe.getTotalLength(), span = len - prev;
        if (span > ls * 8) {
          var cnt = Math.max(24, Math.min(8000, Math.ceil(span / ls))), pts = [], i;
          for (i = 0; i < cnt; i++) { var pt = probe.getPointAtLength(prev + span * i / cnt); pts.push([pt.x * mt.a + pt.y * mt.c + mt.e, pt.x * mt.b + pt.y * mt.d + mt.f]); }
          out.push(pts);
        }
        prev = len;
      });
      if (isPath) probe.parentNode.removeChild(probe);
    });
    return out.length ? out : null;
  } catch (e) { tunerVectors.error = String(e); return null; }
  finally { if (host && host.parentNode) host.parentNode.removeChild(host); }
}
function tunerCorners(pts, thr, open) { // places where the outline turns sharply; on an open run the ends are not corners
  var n = pts.length, k = 4, turn = new Float32Array(n), out = [], i, j;
  for (i = open ? k : 0; i < (open ? n - k : n); i++) {
    var a = pts[(i - k + n) % n], b = pts[i], c = pts[(i + k) % n], ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
    turn[i] = Math.abs(Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)) * 180 / Math.PI;
  }
  for (i = 0; i < n; i++) {
    if (turn[i] < thr) continue;
    var top = true; for (j = -k; j <= k; j++) { var q = turn[(i + j + n) % n]; if (q > turn[i] || (q === turn[i] && j < 0)) { top = false; break; } }
    if (top) out.push(i);
  }
  return out;
}
function tunerFitRange(pts, i, j) { // the circle, or the line, that best follows points i to j
  var n = pts.length, o = pts[i % n], Sx = 0, Sy = 0, Sxx = 0, Syy = 0, Sxy = 0, Sxz = 0, Syz = 0, Sz = 0, c = j - i + 1, q, x, y, z;
  for (q = i; q <= j; q++) { x = pts[q % n][0] - o[0]; y = pts[q % n][1] - o[1]; z = x * x + y * y; Sx += x; Sy += y; Sxx += x * x; Syy += y * y; Sxy += x * y; Sxz += x * z; Syz += y * z; Sz += z; }
  var det = Sxx * (Syy * c - Sy * Sy) - Sxy * (Sxy * c - Sy * Sx) + Sx * (Sxy * Sy - Syy * Sx), e = pts[j % n], lx = e[0] - o[0], ly = e[1] - o[1], ll = Math.sqrt(lx * lx + ly * ly) || 1, lineErr = 0, err = 0;
  for (q = i; q <= j; q++) { x = pts[q % n][0] - o[0]; y = pts[q % n][1] - o[1]; lineErr = Math.max(lineErr, Math.abs(x * ly - y * lx) / ll); }
  var res = { i0: i, i1: j, line: true, err: lineErr, cx: 0, cy: 0, r: 0, ang: 0, lineErr: lineErr };
  if (Math.abs(det) < 1e-7 * (1 + Sxx * Syy * c)) return res;
  var D = (-Sxz * (Syy * c - Sy * Sy) - Sxy * (-Syz * c + Sy * Sz) + Sx * (-Syz * Sy + Syy * Sz)) / det;
  var E = (Sxx * (-Syz * c + Sy * Sz) + Sxz * (Sxy * c - Sy * Sx) + Sx * (-Sxy * Sz + Syz * Sx)) / det;
  var F = (Sxx * (-Syy * Sz + Syz * Sy) - Sxy * (-Sxy * Sz + Syz * Sx) - Sxz * (Sxy * Sy - Syy * Sx)) / det;
  var cx = -D / 2, cy = -E / 2, rr = cx * cx + cy * cy - F;
  if (!(rr > 0)) return res;
  var r = Math.sqrt(rr), ang = 0, pa = null;
  if (!isFinite(r) || r > 3000) return res;
  for (q = i; q <= j; q++) {
    x = pts[q % n][0] - o[0] - cx; y = pts[q % n][1] - o[1] - cy; err = Math.max(err, Math.abs(Math.sqrt(x * x + y * y) - r));
    if (pa) ang += Math.atan2(pa[0] * y - pa[1] * x, pa[0] * x + pa[1] * y);
    pa = [x, y];
  }
  res.arcErr = err;
  if (lineErr <= err * 1.05 + 0.15) return res; // a line says it as well: keep the line
  return { i0: i, i1: j, line: false, err: err, cx: cx + o[0], cy: cy + o[1], r: r, ang: ang, lineErr: lineErr };
}
function tunerFitLoop(pts, corners, tol, open) { // greedy: each piece runs as far as it can inside the tolerance, and never across a corner
  var n = pts.length, chains = [], segs = [], c, i, j;
  if (open) { var bd = [0].concat(corners).concat([n - 1]); for (c = 0; c < bd.length - 1; c++) if (bd[c + 1] > bd[c]) chains.push([bd[c], bd[c + 1]]); }
  else if (!corners.length) chains.push([0, n]);
  else for (c = 0; c < corners.length; c++) chains.push([corners[c], c + 1 < corners.length ? corners[c + 1] : corners[0] + n]);
  chains.forEach(function (ch) {
    var own = []; i = ch[0];
    while (i < ch[1]) {
      j = Math.min(ch[1], i + 2); var best = tunerFitRange(pts, i, j), jj, miss = 0;
      for (jj = j + 1; jj <= ch[1]; jj++) { var f = tunerFitRange(pts, i, jj); if (!f.line && Math.abs(f.ang) > 3.8) break; if (f.err > tol) { if (++miss > 3) break; continue; } miss = 0; best = f; } // no piece turns more than about 220 degrees, so a whole circle is at least two
      own.push(best); i = best.i1;
    }
    for (var again = true; again && own.length > 1;) { // a stub of a few points is not a shape of its own: fold it into the piece beside it
      again = false;
      for (var q = 0; q < own.length; q++) if (own[q].i1 - own[q].i0 < 7) {
        var into = q > 0 ? q - 1 : 1, lo = Math.min(own[q].i0, own[into].i0), hi = Math.max(own[q].i1, own[into].i1);
        own.splice(Math.min(q, into), 2, tunerFitRange(pts, lo, hi)); again = true; break;
      }
    }
    for (var q5 = 1; q5 < own.length - 1; q5++) {
      var ln = own[q5], pa = own[q5 - 1], pb = own[q5 + 1];
      if (!ln.line || pa.line || pb.line || ln.i1 - ln.i0 >= 0.25 * (pa.i1 - pa.i0 + pb.i1 - pb.i0)) continue;
      var mid5 = Math.floor((ln.i0 + ln.i1) / 2), fa = tunerFitRange(pts, pa.i0, mid5), fb = tunerFitRange(pts, mid5, pb.i1);
      if (!fa.line && !fb.line && fa.err <= tol * 2 && fb.err <= tol * 2) { own.splice(q5 - 1, 3, fa, fb); q5--; }
    }
    segs = segs.concat(own);
  });
  return segs;
}
// one piece between two joints: a line, or an arc of a known circle that starts and ends where the joints fall on it
function tunerArc(P, Q, seg, r, c) {
  var dx = Q[0] - P[0], dy = Q[1] - P[1], d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
  if (seg.line) return { line: true, P: P, Q: Q, tx: dx / d, ty: dy / d, d: d };
  var a0 = Math.atan2(P[1] - c[1], P[0] - c[0]), a1 = Math.atan2(Q[1] - c[1], Q[0] - c[0]), o = seg.ang > 0 ? 1 : -1, sw = ((((a1 - a0) * o) % TAU) + TAU) % TAU * o;
  if (Math.abs(sw - o * TAU - seg.ang) < Math.abs(sw - seg.ang)) sw -= o * TAU; // the joints all but coincide: take the short way
  var g = sw >= 0 ? 1 : -1, ae = a0 + sw;
  return { line: false, r: r, cx: c[0], cy: c[1], a0: a0, sw: sw, d: d, P: [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], Q: [c[0] + r * Math.cos(ae), c[1] + r * Math.sin(ae)],
    sx: -g * Math.sin(a0), sy: g * Math.cos(a0), ex: -g * Math.sin(ae), ey: g * Math.cos(ae) };
}
function tunerBreak(a, b) { // how sharply the outline turns where piece a hands over to piece b, in radians, signed
  var ax = a.line ? a.tx : a.ex, ay = a.line ? a.ty : a.ey, bx = b.line ? b.tx : b.sx, by = b.line ? b.ty : b.sy;
  return Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
}
function tunerLadder(H0, unit, minR, r) { // the step of the ladder nearest r that can still span its two joints
  var best = null, bd = Infinity, n, v;
  for (n = -10; n <= 24; n++) {
    v = unit * (n >= 0 ? systemGrow(H0, n) : 1 / systemGrow(H0, -n));
    if (v < minR) continue;
    var dd = Math.abs(Math.log(v / r)); if (dd < bd) { bd = dd; best = { r: v, n: n }; }
  }
  return best || { r: Math.max(minR, r), n: 99 };
}
function tunerTune(L, H0, unit, strength, size) {
  var segs = L.segs, K = segs.length, n = L.pts.length, V0 = segs.map(function (s) { return L.pts[s.i0 % n].slice(); }), k, i;
  var open = !!L.open, Vend = open && K ? L.pts[segs[K - 1].i1 % n].slice() : null, nextV = function (q) { return open && q === K - 1 ? Vend : V0[(q + 1) % K]; };
  var r0 = [], rT = [], rungs = [];
  for (k = 0; k < K; k++) {
    var P = V0[k], Q = nextV(k), half = Math.sqrt((Q[0] - P[0]) * (Q[0] - P[0]) + (Q[1] - P[1]) * (Q[1] - P[1])) / 2;
    if (segs[k].line) { r0.push(0); rT.push(0); rungs.push(null); continue; }
    var base = segs[k].r, lad = tunerLadder(H0, unit, 0, base);
    r0.push(base); rT.push(lad.r); rungs.push(lad.n);
  }
  var fit = [];
  for (k = 0; k < K; k++) fit.push(tunerArc(V0[k], nextV(k), segs[k], r0[k], [segs[k].cx, segs[k].cy]));
  if (!(strength > 0) || K < 2) return { fit: fit, tuned: fit, rungs: rungs, rT: rT };
  // The tuned form is a chain of circles that touch. Each keeps its snapped radius; the centers settle where neighbors are tangent and the arc still follows the traced outline.
  var Rk = rT.slice(), o = segs.map(function (sg) { return sg.ang > 0 ? 1 : -1; }), gid = [], G = [], g;
  var twins = function (j) { var a = (j - 1 + K) % K; return !L.cornerAt[j] && !fit[a].line && !fit[j].line && o[a] === o[j] && rungs[a] === rungs[j]; };
  for (k = 0; k < K; k++) { if (fit[k].line) { gid.push(-1); continue; } if (k > 0 && twins(k)) gid.push(gid[k - 1]); else { gid.push(G.length); G.push({ c: [0, 0], R: 0, n: 0, data: [] }); } }
  if (K > 1 && twins(0) && gid[0] !== gid[K - 1]) { var from = gid[0], to = gid[K - 1]; for (k = 0; k < K && gid[k] === from; k++) gid[k] = to; } // the loop closes on the same circle
  for (k = 0; k < K; k++) { if (gid[k] < 0) continue; g = G[gid[k]]; g.c[0] += fit[k].cx; g.c[1] += fit[k].cy; g.R += Rk[k]; g.n++;
    var stp = Math.max(1, Math.floor((segs[k].i1 - segs[k].i0) / 24)), q3; for (q3 = segs[k].i0; q3 <= segs[k].i1; q3 += stp) g.data.push(L.pts[q3 % n]); }
  G.forEach(function (gg) { if (gg.n) { gg.c[0] /= gg.n; gg.c[1] /= gg.n; gg.R /= gg.n; } });
  var C = gid.map(function (q) { return q < 0 ? null : G[q].c; }), R = gid.map(function (q) { return q < 0 ? 0 : G[q].R; }), side = fit.map(function () { return 0; });
  var sdist = function (c, ln) { return (c[0] - ln.P[0]) * ln.ty - (c[1] - ln.P[1]) * ln.tx; }; // which side of a line a center sits, and how far
  for (k = 0; k < K; k++) { var pa = fit[(k - 1 + K) % K], pb = fit[k]; if (pa.line !== pb.line) side[k] = sdist(pa.line ? C[k] : C[(k - 1 + K) % K], pa.line ? pa : pb) >= 0 ? 1 : -1; }
  var touch = function () { // pull every smooth joint to tangent
    for (var j = 0; j < K; j++) {
      var a = (j - 1 + K) % K;
      if (L.cornerAt[j] || (fit[a].line && fit[j].line) || (gid[a] >= 0 && gid[a] === gid[j])) continue;
      if (fit[a].line || fit[j].line) { var ci = fit[a].line ? j : a, ln = fit[a].line ? fit[a] : fit[j], e = side[j] * R[ci] - sdist(C[ci], ln); C[ci][0] += e * ln.ty; C[ci][1] -= e * ln.tx; continue; }
      var dx = C[j][0] - C[a][0], dy = C[j][1] - C[a][1], dl = Math.sqrt(dx * dx + dy * dy);
      if (dl < 1e-9) continue;
      var e2 = (dl - (o[a] === o[j] ? Math.abs(R[a] - R[j]) : R[a] + R[j])) / 2;
      C[a][0] += dx / dl * e2; C[a][1] += dy / dl * e2; C[j][0] -= dx / dl * e2; C[j][1] -= dy / dl * e2;
    }
  };
  var it, pass;
  for (it = 0; it < 240; it++) {
    var al = 1 - it / 240;
    G.forEach(function (gg) { // lean each circle toward the outline it stands for
      var sx = 0, sy = 0, dd = gg.data, q;
      for (q = 0; q < dd.length; q++) { var ex = dd[q][0] - gg.c[0], ey = dd[q][1] - gg.c[1], el = Math.sqrt(ex * ex + ey * ey) || 1, t = el - gg.R; sx += t * ex / el; sy += t * ey / el; }
      if (dd.length) { gg.c[0] += al * sx / dd.length; gg.c[1] += al * sy / dd.length; }
    });
    for (pass = 0; pass < 4; pass++) touch();
  }
  for (pass = 0; pass < 60; pass++) touch();
  var gap = function () { return 0; };
  var onto = function (v, q) { var dx = v[0] - C[q][0], dy = v[1] - C[q][1], dl = Math.sqrt(dx * dx + dy * dy) || 1; return [C[q][0] + dx / dl * R[q], C[q][1] + dy / dl * R[q]]; };
  var foot = function (v, ln) { var t = (v[0] - ln.P[0]) * ln.tx + (v[1] - ln.P[1]) * ln.ty; return [ln.P[0] + ln.tx * t, ln.P[1] + ln.ty * t]; };
  var near = function (list, v) { var best = null, bd = Infinity; list.forEach(function (q) { var dq = (q[0] - v[0]) * (q[0] - v[0]) + (q[1] - v[1]) * (q[1] - v[1]); if (dq < bd) { bd = dq; best = q; } }); return best; };
  var J = [];
  for (k = 0; k < K; k++) {
    if (open && k === 0) { J.push(fit[0].line ? V0[0].slice() : onto(V0[0], 0)); continue; } // a free end stays where the line began
    var a = (k - 1 + K) % K, la = fit[a].line, lb = fit[k].line, v0 = V0[k], pt2 = null;
    if (la && lb) { // two lines: where they cross, or where they already met if they run alongside
      var den = fit[a].tx * fit[k].ty - fit[a].ty * fit[k].tx;
      if (Math.abs(den) > 0.05) { var tt = ((fit[k].P[0] - fit[a].P[0]) * fit[k].ty - (fit[k].P[1] - fit[a].P[1]) * fit[k].tx) / den; pt2 = [fit[a].P[0] + fit[a].tx * tt, fit[a].P[1] + fit[a].ty * tt]; }
      else pt2 = v0;
    } else if (la || lb) {
      var ci = la ? k : a, ln = la ? fit[a] : fit[k], f = foot(C[ci], ln);
      if (!L.cornerAt[k]) pt2 = f; // tangent: the foot of the center on the line
      else { var off2 = Math.sqrt((f[0] - C[ci][0]) * (f[0] - C[ci][0]) + (f[1] - C[ci][1]) * (f[1] - C[ci][1])), hh = R[ci] * R[ci] - off2 * off2;
        pt2 = hh > 0 ? near([[f[0] + ln.tx * Math.sqrt(hh), f[1] + ln.ty * Math.sqrt(hh)], [f[0] - ln.tx * Math.sqrt(hh), f[1] - ln.ty * Math.sqrt(hh)]], v0) : f; }
    } else {
      var dx = C[k][0] - C[a][0], dy = C[k][1] - C[a][1], dl = Math.sqrt(dx * dx + dy * dy);
      if (L.cornerAt[k]) { // a corner sits where the two circles cross
        var a1 = dl > 1e-6 ? (R[a] * R[a] - R[k] * R[k] + dl * dl) / (2 * dl) : 0, h2 = R[a] * R[a] - a1 * a1;
        if (dl > 1e-6 && h2 > 0) { var mx = C[a][0] + dx / dl * a1, my = C[a][1] + dy / dl * a1, hq = Math.sqrt(h2); pt2 = near([[mx - dy / dl * hq, my + dx / dl * hq], [mx + dy / dl * hq, my - dx / dl * hq]], v0); }
        else { var q1 = onto(v0, a), q2 = onto(v0, k); pt2 = [(q1[0] + q2[0]) / 2, (q1[1] + q2[1]) / 2]; }
      } else if (o[a] === o[k] && Math.abs(R[a] - R[k]) < 0.2 * Math.min(R[a], R[k])) { var w1 = onto(v0, a), w2 = onto(v0, k); pt2 = [(w1[0] + w2[0]) / 2, (w1[1] + w2[1]) / 2]; } // near twins: the touching point is ill defined, and they all but coincide here anyway
      else if (dl < 1e-6) pt2 = onto(v0, a);
      else { // tangent: the touching point lies on the line through both centers
        var ux = dx / dl, uy = dy / dl, same = o[a] === o[k], sa = same && R[a] < R[k] ? -1 : 1, sb = same ? sa : -1;
        var ja = [C[a][0] + sa * R[a] * ux, C[a][1] + sa * R[a] * uy], jb = [C[k][0] + sb * R[k] * ux, C[k][1] + sb * R[k] * uy];
        pt2 = [(ja[0] + jb[0]) / 2, (ja[1] + jb[1]) / 2];
      }
    }
    J.push(pt2);
  }
  var tuned = [];
  var Jend = open ? (fit[K - 1].line ? Vend : onto(Vend, K - 1)) : null, mixP = function (a2, b2) { return [a2[0] + (b2[0] - a2[0]) * strength, a2[1] + (b2[1] - a2[1]) * strength]; };
  for (k = 0; k < K; k++) {
    var Jq = open && k === K - 1 ? Jend : J[(k + 1) % K];
    if (strength >= 1) { tuned.push(tunerArc(J[k], Jq, segs[k], R[k], C[k])); continue; }
    tuned.push(tunerArc(mixP(fit[k].P, J[k]), mixP(fit[k].Q, Jq), segs[k], fit[k].line ? 0 : r0[k] + (R[k] - r0[k]) * strength, fit[k].line ? null : mixP([fit[k].cx, fit[k].cy], C[k])));
  }
  return { fit: fit, tuned: tuned, rungs: rungs, rT: rT, dbg: { C: C, R: R, J: J, G: G.length } };
}
function tunerStats(L, arcs) { // how far the pieces sit from the traced outline, and the sharpest joint that is not a corner
  var n = L.pts.length, K = arcs.length, dev = 0, join = 0, k, q;
  for (k = 0; k < K; k++) {
    var a = arcs[k], s = L.segs[k];
    for (q = s.i0; q <= s.i1; q++) {
      var p = L.pts[q % n], dd = a.line ? Math.abs((p[0] - a.P[0]) * a.ty - (p[1] - a.P[1]) * a.tx) : Math.abs(Math.sqrt((p[0] - a.cx) * (p[0] - a.cx) + (p[1] - a.cy) * (p[1] - a.cy)) - a.r);
      if (dd > dev) dev = dd;
    }
    if (!L.cornerAt[k]) join = Math.max(join, Math.abs(tunerBreak(arcs[(k - 1 + K) % K], a)) * 180 / Math.PI);
  }
  return { dev: dev, join: join };
}

// ---------- tuner, bezier mode: the same pieces and joints as cubic curves, then curvature made equal across every smooth joint ----------
// Method: Grey Harmony (mekkablue) after Simon Cozens' algorithm, in the form that needs no intersection: t = 1 / (1 + sqrt(hL / hR)).
function tunerBezier(arcs, cornerAt) {
  var segs = [], smooth = [], K = arcs.length, k, q, err = 0;
  for (k = 0; k < K; k++) {
    var a = arcs[k];
    if (a.line) {
      segs.push({ p0: a.P.slice(), c1: [a.P[0] + (a.Q[0] - a.P[0]) / 3, a.P[1] + (a.Q[1] - a.P[1]) / 3], c2: [a.P[0] + (a.Q[0] - a.P[0]) * 2 / 3, a.P[1] + (a.Q[1] - a.P[1]) * 2 / 3], p3: a.Q.slice(), line: true });
      smooth.push(false); continue;
    }
    var n = Math.max(1, Math.ceil(Math.abs(a.sw) / (Math.PI / 4) - 1e-9)), th = a.sw / n, h = 4 / 3 * Math.tan(th / 4) * a.r; // handles of (4/3) tan(angle/4) r; no cubic turns more than 45 degrees, so it sits on its circle to a few millionths of r
    for (q = 0; q < n; q++) {
      var t0 = a.a0 + th * q, t1 = t0 + th, c0 = Math.cos(t0), s0 = Math.sin(t0), c1 = Math.cos(t1), s1 = Math.sin(t1);
      var p0 = [a.cx + a.r * c0, a.cy + a.r * s0], p3 = [a.cx + a.r * c1, a.cy + a.r * s1];
      var sgn = { p0: p0, c1: [p0[0] - h * s0, p0[1] + h * c0], c2: [p3[0] + h * s1, p3[1] - h * c1], p3: p3, line: false };
      for (var e = 1; e < 20; e++) { var w = cubicAt(sgn, e / 20), dv = Math.abs(Math.sqrt((w[0] - a.cx) * (w[0] - a.cx) + (w[1] - a.cy) * (w[1] - a.cy)) - a.r); if (dv > err) err = dv; }
      segs.push(sgn);
      smooth.push(q > 0 ? true : !cornerAt[k] && !arcs[(k - 1 + K) % K].line);
    }
  }
  for (k = 0; k < segs.length; k++) { // one point per joint: a piece starts exactly where the last one ended
    var pv = segs[(k - 1 + segs.length) % segs.length], sg = segs[k], dx = pv.p3[0] - sg.p0[0], dy = pv.p3[1] - sg.p0[1];
    sg.p0 = pv.p3; if (!sg.line) { sg.c1[0] += dx; sg.c1[1] += dy; }
  }
  return { segs: segs, smooth: smooth, err: err };
}
function cubicAt(s, t) { var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t; return [a * s.p0[0] + b * s.c1[0] + c * s.c2[0] + d * s.p3[0], a * s.p0[1] + b * s.c1[1] + c * s.c2[1] + d * s.p3[1]]; }
function cubicCurv(s, t) { // signed curvature and unit tangent at t
  var u = 1 - t, x1 = 3 * (u * u * (s.c1[0] - s.p0[0]) + 2 * u * t * (s.c2[0] - s.c1[0]) + t * t * (s.p3[0] - s.c2[0])), y1 = 3 * (u * u * (s.c1[1] - s.p0[1]) + 2 * u * t * (s.c2[1] - s.c1[1]) + t * t * (s.p3[1] - s.c2[1]));
  var x2 = 6 * (u * (s.c2[0] - 2 * s.c1[0] + s.p0[0]) + t * (s.p3[0] - 2 * s.c2[0] + s.c1[0])), y2 = 6 * (u * (s.c2[1] - 2 * s.c1[1] + s.p0[1]) + t * (s.p3[1] - 2 * s.c2[1] + s.c1[1])), sp = Math.sqrt(x1 * x1 + y1 * y1) || 1e-9;
  return { k: (x1 * y2 - y1 * x2) / (sp * sp * sp), tx: x1 / sp, ty: y1 / sp };
}
function tunerHarmonize(B, limit, blend) {
  var S = B.segs, n = S.length, frozen = new Uint8Array(n), state = new Uint8Array(n), k, i; // state: 1 harmonized, 2 left alone, 3 refused
  var orig = S.map(function (s) { return { c1: s.c1.slice(), c2: s.c2.slice() }; });
  var ends = function (j) {
    var A = S[(j - 1 + n) % n], C = S[j], O = C.p0, P = A.c2, N = C.c1, ux = N[0] - P[0], uy = N[1] - P[1], ul = Math.sqrt(ux * ux + uy * uy);
    if (A.line || C.line || ul < 1e-9) return null;
    ux /= ul; uy /= ul;
    var hL = (A.c1[0] - O[0]) * uy - (A.c1[1] - O[1]) * ux, hR = (C.c2[0] - O[0]) * uy - (C.c2[1] - O[1]) * ux;
    var a = Math.sqrt((O[0] - P[0]) * (O[0] - P[0]) + (O[1] - P[1]) * (O[1] - P[1])), b = Math.sqrt((N[0] - O[0]) * (N[0] - O[0]) + (N[1] - O[1]) * (N[1] - O[1]));
    if (hL * hR <= 0 || Math.abs(hL) < 1e-6 || Math.abs(hR) < 1e-6 || a < 1e-6 || b < 1e-6) return null; // an inflection, or one side straight: equal curvature cannot be reached here
    return { P: P, N: N, O: O, hL: hL, hR: hR, kL: Math.abs(hL) / (a * a), kR: Math.abs(hR) / (b * b) };
  };
  for (k = 0; k < n; k++) { // decided once, on the form as it comes in: what is left alone
    if (!B.smooth[k]) continue;
    var e0 = ends(k);
    if (!e0 || Math.max(e0.kL, e0.kR) / Math.min(e0.kL, e0.kR) > 4) { frozen[k] = 1; state[k] = 2; } // a change in curvature this abrupt is taken as meant
  }
  var pass = function () {
    var worst = 0;
    for (var j = 0; j < n; j++) {
      if (!B.smooth[j] || frozen[j]) continue;
      var e = ends(j); if (!e) continue;
      var t = 1 / (1 + Math.sqrt(e.hL / e.hR)), dx = e.O[0] - (e.N[0] + t * (e.P[0] - e.N[0])), dy = e.O[1] - (e.N[1] + t * (e.P[1] - e.N[1]));
      e.P[0] += dx; e.P[1] += dy; e.N[0] += dx; e.N[1] += dy; state[j] = 1;
      var mv = Math.sqrt(dx * dx + dy * dy); if (mv > worst) worst = mv;
    }
    return worst;
  };
  var settle = function () { for (var it = 0; it < 400; it++) if (pass() < 0.002) break; };
  var drift = function (j) { var o = { p0: S[j].p0, c1: orig[j].c1, c2: orig[j].c2, p3: S[j].p3 }, w = 0; for (var q = 1; q < 20; q++) { var u = cubicAt(o, q / 20), v = cubicAt(S[j], q / 20), dd = Math.sqrt((u[0] - v[0]) * (u[0] - v[0]) + (u[1] - v[1]) * (u[1] - v[1])); if (dd > w) w = dd; } return w; };
  var put = function (j) { // a joint goes back to how it came in, and stays there
    if (!B.smooth[j] || state[j] === 2) return;
    var A = S[(j - 1 + n) % n]; A.c2 = orig[(j - 1 + n) % n].c2.slice(); S[j].c1 = orig[j].c1.slice(); frozen[j] = 1; state[j] = 3;
  };
  settle();
  for (var round = 0; round < 12; round++) {
    var bad = []; for (k = 0; k < n; k++) if (!S[k].line && drift(k) > limit) bad.push(k);
    if (!bad.length) break;
    bad.forEach(function (j) { put(j); put((j + 1) % n); });
    for (k = 0; k < n; k++) if (!frozen[k] && B.smooth[k]) { S[(k - 1 + n) % n].c2 = orig[(k - 1 + n) % n].c2.slice(); S[k].c1 = orig[k].c1.slice(); } // the rest start again from the form as it came in
    settle();
  }
  var res = { harmonized: 0, left: 0, refused: 0, mismatch: 0, drift: 0, second: 0, state: state };
  for (k = 0; k < n; k++) {
    if (state[k] === 1) { res.harmonized++; var e1 = ends(k); if (e1) res.mismatch = Math.max(res.mismatch, Math.abs(e1.kL - e1.kR) / Math.max(e1.kL, e1.kR)); }
    else if (state[k] === 2) res.left++; else if (state[k] === 3) res.refused++;
    if (!S[k].line) res.drift = Math.max(res.drift, drift(k));
  }
  res.second = pass(); // run once more: nothing should move
  if (blend < 1) for (k = 0; k < n; k++) { for (i = 0; i < 2; i++) { S[k].c1[i] = orig[k].c1[i] + (S[k].c1[i] - orig[k].c1[i]) * blend; S[k].c2[i] = orig[k].c2[i] + (S[k].c2[i] - orig[k].c2[i]) * blend; } } // the master slider: part of the way from the curves as they came in
  return res;
}
// Curvature along a run of pieces, as samples a comb can be drawn from. Works on arcs and lines, or on cubic segments.
function tunerSamples(pieces, cubic) {
  var out = [], k, q, N = 40;
  for (k = 0; k < pieces.length; k++) {
    var pc = pieces[k], row = [];
    for (q = 0; q <= N; q++) {
      var t = q / N;
      if (cubic) { var cv = pc.line ? { k: 0, tx: 0, ty: 0 } : cubicCurv(pc, t), pt = pc.line ? [pc.p0[0] + (pc.p3[0] - pc.p0[0]) * t, pc.p0[1] + (pc.p3[1] - pc.p0[1]) * t] : cubicAt(pc, t); row.push({ x: pt[0], y: pt[1], k: cv.k, nx: cv.ty, ny: -cv.tx }); }
      else if (pc.line) row.push({ x: pc.P[0] + (pc.Q[0] - pc.P[0]) * t, y: pc.P[1] + (pc.Q[1] - pc.P[1]) * t, k: 0, nx: 0, ny: 0 });
      else { var an = pc.a0 + pc.sw * t, g = pc.sw >= 0 ? 1 : -1; row.push({ x: pc.cx + pc.r * Math.cos(an), y: pc.cy + pc.r * Math.sin(an), k: g / pc.r, nx: g * Math.cos(an), ny: g * Math.sin(an) }); }
    }
    out.push(row);
  }
  return out;
}

var TUNER_PRESETS = { // each is a full starting point, corners included
  faithful: { detail: 0.8, corners: 40, harmony: 'major scale', unit: 0, strength: 0.5, curves: 'circles', corner: 'sharp', cornerSize: -2 },
  golden: { detail: 0.5, corners: 40, harmony: 'golden', unit: 0, strength: 1, curves: 'circles', corner: 'round', cornerSize: -2 },
  fifth: { detail: 0.5, corners: 40, harmony: 'fifth 2:3', unit: 0, strength: 1, curves: 'circles', corner: 'round', cornerSize: -3 },
  bold: { detail: 0.15, corners: 50, harmony: 'octave 1:2', unit: 0, strength: 1, curves: 'circles', corner: 'round', cornerSize: -1 },
  smooth: { detail: 0.5, corners: 40, harmony: 'major scale', unit: 0, strength: 0.5, curves: 'bezier', harmonize: true, drift: 0.5, corner: 'round', cornerSize: -4 }
};

// ---------- tuner, strokes: a mark made of lines is read as centerlines with a weight, not as outlines ----------
function tunerEDT(m, R) { // for every ink pixel, the squared distance to the nearest ground pixel (Felzenszwalb and Huttenlocher)
  var INF = 1e20, f = new Float64Array(R), dd = new Float64Array(R), v = new Int32Array(R), z = new Float64Array(R + 1), out = new Float32Array(R * R), x, y;
  var pass = function () {
    var k = 0, q, s; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (q = 1; q < R; q++) {
      s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    for (q = 0, k = 0; q < R; q++) { while (z[k + 1] < q) k++; dd[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
  };
  for (x = 0; x < R; x++) { for (y = 0; y < R; y++) f[y] = m[y * R + x] ? INF : 0; pass(); for (y = 0; y < R; y++) out[y * R + x] = dd[y]; }
  for (y = 0; y < R; y++) { for (x = 0; x < R; x++) f[x] = out[y * R + x]; pass(); for (x = 0; x < R; x++) out[y * R + x] = dd[x]; }
  return out;
}
function tunerThin(m, R) { // Zhang and Suen thinning: ink is peeled from both sides until one pixel is left along the middle
  var sk = new Uint8Array(m), list = [], i, changed = true, pass, q;
  for (i = 0; i < R * R; i++) if (sk[i]) list.push(i);
  while (changed) {
    changed = false;
    for (pass = 0; pass < 2; pass++) {
      var del = [], keep = [];
      for (q = 0; q < list.length; q++) {
        i = list[q];
        var p2 = sk[i - R], p3 = sk[i - R + 1], p4 = sk[i + 1], p5 = sk[i + R + 1], p6 = sk[i + R], p7 = sk[i + R - 1], p8 = sk[i - 1], p9 = sk[i - R - 1], B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (B === 8) { keep.push(i); continue; }
        if (B < 2 || B > 6) { keep.push(i); continue; }
        var A = (!p2 && p3 ? 1 : 0) + (!p3 && p4 ? 1 : 0) + (!p4 && p5 ? 1 : 0) + (!p5 && p6 ? 1 : 0) + (!p6 && p7 ? 1 : 0) + (!p7 && p8 ? 1 : 0) + (!p8 && p9 ? 1 : 0) + (!p9 && p2 ? 1 : 0);
        if (A === 1 && (pass === 0 ? p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0 : p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0)) del.push(i); else keep.push(i);
      }
      for (q = 0; q < del.length; q++) sk[del[q]] = 0;
      if (del.length) changed = true;
      list = keep;
    }
  }
  return { sk: sk, list: list };
}
function tunerStrokes(m, R) { // every line of the mark as a run of points along its middle, each with the line's width there
  var sc = R / TN, d2 = tunerEDT(m, R), th = tunerThin(m, R), sk = th.sk, N8 = [-R, -R + 1, 1, R + 1, R, R - 1, -1, -R - 1], order = [0, 2, 4, 6, 1, 3, 5, 7], cn = new Uint8Array(R * R), seen = new Uint8Array(R * R), paths = [], k;
  th.list.forEach(function (i) { var c = 0; for (k = 0; k < 8; k++) if (!sk[i + N8[k]] && sk[i + N8[(k + 1) % 8]]) c++; cn[i] = c; }); // 1 at a line's end, 2 along it, 3 or more where lines meet
  var walk = function (start, first) {
    var path = [start], cur = first, prev = start;
    if (cn[start] < 3) seen[start] = 1;
    for (var guard = 0; guard < 400000; guard++) {
      path.push(cur);
      if (cn[cur] >= 3) break;
      seen[cur] = 1;
      var nxt = -1, c;
      for (k = 0; k < 8; k++) { c = cur + N8[order[k]]; if (sk[c] && c !== prev && !seen[c]) { nxt = c; break; } }
      if (nxt < 0) break;
      prev = cur; cur = nxt;
    }
    return path;
  };
  var from = function (i) { for (var q = 0; q < 8; q++) { var c = i + N8[order[q]]; if (sk[c] && !seen[c] && cn[c] < 3) paths.push(walk(i, c)); } };
  th.list.forEach(function (i) { if (cn[i] === 1 && !seen[i]) { var c0 = -1; for (k = 0; k < 8; k++) if (sk[i + N8[order[k]]]) { c0 = i + N8[order[k]]; break; } if (c0 >= 0) paths.push(walk(i, c0)); else { seen[i] = 1; paths.push([i]); } } });
  th.list.forEach(function (i) { if (cn[i] >= 3) from(i); });
  th.list.forEach(function (i) { if (cn[i] === 0 && !seen[i]) { seen[i] = 1; paths.push([i]); } });
  th.list.forEach(function (i) { if (cn[i] === 2 && !seen[i]) { var c0 = -1; for (k = 0; k < 8; k++) if (sk[i + N8[order[k]]]) { c0 = i + N8[order[k]]; break; } if (c0 >= 0) { var pl = walk(i, c0); pl.closed = true; paths.push(pl); } } });
  var out = [], length = 0, inkAt = function (x, y) { x = Math.round(x * sc - 0.5); y = Math.round(y * sc - 0.5); return x >= 0 && y >= 0 && x < R && y < R && m[y * R + x] === 1; };
  paths.forEach(function (pl) {
    var n = pl.length, raw = pl.map(function (i) { var x = i % R; return [(x + 0.5) / sc, ((i - x) / R + 0.5) / sc, 2 * Math.sqrt(d2[i]) / sc]; }), i, j;
    var endA = cn[pl[0]] === 1 || n === 1, endB = cn[pl[n - 1]] === 1 || n === 1, wm = 0;
    raw.forEach(function (q) { wm += q[2]; }); wm /= n;
    if (n < 4) { if (endA && endB && !pl.closed) out.push({ dot: true, pts: [[raw[0][0], raw[0][1]]], w: [wm], segs: [], cornerAt: [] }); return; } // a dot: nothing left of it but its middle
    var hw = Math.max(2, Math.round(2 * sc)), sm = [];
    for (i = 0; i < n; i++) { var sx = 0, sy = 0, sw = 0, ws = 0; for (j = -hw; j <= hw; j++) { var q = pl.closed ? raw[(i + j + n) % n] : raw[Math.max(0, Math.min(n - 1, i + j))], wq = hw + 1 - Math.abs(j); sx += q[0] * wq; sy += q[1] * wq; sw += q[2] * wq; ws += wq; } sm.push([sx / ws, sy / ws, sw / ws]); }
    var cum = [0]; for (i = 1; i < n; i++) cum.push(cum[i - 1] + Math.sqrt((sm[i][0] - sm[i - 1][0]) * (sm[i][0] - sm[i - 1][0]) + (sm[i][1] - sm[i - 1][1]) * (sm[i][1] - sm[i - 1][1])));
    var len = cum[n - 1];
    if (!pl.closed && (endA || endB) && !(endA && endB) && len < Math.max(8, 1.5 * wm)) return; // a short spur off a junction is the thinning's own, not a line
    var cnt = Math.max(4, Math.round(len / 2.5)), pts = [], w = [], seg = 0;
    for (i = 0; i <= cnt; i++) { var want = len * i / cnt; while (seg < n - 2 && cum[seg + 1] < want) seg++; var t = (want - cum[seg]) / Math.max(1e-9, cum[seg + 1] - cum[seg]), a = sm[seg], b = sm[seg + 1]; pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); w.push(a[2] + (b[2] - a[2]) * t); }
    if (pl.closed) { pts.pop(); w.pop(); }
    var cap = function (atStart) { // a real end. The middle line is unsure of itself within half a width of an end, so the end is judged from a point that far back:
      // how far the ink runs on from there, and whether it is square at its end (ink fills the corners) or round
      var mm = pts.length, med = w.slice().sort(function (a3, b3) { return a3 - b3; })[Math.floor(mm / 2)] / 2, ix = function (q3) { return atStart ? q3 : mm - 1 - q3; }, i3 = 0, acc = 0;
      while (i3 < Math.floor(mm / 3) && acc < 1.2 * med) { i3++; var pa = pts[ix(i3)], pb = pts[ix(i3 - 1)]; acc += Math.sqrt((pa[0] - pb[0]) * (pa[0] - pb[0]) + (pa[1] - pb[1]) * (pa[1] - pb[1])); }
      var e = pts[ix(i3)], o = pts[ix(Math.min(mm - 1, i3 + 3))], tx = e[0] - o[0], ty = e[1] - o[1], tl = Math.sqrt(tx * tx + ty * ty) || 1, hwid = w[ix(i3)] / 2, run = 0;
      tx /= tl; ty /= tl;
      while (run < 4 * hwid + 12 && inkAt(e[0] + tx * (run + 0.5), e[1] + ty * (run + 0.5))) run += 0.5;
      var square = inkAt(e[0] + tx * run * 0.9 - ty * hwid * 0.8, e[1] + ty * run * 0.9 + tx * hwid * 0.8) && inkAt(e[0] + tx * run * 0.9 + ty * hwid * 0.8, e[1] + ty * run * 0.9 - tx * hwid * 0.8);
      return { kind: square ? 'butt' : 'round', ext: run, cut: i3 };
    };
    var cA = pl.closed ? null : endA ? cap(true) : { kind: 'joint', ext: 0, cut: 0 }, cB = pl.closed ? null : endB ? cap(false) : { kind: 'joint', ext: 0, cut: 0 };
    if (cA && cA.cut + cB.cut < pts.length - 4) { pts = pts.slice(cA.cut, pts.length - cB.cut); w = w.slice(cA.cut, w.length - cB.cut); }
    else if (cA) { cA.ext = Math.max(0, cA.ext - 1.2 * w[0] / 2); cB.ext = Math.max(0, cB.ext - 1.2 * w[w.length - 1] / 2); } // too short to cut back: keep the whole line
    length += len;
    out.push({ stroke: true, open: !pl.closed, pts: pts, w: w, capA: cA ? cA.kind : '', capB: cB ? cB.kind : '', extA: cA ? cA.ext : 0, extB: cB ? cB.ext : 0, len: len });
  });
  return { list: out, length: length };
}
// A tuned centerline given its weight back: the outline of the stroke, with its ends.
function strokeOutline(arcs, L, scale, ends, X, Y, S) {
  var pts = [], k, q, total = 0;
  for (k = 0; k < arcs.length; k++) {
    var pc = arcs[k], N = pc.line ? 1 : Math.max(2, Math.ceil(Math.abs(pc.sw) * pc.r / 2.5));
    for (q = k ? 1 : 0; q <= N; q++) {
      var t = q / N;
      if (pc.line) pts.push([pc.P[0] + (pc.Q[0] - pc.P[0]) * t, pc.P[1] + (pc.Q[1] - pc.P[1]) * t, pc.tx, pc.ty, 1]);
      else { var an = pc.a0 + pc.sw * t, g = pc.sw >= 0 ? 1 : -1; pts.push([pc.cx + pc.r * Math.cos(an), pc.cy + pc.r * Math.sin(an), -g * Math.sin(an), g * Math.cos(an), 1]); }
    }
    if (k < arcs.length - 1 || !L.open) { // where this piece hands over to the next: the two sides meet at a miter, capped at four half-widths
      var nx = arcs[(k + 1) % arcs.length], e5 = pts[pts.length - 1], ox = nx.line ? nx.tx : nx.sx, oy = nx.line ? nx.ty : nx.sy, mx = e5[2] + ox, my = e5[3] + oy, ml = Math.sqrt(mx * mx + my * my);
      if (ml > 0.5) { var ch = ml / 2; e5[2] = mx / ml; e5[3] = my / ml; e5[4] = Math.min(4, 1 / Math.max(0.05, ch)); }
    }
  }
  var n = pts.length; if (n < 2) return '';
  var cum = [0]; for (k = 1; k < n; k++) cum.push(cum[k - 1] + Math.sqrt((pts[k][0] - pts[k - 1][0]) * (pts[k][0] - pts[k - 1][0]) + (pts[k][1] - pts[k - 1][1]) * (pts[k][1] - pts[k - 1][1])));
  total = cum[n - 1] || 1;
  var wAt = function (f) { var x = f * (L.w.length - 1), i0 = Math.floor(x), i1 = Math.min(L.w.length - 1, i0 + 1); return (L.w[i0] + (L.w[i1] - L.w[i0]) * (x - i0)) * scale; };
  var left = [], right = [], P = function (x, y) { return X(x) + ' ' + Y(y); };
  for (k = 0; k < n; k++) { var hw = wAt(cum[k] / total) / 2 * pts[k][4]; left.push(P(pts[k][0] - pts[k][3] * hw, pts[k][1] + pts[k][2] * hw)); right.push(P(pts[k][0] + pts[k][3] * hw, pts[k][1] - pts[k][2] * hw)); }
  if (!L.open) return 'M' + left.join('L') + 'ZM' + right.reverse().join('L') + 'Z';
  var capPts = function (atStart) { // the points that close one end, walking from one side of the stroke round to the other
    var e = atStart ? pts[0] : pts[n - 1], kind = atStart ? L.capA : L.capB, ext = (atStart ? L.extA : L.extB) || 0, hw = wAt(atStart ? 0 : 1) / 2, dir = atStart ? -1 : 1, tx = e[2] * dir, ty = e[3] * dir, out = [], steps = 10, s;
    if (kind !== 'joint' && ends !== 'auto') kind = ends;
    if (kind === 'butt') { // square: the end is put back where the ink stopped
      out.push([e[0] + tx * ext - ty * hw, e[1] + ty * ext + tx * hw], [e[0] + tx * ext + ty * hw, e[1] + ty * ext - tx * hw]);
    } else {
      var back = kind === 'joint' ? 0 : Math.max(0, ext - hw), cx = e[0] + tx * back, cy = e[1] + ty * back; // round: a half circle whose tip is where the ink stopped
      for (s = 0; s <= steps; s++) { var an = Math.PI * s / steps, c = Math.cos(an), sn = Math.sin(an); out.push([cx + (-ty * c + tx * sn) * hw, cy + (tx * c + ty * sn) * hw]); }
    }
    return out.map(function (q2) { return P(q2[0], q2[1]); });
  };
  return 'M' + left.join('L') + 'L' + capPts(false).join('L') + 'L' + right.reverse().join('L') + 'L' + capPts(true).join('L') + 'Z';
}
// A corner eased by an arc that touches both pieces. The arc's radius is a step of the ladder; a corner too tight for it is left sharp.
function tunerFillet(arcs, cornerAt, rc) {
  var K = arcs.length, plan = [], made = 0, skipped = 0, k;
  var tanEnd = function (a) { return a.line ? [a.tx, a.ty] : [a.ex, a.ey]; }, tanStart = function (a) { return a.line ? [a.tx, a.ty] : [a.sx, a.sy]; };
  var lenOf = function (a) { return a.line ? a.d : Math.abs(a.sw) * a.r; };
  for (k = 0; k < K; k++) {
    plan.push(null);
    if (!cornerAt[k] || !(rc > 0.05)) continue;
    var a = arcs[(k - 1 + K) % K], b = arcs[k], V = b.P, ta = tanEnd(a), tb = tanStart(b), turn = ta[0] * tb[1] - ta[1] * tb[0], dot = ta[0] * tb[0] + ta[1] * tb[1];
    if (Math.abs(turn) < 0.08) { skipped++; continue; }
    var sg = turn > 0 ? 1 : -1, off = function (pc, t) { // the piece moved rc toward the inside of the turn: a line shifted sideways, or a circle grown or shrunk
      var nx = -t[1] * sg, ny = t[0] * sg;
      if (pc.line) return { line: true, px: pc.P[0] + nx * rc, py: pc.P[1] + ny * rc, tx: pc.tx, ty: pc.ty };
      var away = nx * (V[0] - pc.cx) + ny * (V[1] - pc.cy) > 0; return { line: false, cx: pc.cx, cy: pc.cy, r: pc.r + (away ? rc : -rc) };
    }, oa = off(a, ta), ob = off(b, tb), cand = [];
    if (oa.line && ob.line) { var den = oa.tx * ob.ty - oa.ty * ob.tx; if (Math.abs(den) > 1e-6) { var tt = ((ob.px - oa.px) * ob.ty - (ob.py - oa.py) * ob.tx) / den; cand.push([oa.px + oa.tx * tt, oa.py + oa.ty * tt]); } }
    else if (oa.line !== ob.line) { var ln = oa.line ? oa : ob, ci = oa.line ? ob : oa; if (ci.r > 0) { var fx0 = (ci.cx - ln.px) * ln.tx + (ci.cy - ln.py) * ln.ty, qx = ln.px + ln.tx * fx0, qy = ln.py + ln.ty * fx0, dd = (qx - ci.cx) * (qx - ci.cx) + (qy - ci.cy) * (qy - ci.cy), hh = ci.r * ci.r - dd; if (hh >= 0) { var hq = Math.sqrt(hh); cand.push([qx + ln.tx * hq, qy + ln.ty * hq], [qx - ln.tx * hq, qy - ln.ty * hq]); } } }
    else if (oa.r > 0 && ob.r > 0) { var dx = ob.cx - oa.cx, dy = ob.cy - oa.cy, dl = Math.sqrt(dx * dx + dy * dy); if (dl > 1e-6) { var a1 = (oa.r * oa.r - ob.r * ob.r + dl * dl) / (2 * dl), h2 = oa.r * oa.r - a1 * a1; if (h2 >= 0) { var hq2 = Math.sqrt(h2), mx = oa.cx + dx / dl * a1, my = oa.cy + dy / dl * a1; cand.push([mx - dy / dl * hq2, my + dx / dl * hq2], [mx + dy / dl * hq2, my - dx / dl * hq2]); } } }
    if (!cand.length) { skipped++; continue; }
    cand.sort(function (q1, q2) { return (q1[0] - V[0]) * (q1[0] - V[0]) + (q1[1] - V[1]) * (q1[1] - V[1]) - (q2[0] - V[0]) * (q2[0] - V[0]) - (q2[1] - V[1]) * (q2[1] - V[1]); });
    var Fc = cand[0], touch = function (pc) { if (pc.line) { var f = (Fc[0] - pc.P[0]) * pc.tx + (Fc[1] - pc.P[1]) * pc.ty; return [pc.P[0] + pc.tx * f, pc.P[1] + pc.ty * f]; } var ex = Fc[0] - pc.cx, ey = Fc[1] - pc.cy, el = Math.sqrt(ex * ex + ey * ey) || 1; return [pc.cx + ex / el * pc.r, pc.cy + ey / el * pc.r]; };
    var Ta = touch(a), Tb = touch(b), cutA = Math.sqrt((Ta[0] - V[0]) * (Ta[0] - V[0]) + (Ta[1] - V[1]) * (Ta[1] - V[1])), cutB = Math.sqrt((Tb[0] - V[0]) * (Tb[0] - V[0]) + (Tb[1] - V[1]) * (Tb[1] - V[1]));
    if (cutA > 0.45 * lenOf(a) || cutB > 0.45 * lenOf(b)) { skipped++; continue; } // the pieces are too short to give that much away
    plan[k] = { Ta: Ta, Tb: Tb, F: Fc, ang: sg * Math.acos(Math.max(-1, Math.min(1, dot))) };
  }
  var out = [], oc = [], fillets = [];
  for (k = 0; k < K; k++) {
    var pc = arcs[k], st = plan[k], en = plan[(k + 1) % K], P = st ? st.Tb : pc.P, Q = en ? en.Ta : pc.Q;
    if (st) { var fa = tunerArc(st.Ta, st.Tb, { line: false, ang: st.ang }, rc, st.F); out.push(fa); oc.push(false); fillets.push(fa); made++; }
    out.push(pc.line ? tunerArc(P, Q, { line: true }) : tunerArc(P, Q, { line: false, ang: pc.sw }, pc.r, [pc.cx, pc.cy])); oc.push(st ? false : cornerAt[k]);
  }
  return { arcs: out, cornerAt: oc, fillets: fillets, made: made, skipped: skipped };
}
var TUNER_DEFAULTS = { detail: 0.5, corners: 40, harmony: 'golden', unit: 0, strength: 1, curves: 'circles', harmonize: true, drift: 0.5, corner: 'sharp', cornerSize: -2 };
var TUNER_TUNING = ['preset', 'detail', 'corners', 'harmony', 'unit', 'strength', 'curves', 'harmonize', 'drift', 'corner', 'cornerSize', 'read', 'ends', 'effect', 'view'];
var tunerLast = null;
function tuner(props, img) { // whatever is asked, the board gets a form or a line saying why not
  try { var v = tunerCore(props, img); tunerLast = { v: v, img: img }; return v; }
  catch (e) {
    var msg = { x: -584, y: -330, t: 'The Tuner could not draw this combination (' + String(e && e.message || e).slice(0, 90) + '). Showing the last form that worked.' };
    if (tunerLast && tunerLast.img === img) { var keep = ext(tunerLast.v); keep.labels = tunerLast.v.labels.concat([msg]); keep.failed = true; return keep; }
    msg.t = msg.t.replace(' Showing the last form that worked.', '');
    return { d: '', orig: '', circles: '', guides: '', dots: '', labels: [msg], comb0: '', comb1: '', comb2: '', gridD: '', fillRule: 'evenodd', failed: true, stats: {} };
  }
}
function tunerCore(props, img) {
  var r3 = function (v) { return Math.round(v * 1000) / 1000; }, p = props || {}, isSet = function (v) { return !(v === undefined || v === null || v === ''); }, wasReset = p.reset === true || p.reset === 'true';
  if (wasReset) { var bare = {}; for (var kk in p) if (TUNER_TUNING.indexOf(kk) < 0) bare[kk] = p[kk]; p = bare; } // reset: every tuning setting is ignored while it is on
  var presetName = TUNER_PRESETS[p.preset] ? p.preset : 'custom', own = [], CHOICES = { harmony: 1, curves: 1, corner: 1 }, cleaned = ext(p);
  for (var ck in CHOICES) if (cleaned[ck] === 'preset') delete cleaned[ck]; // a choice left on "preset" is the preset's to make
  p = cleaned;
  if (presetName !== 'custom') { // a preset is a starting point. A choice he made, or a slider moved off its plain default, is his and wins
    var pv0 = TUNER_PRESETS[presetName], merged = ext(p);
    for (var pk in pv0) { if (!isSet(p[pk]) || (!CHOICES[pk] && String(p[pk]) === String(TUNER_DEFAULTS[pk]))) merged[pk] = pv0[pk]; else own.push(pk + ' ' + p[pk]); }
    p = merged;
  }
  var num = numOf(p), clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; }, yes = function (k2, dflt) { return p[k2] === undefined || p[k2] === null || p[k2] === '' ? dflt : !(p[k2] === false || p[k2] === 'false'); };
  var fx = clamp(num('effect', 100), 0, 100) / 100; // the master: how much of everything below is applied
  var reading = p.read === 'strokes' || p.read === 'auto' ? p.read : 'outline', endsKind = p.ends === 'butt' || p.ends === 'round' ? p.ends : 'auto', weights = {};
  var detail = clamp(num('detail', 0.5), 0, 1), tol = Math.round((4 - 3.4 * detail) * 100) / 100, thr = clamp(num('corners', 40), 10, 120);
  var srcKey = img ? 'img' + (img.__tn || (img.__tn = ++seq)) : p.sample === 'letter' ? 'L' + (p.letter || 'S') + '|' + (p.letterFont || '') : 'crescent';
  var R = [512, 1024, 2048].indexOf(+p.raster) >= 0 ? +p.raster : 2048, qr = R / TN;
  var traceKey = srcKey + '|' + R, key = traceKey + '|' + tol + '|' + thr, i, k;
  if (tunerCache.traceKey !== traceKey) { // read the form once; only a new file or a new raster reads it again
    var ink = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, area = 0, loops = null, source = img ? 'traced from pixels at ' + R : 'built in, traced at ' + R;
    var vec = img && img.__svg ? tunerVectors(img.__svg) : null;
    if (vec) { // the file's own curves: fit them into the working square and step along them evenly
      vec.forEach(function (pl) { pl.forEach(function (q) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }); });
      var vs = 430 / Math.max(1e-9, x1 - x0, y1 - y0), vcx = (x0 + x1) / 2, vcy = (y0 + y1) / 2;
      loops = vec.map(function (pl) { return tunerResample(pl.map(function (q) { return [TN / 2 + (q[0] - vcx) * vs, TN / 2 + (q[1] - vcy) * vs]; })); }).filter(Boolean);
      if (loops.length) { x0 = TN / 2 + (x0 - vcx) * vs; x1 = TN / 2 + (x1 - vcx) * vs; y0 = TN / 2 + (y0 - vcy) * vs; y1 = TN / 2 + (y1 - vcy) * vs; x1 -= 1; y1 -= 1; source = 'read as vectors'; } else loops = null;
    }
    if (!loops) {
      var mask = tunerMask(p, img, R); x0 = R; x1 = 0; y0 = R; y1 = 0;
      for (i = 0; i < R * R; i++) if (mask[i]) { ink++; var mx = i % R, my = (i - mx) / R; if (mx < x0) x0 = mx; if (mx > x1) x1 = mx; if (my < y0) y0 = my; if (my > y1) y1 = my; }
      ink /= qr * qr; x0 /= qr; y0 /= qr; x1 = (x1 + 1) / qr - 1; y1 = (y1 + 1) / qr - 1;
      loops = tunerTrace(mask, R);
    }
    loops.forEach(function (L) { area += L.area; });
    if (!ink) ink = Math.abs(area);
    tunerCache = { traceKey: traceKey, fitKey: '', fit: { loops: loops, source: source, ink: ink, area: Math.abs(area), size: Math.max(1, x1 - x0 + 1, y1 - y0 + 1), cx: (x0 + x1 + 1) / 2, cy: (y0 + y1 + 1) / 2 } };
  }
  if (tunerCache.fitKey !== key) { // the fit is cheap, so detail and corners redraw without reading the form again
    tunerCache.fit.loops.forEach(function (L) { var cs = tunerCorners(L.pts, thr); L.segs = tunerFitLoop(L.pts, cs, tol); L.corners = cs; L.cornerAt = L.segs.map(function (sg) { return cs.indexOf(sg.i0 % L.pts.length) >= 0; }); });
    tunerCache.fitKey = key;
  }
  if (reading !== 'outline') { // the same form, read along its middle lines
    var Rs = Math.min(R, 1024), skKey = srcKey + '|' + Rs;
    if (tunerCache.skKey !== skKey) { tunerCache.strokes = tunerStrokes(tunerMask(p, img, Rs), Rs); tunerCache.skKey = skKey; tunerCache.skFit = ''; }
    if (tunerCache.skFit !== key) {
      tunerCache.strokes.list.forEach(function (L) { if (L.dot) return; var cs2 = tunerCorners(L.pts, thr, L.open); L.segs = tunerFitLoop(L.pts, cs2, tol, L.open); L.corners = cs2; L.cornerAt = L.segs.map(function (sg, q) { return (L.open && q === 0) || cs2.indexOf(sg.i0 % L.pts.length) >= 0; }); });
      tunerCache.skFit = key;
    }
  }
  var F = tunerCache.fit;
  if (reading === 'auto') reading = tunerCache.strokes.length > 0 && F.ink / (tunerCache.strokes.length * F.size) < 0.08 ? 'strokes' : 'outline'; // thin on average: a mark made of lines
  var units = reading === 'strokes' ? tunerCache.strokes.list : F.loops;
  var hname = HARMONY[p.harmony] ? p.harmony : 'golden', H0 = HARMONY[hname], unitIn = clamp(num('unit', 0), 0, 1), unit = unitIn * F.size, st = clamp(num('strength', 1), 0, 1) * fx;
  if (!(unitIn > 0)) { // no unit given: try a spread of them over one step of the ladder and keep the one that moves the radii least
    var span = H0.r ? H0.r[1] / H0.r[0] : 2, bestU = 0.08 * F.size, bestE = Infinity, ui;
    for (ui = 0; ui < 48; ui++) {
      var cand = 0.06 * F.size * Math.pow(span, ui / 48), err = 0;
      units.forEach(function (L) { L.segs.forEach(function (sg) { if (!sg.line) err += Math.abs(Math.log(tunerLadder(H0, cand, 0, sg.r).r / sg.r)) * Math.abs(sg.ang) * sg.r; }); });
      if (err < bestE) { bestE = err; bestU = cand; }
    }
    unit = bestU;
  }
  var S = 1.25 * clamp(num('size', 1), 0.4, 1.6), X = function (v) { return r3((v - F.cx) * S); }, Y = function (v) { return r3((v - F.cy) * S); };
  var curves = p.curves === 'bezier' ? 'bezier' : 'circles', harmonize = yes('harmonize', true), driftShare = clamp(num('drift', 0.5), 0, 10) / 100, combOn = yes('comb', false), combScale = clamp(num('combScale', 1), 0.1, 8);
  var dbx0 = 1e9, dbx1 = -1e9, dby0 = 1e9, dby1 = -1e9, cornerKind = p.corner === 'round' ? 'round' : 'sharp', cornerStep = Math.round(clamp(num('cornerSize', -2), -8, 6)), rounded = 0, unrounded = 0, roundJoin = 0;
  var bz = { harmonized: 0, left: 0, refused: 0, mismatch: 0, drift: 0, second: 0, joints: 0 }, combRows = [], edges = [], cornerPts = [];
  var view = p.view || 'tuned', d = '', orig = '', circles = '', dots = '', labels = [], fitDev = 0, tunedDev = 0, join = 0, arcsN = 0, linesN = 0, cornersN = 0, off = 0, used = {}, untuned = 0;
  units.forEach(function (L) {
    if (L.dot) { var dr = L.w[0] / 2, dp = []; for (var dq = 0; dq < 24; dq++) dp.push(X(L.pts[0][0] + dr * Math.cos(TAU * dq / 24)) + ' ' + Y(L.pts[0][1] + dr * Math.sin(TAU * dq / 24))); d += 'M' + dp.join('L') + 'Z'; return; }
    var T = tunerTune(L, H0, unit, st, F.size); if (p.debug && T.dbg) (window.__tn = window.__tn || []).push({ T: T, L: L }); var sf = tunerStats(L, T.fit), stt = tunerStats(L, T.tuned);
    if (T.tuned !== T.fit && (stt.join > 30 || T.tuned.some(function (a, q) { var f = T.fit[q], sg = L.segs[q]; return a.line ? a.tx * f.tx + a.ty * f.ty < 0 : a.sw * sg.ang < 0 || Math.abs(a.sw) > Math.abs(sg.ang) + 2.5; }))) {
      T.why = 'tuned joint ' + stt.join.toFixed(1) + ', fit joint ' + sf.join.toFixed(1); T.tuned = T.fit; stt = sf; untuned++; // a piece turned back on itself: this outline will not close cleanly on the ladder, so it stays as fitted
    }
    var arcs = view === 'fitted' ? T.fit : T.tuned, K = arcs.length, n = L.pts.length, drawn = arcs, drawnCorner = L.cornerAt;
    if (cornerKind === 'round' && fx > 0 && view !== 'original' && !L.stroke && K > 1) { // corners eased by an arc off the same ladder
      var crr = unit * (cornerStep >= 0 ? systemGrow(H0, cornerStep) : 1 / systemGrow(H0, -cornerStep)) * fx, fl = tunerFillet(arcs, L.cornerAt, crr);
      drawn = fl.arcs; drawnCorner = fl.cornerAt; rounded += fl.made; unrounded += fl.skipped;
      fl.arcs.forEach(function (pc8, q8) { if (!fl.cornerAt[q8]) roundJoin = Math.max(roundJoin, Math.abs(tunerBreak(fl.arcs[(q8 - 1 + fl.arcs.length) % fl.arcs.length], pc8)) * 180 / Math.PI); });
      fl.fillets.forEach(function (f8) { var rs8 = f8.r * S, cx8 = X(f8.cx), cy8 = Y(f8.cy); circles += 'M' + r3(cx8 - rs8) + ' ' + cy8 + 'A' + r3(rs8) + ' ' + r3(rs8) + ' 0 1 0 ' + r3(cx8 + rs8) + ' ' + cy8 + 'A' + r3(rs8) + ' ' + r3(rs8) + ' 0 1 0 ' + r3(cx8 - rs8) + ' ' + cy8; });
    }
    fitDev = Math.max(fitDev, sf.dev); tunedDev = Math.max(tunedDev, stt.dev); join = Math.max(join, view === 'fitted' ? sf.join : stt.join);
    orig += 'M' + L.pts.map(function (q) { return X(q[0]) + ' ' + Y(q[1]); }).join('L') + (L.open ? '' : 'Z');
    if (L.stroke) { // the middle line, tuned, gets its weight back; the weight itself goes onto the ladder
      var wm = L.w.slice().sort(function (a2, b2) { return a2 - b2; })[Math.floor(L.w.length / 2)], wl = tunerLadder(H0, unit, 0, wm), wsc = view === 'original' ? 1 : 1 + st * (wl.r / wm - 1);
      d += strokeOutline(view === 'original' ? T.fit : arcs, L, wsc, endsKind, X, Y, S); if (view !== 'original') weights[wl.n] = (weights[wl.n] || 0) + 1;
    } else
    if (view === 'original') d += 'M' + L.pts.map(function (q) { return X(q[0]) + ' ' + Y(q[1]); }).join('L') + 'Z';
    var bez = null;
    if (curves === 'bezier' && view !== 'original' && K && !L.stroke) {
      bez = tunerBezier(drawn, drawnCorner); bz.arcErr = Math.max(bz.arcErr || 0, bez.err);
      if (harmonize) { var hs = tunerHarmonize(bez, driftShare * F.size, fx); bz.harmonized += hs.harmonized; bz.left += hs.left; bz.refused += hs.refused; bz.mismatch = Math.max(bz.mismatch, hs.mismatch); bz.drift = Math.max(bz.drift, hs.drift); bz.second = Math.max(bz.second, hs.second);
        bez.segs.forEach(function (sg, q) { if (hs.state[q] === 3) labels.push({ x: r3(X(sg.p0[0]) + 8), y: r3(Y(sg.p0[1]) + 16), t: 'refused' }); }); }
      bez.segs.forEach(function (sg, q) {
        d += (q ? '' : 'M' + X(sg.p0[0]) + ' ' + Y(sg.p0[1])) + (sg.line ? 'L' + X(sg.p3[0]) + ' ' + Y(sg.p3[1]) : 'C' + X(sg.c1[0]) + ' ' + Y(sg.c1[1]) + ' ' + X(sg.c2[0]) + ' ' + Y(sg.c2[1]) + ' ' + X(sg.p3[0]) + ' ' + Y(sg.p3[1]));
        dots += 'M' + r3(X(sg.p0[0]) - 2.5) + ' ' + r3(Y(sg.p0[1]) - 2.5) + 'h5v5h-5Z';
        if (!sg.line) { circles += 'M' + X(sg.p0[0]) + ' ' + Y(sg.p0[1]) + 'L' + X(sg.c1[0]) + ' ' + Y(sg.c1[1]) + 'M' + X(sg.p3[0]) + ' ' + Y(sg.p3[1]) + 'L' + X(sg.c2[0]) + ' ' + Y(sg.c2[1]);
          dots += 'M' + r3(X(sg.c1[0]) - 1.5) + ' ' + r3(Y(sg.c1[1]) - 1.5) + 'h3v3h-3ZM' + r3(X(sg.c2[0]) - 1.5) + ' ' + r3(Y(sg.c2[1]) - 1.5) + 'h3v3h-3Z'; }
      });
      d += 'Z'; bz.joints += bez.segs.length;
    } else if (K && !L.stroke) {
      for (k = 0; k < drawn.length; k++) {
        var pc2 = drawn[k]; d += (k ? 'L' : 'M') + X(pc2.P[0]) + ' ' + Y(pc2.P[1]);
        if (pc2.line) { d += 'L' + X(pc2.Q[0]) + ' ' + Y(pc2.Q[1]); continue; }
        var parts = Math.max(1, Math.ceil(Math.abs(pc2.sw) / 1.6)), qq; // short arcs only, so the drawn circle is exactly the measured one
        for (qq = 1; qq <= parts; qq++) { var aq = pc2.a0 + pc2.sw * qq / parts; d += 'A' + r3(pc2.r * S) + ' ' + r3(pc2.r * S) + ' 0 0 ' + (pc2.sw > 0 ? 1 : 0) + ' ' + X(pc2.cx + pc2.r * Math.cos(aq)) + ' ' + Y(pc2.cy + pc2.r * Math.sin(aq)); }
      }
      d += 'Z';
    }
    (view === 'original' ? [] : tunerSamples(bez ? bez.segs : drawn, !!bez)).forEach(function (row) { for (var q8 = 0; q8 < row.length; q8++) { var w8 = row[q8]; if (w8.x < dbx0) dbx0 = w8.x; if (w8.x > dbx1) dbx1 = w8.x; if (w8.y < dby0) dby0 = w8.y; if (w8.y > dby1) dby1 = w8.y; } });
    if (combOn && view !== 'original' && K) combRows = combRows.concat(tunerSamples(bez ? bez.segs : drawn, !!bez));
    for (k = 0; k < K; k++) {
      var a = arcs[k], vx = X(a.P[0]), vy = Y(a.P[1]);
      if (!bez) dots += 'M' + r3(vx - 2.5) + ' ' + r3(vy - 2.5) + 'h5v5h-5Z';
      if (L.cornerAt[k]) cornerPts.push([a.P[0] - F.cx, a.P[1] - F.cy]);
      if (a.line) edges.push({ deg: Math.atan2(a.ty, a.tx) * 180 / Math.PI, len: a.d });
      if (L.cornerAt[k]) { cornersN++; labels.push({ x: r3(vx + 8), y: r3(vy - 6), t: Math.round(180 - Math.abs(tunerBreak(arcs[(k - 1 + K) % K], a)) * 180 / Math.PI) + '°' }); }
      if (a.line) { linesN++; continue; }
      arcsN++;
      var rs = a.r * S, cxs = X(a.cx), cys = Y(a.cy);
      if (!bez && rs < 2400) circles += 'M' + r3(cxs - rs) + ' ' + cys + 'A' + r3(rs) + ' ' + r3(rs) + ' 0 1 0 ' + r3(cxs + rs) + ' ' + cys + 'A' + r3(rs) + ' ' + r3(rs) + ' 0 1 0 ' + r3(cxs - rs) + ' ' + cys;
      if (Math.abs(T.tuned[k].r / T.rT[k] - 1) > 0.005) { off++; continue; }
      var rung = T.rungs[k]; used[rung] = (used[rung] || 0) + 1;
    }
  });
  var comb = ['', '', ''], kmax = 0;
  combRows.forEach(function (row) { row.forEach(function (q) { if (Math.abs(q.k) > kmax) kmax = Math.abs(q.k); }); });
  combRows.forEach(function (row) { // a fin off the outline, as tall as the curvature; three tones from flat to tight
    var hgt = function (q) { var h = q.k * F.size * F.size * 0.02 * combScale, cap = 0.3 * F.size; return h > cap ? cap : h < -cap ? -cap : h; };
    for (var q = 0; q < row.length - 1; q++) {
      var a = row[q], b = row[q + 1], ha = hgt(a), hb = hgt(b); if (Math.abs(ha) + Math.abs(hb) < 0.02) continue;
      var band = Math.min(2, Math.floor(3 * Math.sqrt((Math.abs(a.k) + Math.abs(b.k)) / 2 / (kmax || 1))));
      comb[band] += 'M' + X(a.x) + ' ' + Y(a.y) + 'L' + X(b.x) + ' ' + Y(b.y) + 'L' + X(b.x + b.nx * hb) + ' ' + Y(b.y + b.ny * hb) + 'L' + X(a.x + a.nx * ha) + ' ' + Y(a.y + a.ny * ha) + 'Z';
    }
  });
  var gridKind = GRIDS[p.grid] || p.grid === 'auto' ? p.grid : 'off', gridStep = clamp(num('gridStep', 1), 0.1, 16) * unit, gridTurn = num('gridTurn', 0), scores = {}, gridD = '';
  Object.keys(GRIDS).forEach(function (g2) { scores[g2] = gridScore(edges, cornerPts, g2, gridStep, F.size, gridTurn); });
  if (gridKind === 'auto') { var bestG = 'off', bestS = 0.1; Object.keys(GRIDS).forEach(function (g2) { if (scores[g2].edges > bestS + 1e-9) { bestS = scores[g2].edges; bestG = g2; } }); gridKind = bestG; }
  if (gridKind !== 'off') gridD = grid(gridKind, gridStep * S, gridTurn);
  var pcs = function (v) { return Math.round(v * 100) + '%'; };
  if (p.grid && p.grid !== 'off') {
    labels.push({ x: -584, y: 250, t: 'straight edges along a grid turned ' + Math.round(gridTurn) + '\u00b0: ' + Object.keys(GRIDS).map(function (g2) { return g2 + ' ' + pcs(scores[g2].edges); }).join(', ') });
    labels.push({ x: -584, y: 270, t: gridKind === 'off' ? 'no grid fits this form' : gridKind + ' grid, turned ' + Math.round(gridTurn) + '\u00b0, corners on its crossings ' + pcs(gridScore(edges, cornerPts, gridKind, gridStep, F.size, gridTurn).corners) });
  }
  if (wasReset) labels.push({ x: -584, y: -370, t: 'reset is on: every tuning setting is ignored and the plain defaults are drawn. Switch it off to get your settings back.' });
  else if (presetName !== 'custom') labels.push({ x: -584, y: -370, t: 'preset ' + presetName + ': detail ' + detail + ', corners ' + thr + '\u00b0, ' + hname + ', strength ' + clamp(num('strength', 1), 0, 1) + ', ' + curves + ', corner ' + cornerKind + (own.length ? '. Yours, kept: ' + own.join(', ') : '') });
  if (cornerKind === 'round' && view !== 'original') labels.push({ x: -584, y: 210, t: rounded + ' corners rounded on the ladder' + (unrounded ? ', ' + unrounded + ' too tight and left sharp' : '') });
  if (yes('help', false)) { // one line for every setting that is not at its plain default: what it is doing to this form
    var hl = [], dflt = function (k3) { return !isSet(p[k3]) || String(p[k3]) === String(TUNER_DEFAULTS[k3]); };
    if (fx < 1) hl.push('effect ' + Math.round(fx * 100) + '%: everything below is applied at that share');
    if (p.read && p.read !== 'outline') hl.push('read ' + p.read + ': the form is read as ' + (reading === 'strokes' ? 'lines with a weight' : 'an outline'));
    if (view !== 'tuned') hl.push('view ' + view + ': ' + (view === 'fitted' ? 'the pieces as fitted, before any tuning' : 'the form as read, nothing rebuilt'));
    if (!dflt('detail')) hl.push('detail ' + detail + ': the pieces follow the form to within ' + (Math.round(tol / F.size * 1000) / 10) + '% of its size');
    if (!dflt('corners')) hl.push('corners ' + thr + '\u00b0: a turn sharper than this counts as a corner');
    if (!dflt('harmony')) hl.push('harmony ' + hname + ': the ladder every radius is pulled onto');
    if (unitIn > 0) hl.push('unit ' + unitIn + ': x is set by hand at that share of the form; 0 lets it choose');
    if (!dflt('strength')) hl.push('strength ' + clamp(num('strength', 1), 0, 1) + ': radii go that share of the way to the ladder');
    if (curves === 'bezier') hl.push('curves bezier: the pieces are Bezier curves' + (harmonize ? ', curvature evened at smooth joints' : ', curvature left as it falls'));
    if (curves === 'bezier' && harmonize && !dflt('drift')) hl.push('drift ' + (driftShare * 100) + '%: harmony may move the outline that far');
    if (cornerKind === 'round') hl.push('corner round: corners get an arc ' + (Math.round((cornerStep >= 0 ? systemGrow(H0, cornerStep) : 1 / systemGrow(H0, -cornerStep)) * 1000) / 1000) + 'x in radius');
    if (endsKind !== 'auto') hl.push('ends ' + endsKind + ': every line end is drawn that way');
    if (!hl.length) hl.push('every setting is at its plain default');
    hl.forEach(function (tx8, q8) { labels.push({ x: -584, y: -345 + q8 * 18, t: tx8 }); });
  }
  if (curves === 'bezier' && harmonize && view !== 'original') labels.push({ x: -584, y: 310, t: 'bezier: ' + bz.harmonized + ' joints harmonized, ' + bz.left + ' left alone, ' + bz.refused + ' refused; outline moved ' + (Math.round(bz.drift / F.size * 10000) / 100) + '%' });
  if (curves === 'bezier' && harmonize && view !== 'original' && bz.refused >= 3 && bz.refused > bz.harmonized) labels.push({ x: -584, y: 230, t: 'Most joints were refused: this ladder moves the form too far to harmonize. Try a scale for harmony, a lower strength, or a higher drift.' });
  // the ladder, written out: the unit as a bracket, then every step in use and how many arcs sit on it
  var lx = 330, ly = -300, ux = unit * S, guides = 'M' + lx + ' ' + (ly + 9) + 'L' + lx + ' ' + ly + 'L' + r3(lx + ux) + ' ' + ly + 'L' + r3(lx + ux) + ' ' + (ly + 9);
  labels.push({ x: lx, y: ly - 10, t: 'x = ' + (Math.round(unit / F.size * 1000) / 1000) });
  labels.push({ x: lx, y: ly + 34, t: hname + (H0.r ? ', 1 : ' + Math.round(H0.r[1] / H0.r[0] * 1000) / 1000 : '') });
  Object.keys(used).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n2, q) {
    var mult = n2 >= 0 ? systemGrow(H0, n2) : 1 / systemGrow(H0, -n2);
    labels.push({ x: lx, y: ly + 58 + q * 20, t: (n2 === 99 ? 'off the ladder' : (Math.round(mult * 1000) / 1000) + 'x') + '   ' + used[n2] });
  });
  var pc = function (v) { return (Math.round(v / F.size * 1000) / 10) + '%'; };
  var stats = { arcs: arcsN, lines: linesN, corners: cornersN, traceArea: F.area, inkArea: F.ink, areaOff: F.ink ? Math.abs(F.area - F.ink) / F.ink : 0, fitDev: fitDev / F.size, tunedDev: tunedDev / F.size, join: join, offLadder: off, size: F.size, untuned: untuned, outlines: units.length, read: reading, bez: { harmonized: bz.harmonized, left: bz.left, refused: bz.refused, mismatch: bz.mismatch, drift: bz.drift / F.size, second: bz.second, segs: bz.joints, arcErr: (bz.arcErr || 0) / F.size }, grid: scores, gridKind: gridKind, gridTurn: gridTurn, rounded: rounded, unrounded: unrounded, roundJoin: roundJoin, effect: fx, reset: wasReset };
  var wk = Object.keys(weights).map(Number).sort(function (a2, b2) { return a2 - b2; });
  labels.push({ x: -584, y: 290, t: F.source + (reading === 'strokes' ? '; read as ' + units.length + ' lines' + (wk.length ? ', weights on the ladder: ' + wk.map(function (n2) { return (Math.round((n2 >= 0 ? systemGrow(H0, n2) : 1 / systemGrow(H0, -n2)) * 1000) / 1000) + 'x (' + weights[n2] + ')'; }).join(', ') : '') : '') });
  labels.push({ x: -584, y: 330, t: arcsN + ' arcs, ' + linesN + ' lines, ' + cornersN + ' corners' });
  labels.push({ x: -584, y: 350, t: 'fit strays ' + pc(fitDev) + ', tuned form moved ' + pc(tunedDev) });
  labels.push({ x: -584, y: 370, t: 'sharpest joint that is not a corner ' + (Math.round(join * 10) / 10) + '°' });
  if (untuned) labels.push({ x: -584, y: 310, t: untuned + ' of ' + units.length + ' outlines would not close on the ladder and stay as fitted' });
  return { d: d, orig: orig, circles: circles, guides: guides, dots: dots, labels: labels, stats: stats, comb0: comb[0], comb1: comb[1], comb2: comb[2], fillRule: reading === 'strokes' ? 'nonzero' : 'evenodd', read: reading, gridD: gridD, unitPx: r3(unit * S), preset: presetName, source: F.source, outline: F.loops.map(function (L) { return L.pts; }), box: dbx1 > dbx0 ? r3(Math.max(dbx1 - dbx0, dby1 - dby0) * S) : r3(F.size * S), boxX: dbx1 > dbx0 ? X((dbx0 + dbx1) / 2) : 0, boxY: dby1 > dby0 ? Y((dby0 + dby1) / 2) : 0 };
}
export { tuner, tunerVectors, TUNER_PRESETS as tunerPresets, TUNER_DEFAULTS as tunerDefaults }
