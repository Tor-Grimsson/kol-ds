/* System: a mark built from a few measures.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

import { numOf, hash, ext, r2 } from './util.js'
import { HARMONY, systemGrow } from './harmonies.js'
import { construct } from './construct.js'

// ---------- system: a mark built from a few measures. Circles on one axis whose radii grow by the harmony and whose edges step by x, a bar x thick, a foot cut by a circle sized from y ----------
function systemMeasures(props) {
  var p = props || {}, num = numOf(p), clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; }, on = function (k, d) { return p[k] === undefined || p[k] === null || p[k] === '' ? d : !(p[k] === false || p[k] === 'false'); };
  var m = { harmony: HARMONY[p.harmony] ? p.harmony : 'golden', y: clamp(num('y', 0.302), 0.03, 0.8), x: clamp(num('x', 0.058), 0.005, 0.3), steps: clamp(Math.round(num('steps', 4)), 1, 8), angle: num('angle', -72),
    circles: clamp(Math.round(num('circles', 6)), 1, 12), axisAt: clamp(num('axisAt', 0), 0, 1), invert: on('invert', false), bar: on('bar', true), foot: on('foot', true),
    footAt: clamp(num('footAt', 0.47), 0, 1), footSize: clamp(num('footSize', 0.5), 0.05, 2), join: p.join === 'flip' ? 'flip' : 'union', mirror: on('mirror', false), flip: on('flip', false) };
  var n = Math.round(+p.random || 0);
  if (n > 0) { // a roll picks every measure from a short list that keeps the parts in proportion
    var h = function (j) { return hash(n, j, 71); }, pick = function (list, j) { return list[Math.floor(h(j) * list.length) % list.length]; };
    m.harmony = pick(Object.keys(HARMONY), 1); m.y = pick([0.25, 0.302, 0.35, 0.4, 0.45], 2); m.x = pick([0.03, 0.045, 0.058, 0.07, 0.09], 3); m.steps = 2 + Math.floor(h(4) * 4);
    m.axisAt = pick([0, 0, 0.5, 0.382, 1], 6); m.invert = false;
    var edge = m.axisAt === 0 || m.axisAt === 1, Hh = HARMONY[m.harmony], gap = Infinity, kq;
    m.circles = Math.min(pick([2, 4, 4, 6, 6, 3], 5), m.steps + (edge ? 2 : 0)); // circles only turn back on themselves where the frame's edge hides the crossing
    for (kq = 0; kq < m.circles - 1; kq++) gap = Math.min(gap, m.y * (systemGrow(Hh, kq + 1) - systemGrow(Hh, kq)));
    if (gap < Infinity) m.x = Math.round(Math.min(m.x, gap * 0.6) * 1000) / 1000; // one step never outgrows the thinnest band m.bar = h(8) < 0.75; m.foot = h(9) < 0.6;
    m.footAt = pick([0.3, 0.47, 0.618, 0.7], 10); m.footSize = pick([0.5, 0.5, 0.75, 0.382], 11); m.mirror = h(12) < 0.5; m.flip = h(13) < 0.35; m.angle = pick([-72, -60, -45, -30, -108], 14);
  }
  if (p.over) for (var ko in p.over) m[ko] = p.over[ko]; // a drag on the board wins over the slider and over a roll
  return m;
}
function systemParts(m) { var rf = m.footSize * m.y, base = m.foot ? 1 - rf : 1; return { rf: rf, base: base, cy0: base - m.steps * m.x - m.y }; }
function systemDrag(props, key, px, py) { // where the pointer is, as the value of the measure being dragged
  var p = props || {}, m = systemMeasures(p), q = systemParts(m), sz = +p.size, W = 480 * Math.max(0.4, Math.min(1.4, isNaN(sz) || !sz ? 1 : sz));
  var u = (px + W / 2) / W, w = (py + W / 2) / W, cl = function (v, a, b) { return v < a ? a : v > b ? b : v; }, r3 = function (v) { return Math.round(v * 1000) / 1000; };
  if (m.mirror) u = 1 - u;
  if (m.flip) w = 1 - w;
  if (key === 'y') return r3(cl(u - m.axisAt, 0.03, 0.8));
  if (key === 'axisAt' || key === 'footAt') return r3(cl(u, 0, 1));
  if (key === 'x') return r3(cl((q.base - w) / m.steps, 0.005, 0.3));
  if (key === 'footSize') return Math.round(cl(Math.abs(u - m.footAt) / m.y, 0.05, 2) * 100) / 100;
  var a = Math.atan2(-(w - q.cy0), u - m.axisAt) * 180 / Math.PI; // the ray, read in the unturned frame
  return Math.round(((a % 360) + 540) % 360 - 180);
}

function systemRecipe(m) {
  var H0 = HARMONY[m.harmony], f = function (v) { return (Math.round(v * 10000) / 10000).toString(); }, tx = function (v) { return m.mirror ? 1 - v : v; }, ty = function (v) { return m.flip ? 1 - v : v; };
  var rf = m.footSize * m.y, base = m.foot ? 1 - rf : 1, top = base - m.x, out = [], i, cy0 = base - m.steps * m.x - m.y, cw = 7.8 / 480;
  var grow = function (k) { return systemGrow(H0, k); };
  var flipJoin = m.join === 'flip', cirs = [];
  if (m.invert) out.push((flipJoin ? 'x' : '+') + ' bar 0 ' + f(ty(0)) + ' 1 ' + f(ty(top)));
  for (i = 0; i < m.circles; i++) {
    var R = m.y * grow(i), st = i < m.steps ? m.steps - i : (i - m.steps) % 2 === 0 ? 2 : 1;
    cirs.push(f(tx(m.axisAt)) + ' ' + f(ty(base - st * m.x - R)) + ' ' + f(R));
  }
  if (flipJoin) cirs.forEach(function (c) { out.push('x circle ' + c); }); // every circle flips what is under it: clean while they nest, a cut where they cross
  else { // union: the same bands flip draws, counted from the outside in, each one solid, so a crossing stays filled
    for (i = cirs.length - 1; i >= 1; i -= 2) out.push((m.invert ? '- ' : '+ ') + 'crescent ' + cirs[i] + ' ' + cirs[i - 1]);
    if (cirs.length % 2) out.push((m.invert ? '- ' : '+ ') + 'circle ' + cirs[0]); // an odd count leaves the first circle as a disc
  }
  if (m.bar) out.push('+ bar 0 ' + f(ty(top)) + ' 1 ' + f(ty(base)));
  if (m.foot) { out.push('+ bar ' + f(tx(m.footAt)) + ' ' + f(ty(base)) + ' ' + f(tx(1)) + ' ' + f(ty(1))); out.push('- circle ' + f(tx(m.footAt)) + ' ' + f(ty(1)) + ' ' + f(rf)); }
  var ang = m.angle, ref = 0;
  if (m.mirror) { ang = 180 - ang; ref = 180; }
  if (m.flip) { ang = -ang; ref = -ref; }
  out.push('angle ' + f(tx(m.axisAt)) + ' ' + f(ty(cy0)) + ' ' + f(ang) + ' ' + f(ref));
  out.push('line ' + f(tx(m.axisAt)) + ' ' + f(ty(cy0)) + ' ' + f(tx(m.axisAt + m.y)) + ' ' + f(ty(cy0)));
  out.push('steps ' + f(tx(-0.2)) + ' ' + f(ty(base - m.steps * m.x)) + ' ' + f(ty(base)) + ' ' + m.steps + ' x');
  out.push('label ' + f(m.mirror ? tx(m.axisAt) + 0.02 : m.axisAt - 0.035) + ' ' + f(ty(cy0) + (m.flip ? 0.035 : -0.005)) + ' y');
  if (m.foot) out.push('label ' + f(tx(m.footAt) - 0.035) + ' ' + f(ty(1) + 0.01) + ' ' + m.footSize.toFixed(2) + 'y');
  return out.join('; ');
}
function system(props) {
  var p = props || {}, m = systemMeasures(p), rec = systemRecipe(m), v = construct(ext(p, { harmony: m.harmony, recipe: rec, frame: 'square', clip: true }), null);
  v.recipe = rec; v.measures = m;
  var q = systemParts(m), W = v.box, pt = function (u, w) { return [r2(-W / 2 + W * (m.mirror ? 1 - u : u)), r2(-W / 2 + W * (m.flip ? 1 - w : w))]; };
  var ar = m.angle * Math.PI / 180, rl = 100 / W;
  v.handlePts = [{ k: 'y', p: pt(m.axisAt + m.y, q.cy0) }, { k: 'axisAt', p: pt(m.axisAt, q.cy0) }, { k: 'x', p: pt(-0.2, q.base - m.steps * m.x) }, { k: 'angle', p: pt(m.axisAt + rl * Math.cos(ar), q.cy0 - rl * Math.sin(ar)) }];
  if (m.foot) v.handlePts.push({ k: 'footAt', p: pt(m.footAt, 1) }, { k: 'footSize', p: pt(m.footAt + q.rf, 1) });
  return v;
}
function systemSeeds(props) {
  var out = [], p = props || {}, show = p.construction === true || p.construction === 'true';
  for (var n = 1; n <= 24; n++) {
    var v = system(ext(p, { random: n, size: 1 })), m = v.measures;
    var grey = p.fill !== 'ink', math = !(p.math === false || p.math === 'false'), K = 0.5333;
    show = !(p.construction === false || p.construction === 'false');
    out.push({ grey: grey, wedges: math ? v.wedges : '', strokes: (show ? v.guides : '') + (math ? v.dims : ''), alpha: grey ? 0.85 : 0.5,
      texts: (math ? v.dimLabels : []).map(function (l) { return { t: l.t, left: r2((600 + l.x) * K) + 'px', top: r2((400 + l.y) * K - 8) + 'px' }; }),
      label: 'random ' + n + ': ' + m.harmony + ', y ' + m.y + ', x ' + m.x + ', steps ' + m.steps + ', circles ' + m.circles + ', axisAt ' + m.axisAt + (m.join === 'flip' ? ', join flip' : '') + (m.invert ? ', invert' : '') + (m.bar ? ', bar' : '') +
      (m.foot ? ', foot at ' + m.footAt + ' size ' + m.footSize : '') + (m.mirror ? ', mirror' : '') + (m.flip ? ', flip' : ''),
      d: v.d });
  }
  return out;
}
export { systemMeasures, systemParts, systemDrag, systemRecipe, system, systemSeeds }
