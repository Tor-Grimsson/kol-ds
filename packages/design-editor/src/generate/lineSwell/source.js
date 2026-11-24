/* LINE SWELL — the board engine, ported (plan-2026-11-18-kolbox-system W29.2).
 *
 * kol-branding's `05-logo-shapes/_files/canvas/project/line-swell.js` (his Line Swell canvas, 4Npm9zbKAg753Cz4TMPSKw),
 * carried VERBATIM for the line effects: master (Swell), warp, radial, moire, pinch, flow, rotor, vortex, their sheets
 * and their rolls. Settings in, the board's SVG `d` and transform out, exactly as the boards draw them. What changed,
 * and only this: the board drew its source shape on an 800 px canvas and read the pixels back; the engine is pure, so
 * `getField` scans the same picture here (`cover`, 4 sub-rows a pixel, held to 8 bits as getImageData was), the lit
 * sphere the image board shows before an upload is drawn the same way (`sampleAt`), and a letter comes in as outline
 * rings (`img.rings`) instead of the browser's own font. The board's "view original" is not here. The wave source and the
 * two motion loops, Wave and Keys, came in for 29.3, verbatim (`waveField`, `wave`, `keys` and their helpers; Keys takes the
 * port's `img` for a letter): `index.js` turns the output into the engine's marks, `labs.js` gives them time. */
/* eslint-disable */

  var N = 800, C = 400, TOL = 0.12, cache = { key: '' };

  var PRESETS = {
    Sun:    { shape: 'circle', letter: 'R', size: 0.92, breakUp: 0.5, pattern: 5, thickPart: 'inside', count: 17, angle: 0, thin: 0.07, thick: 0.66, length: 'shape', overhang: 28, ends: 'square', transition: 90, curve: 'swell', shift: 0, growFrom: 'center', ink: '#111111', ground: '#f4f4f4' },
    Blinds: { shape: 'circle', letter: 'R', size: 0.9, breakUp: 0, pattern: 1, thickPart: 'inside', count: 14, angle: 0, thin: 0, thick: 0.58, length: 'shape', overhang: 0, ends: 'square', transition: 0, curve: 'bevel', shift: 0, growFrom: 'center', ink: '#ffffff', ground: '#000000' },
    Steps:  { shape: 'split', letter: 'R', size: 1, breakUp: 0, pattern: 1, thickPart: 'inside', count: 4, angle: 0, thin: 0.5, thick: 0.5, length: 'frame', overhang: 0, ends: 'square', transition: 130, curve: 'swell', shift: -1, growFrom: 'center', ink: '#111111', ground: '#f4f4f4' },
    Keys:   { shape: 'peak', letter: 'R', size: 0.9, breakUp: 0, pattern: 1, thickPart: 'outside', count: 26, angle: 90, thin: 0.12, thick: 0.55, length: 'frame', overhang: 0, ends: 'square', transition: 0, curve: 'bevel', shift: 0, growFrom: 'center', ink: '#111111', ground: '#f4f4f4' },
    Hex:    { shape: 'hexagon', letter: 'R', size: 0.95, breakUp: 0, pattern: 1, thickPart: 'inside', count: 20, angle: 140, thin: 0, thick: 0.62, length: 'shape', overhang: 0, ends: 'round', transition: 0, curve: 'bevel', shift: 0, growFrom: 'center', ink: '#111111', ground: '#f4f4f4' },
    Ridge:  { shape: 'circle', letter: 'R', size: 1, breakUp: 0.5, pattern: 7, thickPart: 'inside', count: 10, angle: 0, thin: 0.08, thick: 0.8, length: 'frame', overhang: 0, ends: 'square', transition: 44, curve: 'bevel', shift: 0, growFrom: 'base', ink: '#0a1fff', ground: '#f1f1f1' },
    Glyph:  { shape: 'letter', letter: 'S', size: 1, breakUp: 0, pattern: 1, thickPart: 'inside', count: 16, angle: 0, thin: 0.45, thick: 0.45, length: 'frame', overhang: 0, ends: 'square', transition: 26, curve: 'bevel', shift: 0.5, growFrom: 'center', ink: '#ffffff', ground: '#0a1fff' },
    Pulse:  { shape: 'circle', letter: 'R', size: 0.85, breakUp: 0, pattern: 1, thickPart: 'inside', count: 18, angle: 90, thin: 0.22, thick: 0.8, length: 'frame', overhang: 0, ends: 'square', transition: 0, curve: 'bevel', shift: 0, growFrom: 'center', ink: '#ffffff', ground: '#000000' },
    Image:  { shape: 'image', letter: '', size: 1, breakUp: 0, pattern: 1, darkAreas: 'thick', contrast: 1.4, effect: 1, view: 'effect', levels: 0, count: 44, angle: 0, thin: 0.04, thick: 0.95, length: 'frame', overhang: 0, ends: 'square', transition: 14, curve: 'swell', shift: 0, growFrom: 'center', ink: '#111111', ground: '#f4f4f4' },
    // Relief: stepped plateaus rising from each baseline, as swell-06-ridge. Inverted: even lines that jog where the image is dark, as swell-07-glyph.
    Relief:   { shape: 'image', letter: '', size: 1, breakUp: 0, pattern: 1, darkAreas: 'thick', contrast: 1.4, effect: 1, view: 'effect', levels: 3, count: 26, angle: 0, thin: 0.06, thick: 0.95, length: 'frame', overhang: 0, ends: 'square', transition: 30, curve: 'bevel', shift: 0, growFrom: 'base', ink: '#0a1fff', ground: '#f1f1f1' },
    Inverted: { shape: 'image', letter: '', size: 1, breakUp: 0, pattern: 1, darkAreas: 'thick', contrast: 1.4, effect: 1, view: 'effect', levels: 1, count: 24, angle: 0, thin: 0.45, thick: 0.45, length: 'frame', overhang: 0, ends: 'square', transition: 26, curve: 'bevel', shift: 0.5, growFrom: 'center', ink: '#ffffff', ground: '#0a1fff' }
  };

  var STYLE_KEYS = ['levels', 'count', 'thin', 'thick', 'ends', 'transition', 'curve', 'shift', 'growFrom', 'ink', 'ground'];
  function pick(p) { var o = {}; STYLE_KEYS.forEach(function (k) { o[k] = p[k]; }); return o; }
  var STYLES = {
    lines: pick(PRESETS.Image), relief: pick(PRESETS.Relief), inverted: pick(PRESETS.Inverted),
    // Telescope: each line drops through three hard weights, no ramp, where the image gets lighter.
    telescope: { levels: 3, count: 32, thin: 0.1, thick: 0.6, ends: 'square', transition: 0, curve: 'bevel', shift: 0, growFrom: 'center', ink: '#fafafa', ground: '#35363a' }
  };

  // Reads a number from the tweaks. When a board's Motion section names this tweak, the loop adds to it:
  // swing goes there and back (a sine), run goes steadily one way (seamless when the amount is one full turn of the thing).
  function numOf(p) {
    var m = p.motion && p.motion !== 'off' ? p.motion : null, amt = +p.motionAmount || 0, tt = +p.motionT || 0;
    var dv = !m ? 0 : p.motionKind === 'run' ? amt * tt : amt * Math.sin(Math.PI * 2 * tt);
    return function (k, d) { var v = p[k]; v = v === undefined || v === null || v === '' || isNaN(+v) ? d : +v; return k === m ? v + dv : v; };
  }
  function hash(x, y, seed) { var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return n - Math.floor(n); }
  function noise(x, y, seed) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed), c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  // The port's field: what the board drew on its canvas, scanned without one. `img` is the port's source:
  // { image(x, y) → brightness 0–1 at a field pixel, or null for the lit sphere; rings: outline rings, any units, y down }.
  var ids = new WeakMap(), nextId = 0;
  function idOf(o) { if (!o || (typeof o !== 'object' && typeof o !== 'function')) return 0; if (!ids.has(o)) ids.set(o, ++nextId); return ids.get(o); }
  // a span [a, b) of one sub-row, added to the row's coverage
  function addSpan(cov, a, b, w) {
    a = a < 0 ? 0 : a > N ? N : a; b = b < 0 ? 0 : b > N ? N : b;
    if (b <= a) return;
    var ia = Math.floor(a), ib = Math.floor(b), j;
    if (ia === ib) { cov[ia] += (b - a) * w; return; }
    cov[ia] += (ia + 1 - a) * w;
    for (j = ia + 1; j < ib; j++) cov[j] += w;
    if (ib < N) cov[ib] += (b - ib) * w;
  }
  // one fill at `gray` over acc, even-odd, as the canvas paints it: each pixel takes its covered share
  function cover(acc, xsAt, gray) {
    var cov = new Float32Array(N), y, k, x, xs;
    for (y = 0; y < N; y++) {
      cov.fill(0);
      var any = false;
      for (k = 0; k < 4; k++) {
        xs = xsAt(y + (k + 0.5) / 4);
        if (xs.length < 2) continue;
        xs.sort(function (u, v) { return u - v; });
        for (var q = 0; q + 1 < xs.length; q += 2) { addSpan(cov, xs[q], xs[q + 1], 0.25); any = true; }
      }
      if (!any) continue;
      for (x = 0; x < N; x++) { var c = cov[x]; if (c > 0) { if (c > 1) c = 1; acc[y * N + x] = acc[y * N + x] * (1 - c) + gray * c; } }
    }
  }
  // the crossings of closed rings with a sub-row
  function ringXs(rings) {
    return function (sy) {
      var xs = [];
      for (var r = 0; r < rings.length; r++) {
        var p = rings[r];
        for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
          var yi = p[i][1], yj = p[j][1];
          if ((yi > sy) !== (yj > sy)) xs.push(p[i][0] + (sy - yi) * (p[j][0] - p[i][0]) / (yj - yi));
        }
      }
      return xs;
    };
  }
  function circleXs(R) { return function (sy) { var dy = sy - C; if (Math.abs(dy) >= R) return []; var dx = Math.sqrt(R * R - dy * dy); return [C - dx, C + dx]; }; }
  function bothXs(a, b) { return function (sy) { return a(sy).concat(b(sy)); }; }
  // a letter's rings, centred and one unit tall
  function unitRings(rings) {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    rings.forEach(function (r) { r.forEach(function (q) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }); });
    var h = y1 - y0 || 1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return rings.map(function (r) { return r.map(function (q) { return [(q[0] - cx) / h, (q[1] - cy) / h]; }); });
  }
  // A lit sphere on a soft ground, so the image source shows the effect before anything is picked: the board's
  // sampleImage (a linear ground #ececec to #a0a0a0, a disc of r 250 lit by a radial gradient), drawn without a canvas.
  function sampleAt(x, y) {
    var bg = 236 + (160 - 236) * (y / N), dx = x - 400, dy = y - 400, dist = Math.sqrt(dx * dx + dy * dy), cov = 0;
    if (dist < 249) cov = 1;
    else if (dist < 251) { for (var a = 0; a < 4; a++) for (var b = 0; b < 4; b++) { var sx = x - 0.5 + (a + 0.5) / 4 - 400, sy = y - 0.5 + (b + 0.5) / 4 - 400; if (sx * sx + sy * sy < 62500) cov += 1 / 16; } }
    var g = bg;
    if (cov > 0) {
      var px = x - 320, py = y - 290, A = 80 * 80 + 110 * 110 - 250 * 250, B = -2 * (px * 80 + py * 110 + 20 * 250), Cq = px * px + py * py - 400;
      var disc = Math.max(0, B * B - 4 * A * Cq), s1 = (-B + Math.sqrt(disc)) / (2 * A), s2 = (-B - Math.sqrt(disc)) / (2 * A), t = -Infinity;
      if (20 + s1 * 250 >= 0) t = s1; if (20 + s2 * 250 >= 0 && s2 > t) t = s2;
      var lit = t <= 0 ? 255 : t < 0.55 ? 255 + (119 - 255) * t / 0.55 : t < 1 ? 119 + (10 - 119) * (t - 0.55) / 0.45 : 10;
      g = bg * (1 - cov) + lit * cov;
    }
    return Math.round(g) / 255;
  }

  // Two 800 × 800 masks: bounds (the plain shape, sets line length) and field (what goes thick).
  function getField(s, img) {
    if (s.shape === 'wave') return { at: s.waveAt, bounds: null, field: null }; // a moving source: asked point by point, never stored
    var env = img || {}, isImg = s.shape === 'image';
    var key = [s.shape, s.letter, s.size, s.breakUp, s.pattern, s.contrast, s.levels, s.depth, s.font, s.weight, s.stretch, s.lean, s.shiftX, s.shiftY, isImg ? idOf(env.image) : 0, s.shape === 'letter' || s.shape === 'layer' ? idOf(env.rings) : 0].join('|');
    if (cache.key === key) return cache;
    var R = 280 * s.size, i;
    var bounds = new Float32Array(N * N), field = new Float32Array(N * N);
    if (isImg) {
      var at = env.image || sampleAt;
      for (var yy = 0; yy < N; yy++) for (var xx = 0; xx < N; xx++) {
        i = yy * N + xx;
        var v = 1 - at(xx + 0.5, yy + 0.5);
        v = (v - 0.5) * s.contrast + 0.5; v = v < 0 ? 0 : v > 1 ? 1 : v;
        if (s.levels >= 1) v = Math.round(v * s.levels) / s.levels; // posterize: 1 is a hard threshold, 0 leaves it smooth
        field[i] = v; bounds[i] = 1;
      }
    } else {
      // depth > 0 nests K shrinking copies of the shape, each a step brighter: a stepped falloff toward the middle.
      // K is the level count (1 = flat), or 24 for a smooth falloff when levels is 0.
      var depth = s.depth > 0 ? s.depth : 0, K = depth ? (s.levels >= 1 ? s.levels : 24) : 1, R0 = R, acc = new Float32Array(N * N);
      var poly = function (pts) { return ringXs([pts.map(function (p) { return [C + p[0] * R, C + p[1] * R]; })]); };
      var glyph = s.shape === 'letter' && env.rings && env.rings.length ? unitRings(env.rings) : null;
      for (var q = 0; q < K; q++) {
        R = R0 * (1 - depth * q / K);
        var gray = Math.round(255 * (q + 1) / K), xs;
        if (s.shape === 'hexagon') xs = poly([0, 1, 2, 3, 4, 5].map(function (j) { return [Math.sin(j * Math.PI / 3), -Math.cos(j * Math.PI / 3)]; }));
        else if (s.shape === 'ring') xs = bothXs(circleXs(R), circleXs(R * 0.5));
        else if (s.shape === 'peak') xs = poly([[-1.7, 1.2], [0, -0.55], [1.7, 1.2]]);
        else if (s.shape === 'split') xs = poly([[0.25, -3], [3, -3], [3, 3], [-0.25, 3]]);
        else if (s.shape === 'diamond') xs = poly([[0, -1], [1, 0], [0, 1], [-1, 0]]);
        else if (s.shape === 'triangle') xs = poly([[0, -1], [0.95, 0.72], [-0.95, 0.72]]);
        else if (s.shape === 'letter') {
          // the board set the letter at R × 2.5 px in a heavy sans; its capitals stand about 1.8 R. Then stretch, lean, nudge.
          if (!glyph) continue;
          var hgt = R * 1.8, st = s.stretch || 1, ln = Math.tan((s.lean || 0) * Math.PI / 180), ox = C + (s.shiftX || 0) * R0, oy = C + (s.shiftY || 0) * R0;
          xs = ringXs(glyph.map(function (r) { return r.map(function (p) { var gx = p[0] * hgt, gy = p[1] * hgt; return [ox + st * gx - ln * gy, oy + gy]; }); }));
        } else if (s.shape === 'layer') {
          // the port's: the editor layer's own outline (env.rings, any units, y down), fitted into the 2R square the circle fills
          if (!env.rings || !env.rings.length) continue;
          var lb = unitRings(env.rings), lx0 = Infinity, lx1 = -Infinity;
          lb.forEach(function (r) { r.forEach(function (q) { if (q[0] < lx0) lx0 = q[0]; if (q[0] > lx1) lx1 = q[0]; }); });
          var lk = 2 * R / Math.max(1, lx1 - lx0);
          lk = Math.min(2 * R, lk);
          xs = ringXs(lb.map(function (r) { return r.map(function (q) { return [C + q[0] * lk, C + q[1] * lk]; }); }));
        } else xs = circleXs(R);
        cover(acc, xs, gray);
      }
      R = R0;
      for (i = 0; i < N * N; i++) { var dv = Math.round(acc[i]); field[i] = dv / 255; bounds[i] = dv >= 127 / K ? 1 : 0; }
      if (s.breakUp > 0) {
        var cell = Math.max(30, R * 0.3);
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { i = y * N + x; if (field[i] && noise(x / cell, y / cell, s.pattern) < s.breakUp) field[i] = 0; }
      }
    }
    return cache = { key: key, bounds: bounds, field: field };
  }

  function keepPoints(r0, r1, T, B, gap) {
    var keep = [r0], j = r0;
    for (var k = r0 + 1; k < r1; k++) {
      var ok = true;
      for (var m = j + 1; m <= k && ok; m++) {
        var t = (m - j) / (k + 1 - j);
        if (Math.abs(T[j] + (T[k + 1] - T[j]) * t - T[m]) > TOL || Math.abs(B[j] + (B[k + 1] - B[j]) * t - B[m]) > TOL) ok = false;
      }
      if (!ok || (gap && k - j >= gap) || k - j >= 64) { keep.push(k); j = k; } // the 64 cap keeps long straight runs cheap enough to animate
    }
    if (r1 > r0) keep.push(r1);
    return keep;
  }

  function buildPath(s, img) {
    var f0 = getField(s, img), bounds = f0.bounds, field = f0.field, atFn = f0.at || null;
    var BOX = s.shape === 'image' ? 640 : 560, M = BOX + 1, pitch = BOX / s.count;
    var th = s.angle * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    var out = s.thickPart === 'outside', n = Math.round(s.transition), h = n >> 1;
    var r = function (v) { return Math.round(v * 100) / 100; };
    var f = new Float32Array(M), g = new Float32Array(M), W = new Float32Array(M), T = new Float32Array(M), B = new Float32Array(M), pre = new Float32Array(M + 1);
    var d = '', i, k, m;
    // solid: the part of the shape on one side of a straight cut is filled; the lines keep the rest
    var solidOn = s.solid > 0, sph = (s.solidTurn || 0) * Math.PI / 180, scp = Math.cos(sph), ssp = Math.sin(sph), slim = (s.solid * 2 - 1) * 280 * (s.size || 1);
    var inSolid = function (uu2, vv2) { return uu2 * scp + vv2 * ssp < slim; };
    for (i = 0; i < s.count; i++) {
      var v = -BOX / 2 + (i + 0.5) * pitch, k0 = M, k1 = -1;
      for (k = 0; k < M; k++) {
        var u = -BOX / 2 + k, x = Math.round(C + u * cos - v * sin), y = Math.round(C + u * sin + v * cos);
        var inC = x >= 0 && y >= 0 && x < N && y < N, idx = y * N + x, val = atFn ? atFn(C + u * cos - v * sin, C + u * sin + v * cos) : (inC ? field[idx] : 0);
        f[k] = out ? 1 - val : val;
        if (atFn ? val > 0.5 : (inC && bounds[idx] > 0.5)) { if (k < k0) k0 = k; k1 = k; } // for a wave, the filled stretch is the shape
      }
      if (s.keys > 0 && k1 >= 0) { // piano: each line is a block, a narrower block, then a hairline, with its own lengths
        var ksp = Math.max(1, k1 - k0), ksd = s.pattern || 1, kf1 = Math.min(1, s.keys * (0.35 + 0.65 * hash(i, 1, ksd))), kf2 = (1 - kf1) * Math.min(1, s.keys * 0.9 * hash(i, 2, ksd));
        var kfrom = s.keysFrom === 'alternate' ? (i % 2 ? 'end' : 'start') : (s.keysFrom || 'start');
        for (k = 0; k < M; k++) {
          if (k < k0 || k > k1) { f[k] = 0; continue; }
          var tk = (k - k0) / ksp; if (kfrom === 'end') tk = 1 - tk; else if (kfrom === 'middle') tk = Math.abs(tk - 0.5) * 2;
          f[k] = tk < kf1 ? 1 : tk < kf1 + kf2 ? 0.5 : 0;
        }
      }
      var a = 0, b = M - 1;
      if (s.length === 'shape') { if (k1 < 0) continue; a = Math.max(0, k0 - s.overhang); b = Math.min(M - 1, k1 + s.overhang); }
      if (n > 1) { // box filter along the line: a hard edge becomes a straight ramp of that length
        for (k = 0; k < M; k++) pre[k + 1] = pre[k] + f[k];
        for (k = 0; k < M; k++) {
          var lo = k - h, hi = k + h;
          var sum = pre[Math.min(M, hi + 1)] - pre[Math.max(0, lo)] + (lo < 0 ? -lo * f[0] : 0) + (hi > M - 1 ? (hi - M + 1) * f[M - 1] : 0);
          var t = sum / (2 * h + 1); g[k] = s.curve === 'swell' ? t * t * (3 - 2 * t) : t;
        }
      } else g.set(f);
      if (s.effect < 1) for (k = 0; k < M; k++) g[k] = 0.5 + (g[k] - 0.5) * s.effect; // master: 0 is every line at the same middle weight
      for (k = 0; k < M; k++) W[k] = k < a || k > b ? 0 : (s.thin + (s.thick - s.thin) * g[k]) * pitch;
      if (s.taper && k1 >= 0) { // taper: weight runs down to a point across the shape; negative flips the direction
        var span = Math.max(1, k1 - k0);
        for (k = k0; k <= k1; k++) { var tt = (k - k0) / span; if (s.taper < 0) tt = 1 - tt; W[k] *= 1 - Math.abs(s.taper) * tt; }
      }
      if (solidOn) for (k = a; k <= b; k++) if ((k - BOX / 2) * scp + v * ssp < slim + (s.solidGap || 0)) W[k] = 0; // solidGap pulls the lines back from the cut
      if (s.dash > 0) { // dash: the line breaks into segments, longer where the field is stronger; odd lines sit half a step over
        for (k = a; k <= b; k++) { var ph = ((k + (i % 2) * s.dash / 2) % s.dash) / s.dash; if (ph >= 0.12 + 0.88 * g[k]) W[k] = 0; }
      }
      var P = s.world
        ? function (q, t) { var uu = q - BOX / 2; return r(uu * cos - t * sin) + ' ' + r(uu * sin + t * cos); }
        : function (q, t) { return (q - BOX / 2) + ' ' + r(t); };
      for (k = a; k <= b; k++) { // each run of ink becomes one closed outline
        if (W[k] < 0.05) continue;
        var r0 = k; while (k < b && W[k + 1] >= 0.05) k++; var r1 = k;
        for (m = r0; m <= r1; m++) {
          var w = W[m];
          if (s.ends === 'round') { var dist = Math.min(m - r0, r1 - m) + 0.5, rad = w / 2; if (dist < rad) w *= Math.sqrt(1 - Math.pow(1 - dist / rad, 2)); }
          var c = v + s.shift * pitch * g[m] - (s.growFrom === 'base' ? (W[m] - s.thin * pitch) / 2 : 0);
          T[m] = c - w / 2; B[m] = c + w / 2;
        }
        var kp = keepPoints(r0, r1, T, B);
        d += 'M' + kp.map(function (q) { return P(q, T[q]); }).join('L') +
             'L' + kp.reverse().map(function (q) { return P(q, B[q]); }).join('L') + 'Z';
      }
    }
    if (solidOn) { // the fill, as one-pixel rows inside the true outline, in the same path so no seams show
      var PS = s.world ? function (uu3, t) { return r(uu3 * cos - t * sin) + ' ' + r(uu3 * sin + t * cos); } : function (uu3, t) { return r(uu3) + ' ' + r(t); };
      for (var row = -BOX / 2; row < BOX / 2; row++) {
        var run = -1;
        for (k = 0; k <= M; k++) {
          var on = false;
          if (k < M) { var su = k - BOX / 2, sx = Math.round(C + su * cos - (row + 0.5) * sin), sy = Math.round(C + su * sin + (row + 0.5) * cos);
            on = sx >= 0 && sy >= 0 && sx < N && sy < N && (atFn ? atFn(C + su * cos - (row + 0.5) * sin, C + su * sin + (row + 0.5) * cos) > 0.5 : bounds[sy * N + sx] > 0.5) && inSolid(su, row + 0.5); }
          if (on && run < 0) run = k;
          if (!on && run >= 0) { var ua = run - BOX / 2 - 0.5, ub = k - BOX / 2 - 0.5;
            d += 'M' + PS(ua, row - 0.1) + 'L' + PS(ub, row - 0.1) + 'L' + PS(ub, row + 1.1) + 'L' + PS(ua, row + 1.1) + 'Z'; run = -1; }
        }
      }
    }
    return d;
  }

  // ---------- the master board: one unit, either source, every preset ----------
  // A preset is the base. Every tweak adjusts that base and is neutral at its default, so no slider is ever dead.
  function ext() { var o = {}; for (var a = 0; a < arguments.length; a++) for (var k in arguments[a]) o[k] = arguments[a][k]; return o; }
  var ON_SHAPE = { shape: 'circle', letter: 'R', size: 0.92, thickPart: 'inside' };
  var MASTER = {
    sun:       ext(PRESETS.Sun, { depth: 0, levels: 0 }),
    blinds:    ext(PRESETS.Blinds, { depth: 0, levels: 1 }),
    steps:     ext(PRESETS.Steps, { depth: 0, levels: 1 }),
    keys:      ext(PRESETS.Keys, { depth: 0, levels: 1 }),
    hex:       ext(PRESETS.Hex, { depth: 0, levels: 1 }),
    ridge:     ext(PRESETS.Ridge, { depth: 0, levels: 3 }),
    glyph:     ext(PRESETS.Glyph, { depth: 0, levels: 1 }),
    pulse:     ext(PRESETS.Pulse, { depth: 0, levels: 1 }),
    lines:     ext(PRESETS.Image, ON_SHAPE, { depth: 0.85, levels: 0 }),
    relief:    ext(PRESETS.Relief, ON_SHAPE, { depth: 0.85, levels: 3 }),
    inverted:  ext(PRESETS.Inverted, ON_SHAPE, { depth: 0, levels: 1 }),
    telescope: ext(PRESETS.Image, STYLES.telescope, ON_SHAPE, { size: 0.95, depth: 0.75, levels: 3 }),
    taper:     ext(PRESETS.Hex, { depth: 0, levels: 1, taper: 1, ends: 'square', thick: 0.8, count: 14 }),
    dash:      ext(PRESETS.Sun, { breakUp: 0, depth: 0.85, levels: 0, count: 20, thin: 0.5, thick: 0.5, transition: 0, length: 'frame', ends: 'round', dash: 30 }),
    half:      ext(PRESETS.Hex, { depth: 0, levels: 1, angle: 0, ends: 'square', thin: 0, thick: 0.5, count: 14, solid: 0.5, solidTurn: 0, ink: '#fafafa', ground: '#35363a' }),
    piano:     ext(PRESETS.Blinds, { depth: 0, levels: 1, shape: 'triangle', size: 0.95, count: 13, thin: 0.06, thick: 0.72, length: 'shape', overhang: 36, transition: 0, keys: 0.7, keysFrom: 'start', pattern: 4, ink: '#fafafa', ground: '#35363a' })
  };
  var PALETTES = {
    'ink on paper': ['#111111', '#f4f4f4'], 'paper on ink': ['#ffffff', '#000000'], 'white on blue': ['#ffffff', '#0a1fff'],
    'blue on paper': ['#0a1fff', '#f1f1f1'], 'red on ink': ['#e5303f', '#111111'], 'light on grey': ['#fafafa', '#35363a']
  };
  // the board drew the source as a picture for its "view original"; the port has no view: 29.3 lists it
  // Swell's preset boards (swell-02 to swell-08), carried verbatim; the port has no picture of the source, so `original` draws nothing
  // props: the board's tweak values. name: the preset whose values fill anything not set. img: an Image, for the image board.
  function vals(props, name, img) {
    var base = PRESETS[name] || PRESETS.Sun, s = {}, k;
    props = props || {};
    for (k in base) { var p = props[k]; s[k] = p === undefined || p === null || p === '' ? base[k] : (typeof base[k] === 'number' ? +p : p); }
    // The image board's preset tweak: anything but custom overrides the style sliders. Effect, view, contrast, angle stay live.
    var style = s.shape === 'image' && props.preset && props.preset !== 'custom' ? STYLES[props.preset] : null;
    if (style) for (k in style) s[k] = style[k];
    if (s.darkAreas) s.thickPart = s.darkAreas === 'thin' ? 'outside' : 'inside';
    s.count = Math.max(1, Math.round(s.count));
    if (s.levels !== undefined) s.levels = Math.max(0, Math.round(s.levels));
    var d = '', src = '', original = s.view === 'original';
    try { if (original) src = sourceURL(img); else d = buildPath(s, img); } catch (e) { d = ''; }
    return { d: d, rot: 'translate(600 400) rotate(' + s.angle + ')', ink: s.ink, ground: s.ground, src: src, showOriginal: original };
  }

  function fieldURL() { return ''; }
  function sourceURL() { return ''; }

  function master(props, img) {
    props = roll('master', props);
    var p = props || {}, base = MASTER[p.preset] || MASTER.sun, vn = Math.round(+p.variant) || 0;
    if (vn > 0 && VARIANTS[p.preset]) base = ext(base, VARIANTS[p.preset][(vn - 1) % 24]); // a sheet tile as the base; offsets still apply
    var s = ext(base);
    var num = numOf(p);
    var pickOr = function (k) { return p[k] && p[k] !== 'preset' ? p[k] : base[k]; };
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    s.darkAreas = undefined;
    s.shape = p.source === 'image' ? 'image' : p.source === 'wave' ? 'wave' : pickOr('shape');
    if (p.letter && String(p.letter).trim() && s.shape !== 'image' && s.shape !== 'wave') { s.letter = String(p.letter).trim(); s.shape = 'letter'; } // a typed letter is the shape
    s.size = clamp(base.size * num('size', 1), 0.1, 1.6);
    s.font = p.letterFont; s.weight = num('letterWeight', 900); s.stretch = num('letterStretch', 1); s.lean = num('letterLean', 0); s.shiftX = num('letterX', 0); s.shiftY = num('letterY', 0);
    s.breakUp = clamp(base.breakUp + num('breakUp', 0), 0, 0.8);
    s.pattern = base.pattern + Math.round(num('pattern', 0));
    s.depth = clamp(base.depth + num('depth', 0), 0, 1);
    s.levels = !p.levels || p.levels === 'preset' ? base.levels : p.levels === 'smooth' ? 0 : Math.max(0, Math.round(+p.levels) || 0);
    if (p.invert === true || p.invert === 'true') s.thickPart = base.thickPart === 'outside' ? 'inside' : 'outside';
    s.contrast = num('contrast', 1.4); s.effect = clamp(num('effect', 1), 0, 1); s.view = p.view || 'effect';
    if (s.shape === 'wave') s.waveAt = waveField(p, num, clamp, s.depth, s.levels);
    s.count = clamp(Math.round(base.count * num('density', 1)), 1, 160);
    s.angle = (((base.angle + num('angle', 0)) % 180) + 180) % 180;
    s.thin = clamp(base.thin + num('thin', 0), 0, 1);
    s.thick = clamp(base.thick + num('thick', 0), 0, 1);
    s.length = pickOr('length'); s.ends = pickOr('ends'); s.curve = pickOr('curve'); s.growFrom = pickOr('growFrom');
    s.overhang = Math.max(0, base.overhang + Math.round(num('overhang', 0)));
    s.transition = clamp(base.transition + num('transition', 0), 0, 240);
    s.shift = base.shift + num('shift', 0);
    s.taper = clamp((base.taper || 0) + num('taper', 0), -1, 1);
    s.dash = Math.max(0, (base.dash || 0) + Math.round(num('dash', 0)));
    s.solid = clamp((base.solid || 0) + num('solid', 0), 0, 1);
    s.solidTurn = (base.solidTurn || 0) + num('solidTurn', 0);
    s.solidGap = Math.max(0, (base.solidGap || 0) + Math.round(num('solidGap', 0)));
    // a handle dragged on the board sends absolute values, which win over the sliders until it is reset
    if (p.solidAbs !== undefined && p.solidAbs !== null) { s.solid = clamp(+p.solidAbs, 0, 1); s.solidTurn = +p.solidTurnAbs || 0; }
    s.keys = clamp((base.keys || 0) + num('keys', 0), 0, 1);
    s.keysFrom = p.keysFrom && p.keysFrom !== 'preset' ? p.keysFrom : (base.keysFrom || 'start');
    var pal = PALETTES[p.palette];
    if (pal) { s.ink = pal[0]; s.ground = pal[1]; }
    else if (p.palette === 'custom') { s.ink = p.ink || base.ink; s.ground = p.ground || base.ground; }
    var d = '', src = '', original = s.view === 'original';
    try { if (original) src = s.shape === 'image' ? sourceURL(img) : fieldURL(s); else d = buildPath(s, img); } catch (e) { d = ''; }
    // where the solid cut sits on the board, for the two drag handles
    var cth = s.angle * Math.PI / 180, cph = s.solidTurn * Math.PI / 180, cR = 280 * s.size, clim = (s.solid * 2 - 1) * cR, cnx = Math.cos(cth + cph), cny = Math.sin(cth + cph);
    var cut = { on: s.solid > 0, nx: cnx, ny: cny, fx: cnx * clim, fy: cny * clim, R: cR, theta: s.angle, solid: s.solid, turn: s.solidTurn,
      presetSolid: base.solid || 0, presetTurn: base.solidTurn || 0, hx: 600 + cnx * clim, hy: 400 + cny * clim, tx: 600 + cnx * clim - cny * 110, ty: 400 + cny * clim + cnx * 110 };
    return { d: d, rot: 'translate(600 400) rotate(' + s.angle + ')', ink: s.ink, ground: s.ground, src: src, showOriginal: original, cut: cut };
  }

  // ---------- the group: Warp, Radial, Moire. Same source, field and color block as Swell; each its own geometry ----------
  var TAU = Math.PI * 2;
  function r2(v) { return Math.round(v * 100) / 100; }
  function setup(props, img, dflt) {
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var s = {
      shape: p.source === 'image' ? 'image' : (p.shape || dflt.shape), letter: p.letter ? String(p.letter) : 'R',
      size: clamp(num('size', dflt.size), 0.1, 1.6), breakUp: 0, pattern: 1, depth: clamp(num('depth', dflt.depth || 0), 0, 1),
      levels: !p.levels || p.levels === 'smooth' ? 0 : Math.max(0, Math.round(+p.levels) || 0), contrast: num('contrast', 1.4)
    };
    var pal = PALETTES[p.palette] || PALETTES[dflt.palette], custom = p.palette === 'custom';
    var inv = p.invert === true || p.invert === 'true', f = getField(s, img), field = f.field;
    return {
      p: p, s: s, num: num, clamp: clamp, f: f, inv: inv, img: img,
      ink: custom ? (p.ink || pal[0]) : pal[0], ground: custom ? (p.ground || pal[1]) : pal[1],
      e: clamp(num('effect', 1), 0, 1), original: p.view === 'original',
      at: function (x, y) { x = Math.round(x); y = Math.round(y); var v = x >= 0 && y >= 0 && x < N && y < N ? field[y * N + x] : 0; return inv ? 1 - v : v; }
    };
  }
  function finish(c, d) {
    var src = '';
    if (c.original) { d = ''; try { src = c.s.shape === 'image' ? sourceURL(c.img) : fieldURL(c.s); } catch (e) { src = ''; } }
    return { d: d, rot: 'translate(600 400)', ink: c.ink, ground: c.ground, src: src, showOriginal: c.original };
  }
  function ribbon(r0, r1, T, B, pos, gap) {
    var kp = keepPoints(r0, r1, T, B, gap);
    return 'M' + kp.map(function (q) { return pos(q, T[q]); }).join('L') + 'L' + kp.reverse().map(function (q) { return pos(q, B[q]); }).join('L') + 'Z';
  }
  function smooth(f, M, n, wrap, swell) { // box filter along a line or around a ring
    var g = new Float32Array(M), h = n >> 1, k, j;
    for (k = 0; k < M; k++) {
      var t = f[k];
      if (n > 1) { t = 0; for (j = -h; j <= h; j++) { var q = k + j; q = wrap ? ((q % M) + M) % M : q < 0 ? 0 : q > M - 1 ? M - 1 : q; t += f[q]; } t /= 2 * h + 1; }
      g[k] = swell ? t * t * (3 - 2 * t) : t;
    }
    return g;
  }
  // A 100 × 100 blurred copy of the field, so Warp bends around a soft edge instead of a hard one.
  function softField(c, soft) {
    var key = 'soft' + soft; if (c.f[key]) return c.f[key];
    var G = 100, cell = N / G, a = new Float32Array(G * G), b = new Float32Array(G * G), x, y, i, j, pass, field = c.f.field;
    for (y = 0; y < G; y++) for (x = 0; x < G; x++) { var t = 0; for (j = 1; j < cell; j += 2) for (i = 1; i < cell; i += 2) t += field[(y * cell + j) * N + x * cell + i]; a[y * G + x] = t / 16; }
    for (pass = 0; pass < 3; pass++) {
      for (y = 0; y < G; y++) for (x = 0; x < G; x++) { t = 0; for (i = -soft; i <= soft; i++) { var q = x + i; t += a[y * G + (q < 0 ? 0 : q > G - 1 ? G - 1 : q)]; } b[y * G + x] = t / (2 * soft + 1); }
      for (y = 0; y < G; y++) for (x = 0; x < G; x++) { t = 0; for (i = -soft; i <= soft; i++) { q = y + i; t += b[(q < 0 ? 0 : q > G - 1 ? G - 1 : q) * G + x]; } a[y * G + x] = t / (2 * soft + 1); }
    }
    return c.f[key] = a;
  }
  function softAt(a, x, y) {
    var G = 100, gx = x / 8 - 0.5, gy = y / 8 - 0.5;
    gx = gx < 0 ? 0 : gx > G - 1.001 ? G - 1.001 : gx; gy = gy < 0 ? 0 : gy > G - 1.001 ? G - 1.001 : gy;
    var ix = Math.floor(gx), iy = Math.floor(gy), fx = gx - ix, fy = gy - iy, o = iy * G + ix;
    return (a[o] * (1 - fx) + a[o + 1] * fx) * (1 - fy) + (a[o + G] * (1 - fx) + a[o + G + 1] * fx) * fy;
  }

  // Warp: lines of one weight that bend around the shape. bend > 0 pushes them out of it, bend < 0 pulls them in.
  function warp(props, img) {
    props = roll('warp', props);
    var c = setup(props, img, { shape: 'circle', size: 0.8, palette: 'ink on paper' });
    if (c.original) return finish(c, '');
    var num = c.num, count = c.clamp(Math.round(num('count', 26)), 2, 120), th = num('angle', 0) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    var BOX = 560, M = BOX + 1, pitch = BOX / count, weight = c.clamp(num('weight', 0.3), 0.02, 1), swell = num('swell', 0) * c.e;
    var bend = num('bend', 2.5) * c.e, soft = c.clamp(Math.round(num('softness', 4)), 1, 10), wave = num('wave', 0), wl = c.clamp(num('wavelength', 400), 40, 2000);
    var sm = softField(c, soft), reach = 24 + soft * 6, sign = c.inv ? -1 : 1, wphase = num('phase', 0);
    var T = new Float32Array(M), B = new Float32Array(M), Cn = new Float32Array(M), Wd = new Float32Array(M), d = '', i, k;
    var pos = function (q, off) { var u = q - BOX / 2; return r2(u * cos - off * sin) + ' ' + r2(u * sin + off * cos); };
    for (i = 0; i < count; i++) {
      var v = -BOX / 2 + (i + 0.5) * pitch;
      for (k = 0; k < M; k++) {
        var u = -BOX / 2 + k, px = C + u * cos - v * sin, py = C + u * sin + v * cos;
        var f1 = softAt(sm, px - sin * reach, py + cos * reach), f0 = softAt(sm, px + sin * reach, py - cos * reach), fc = softAt(sm, px, py);
        Cn[k] = v - bend * pitch * (f1 - f0) * sign + wave * pitch * Math.sin(TAU * (u / wl + wphase) + i * 0.35);
        Wd[k] = (weight + swell * (c.inv ? 1 - fc : fc)) * pitch;
      }
      for (k = 0; k < M; k++) { // keep the weight true across the slope
        var slope = (Cn[k < M - 1 ? k + 1 : k] - Cn[k > 0 ? k - 1 : k]) / (k > 0 && k < M - 1 ? 2 : 1);
        var half = Wd[k] / 2 * Math.min(3, Math.sqrt(1 + slope * slope));
        T[k] = Cn[k] - half; B[k] = Cn[k] + half;
      }
      d += ribbon(0, M - 1, T, B, pos);
    }
    return finish(c, d);
  }

  // Radial: the swell on concentric rings or on spokes.
  function radial(props, img) {
    props = roll('radial', props);
    var c = setup(props, img, { shape: 'split', size: 1, palette: 'paper on ink' });
    if (c.original) return finish(c, '');
    var num = c.num, spokes = c.p.mode === 'spokes', count = c.clamp(Math.round(num('count', spokes ? 48 : 14)), 2, 160);
    var thin = c.clamp(num('thin', 0.08), 0, 1), thick = c.clamp(num('thick', 0.7), 0, 1), n = Math.round(c.clamp(num('transition', 40), 0, 240));
    var swell = c.p.curve !== 'bevel', rot = num('angle', 0) * Math.PI / 180, RMAX = 280, hole = c.clamp(num('hole', 0.1), 0, 0.9), d = '', dh = '', j, k, M, f, g, T, B, W;
    var weights = function (unit) {
      W = new Float32Array(M); T = new Float32Array(M); B = new Float32Array(M);
      for (k = 0; k < M; k++) W[k] = (thin + (thick - thin) * (0.5 + (g[k] - 0.5) * c.e)) * unit;
    };
    if (!spokes) {
      var pitch = RMAX * (1 - hole) / count;
      for (j = 0; j < count; j++) {
        var rad = RMAX * hole + (j + 0.5) * pitch; M = Math.max(48, Math.ceil(TAU * rad)); f = new Float32Array(M);
        for (k = 0; k < M; k++) { var a = rot + TAU * k / M; f[k] = c.at(C + rad * Math.cos(a), C + rad * Math.sin(a)); }
        g = smooth(f, M, n, true, swell); weights(pitch);
        var whole = true; for (k = 0; k < M; k++) { T[k] = rad - W[k] / 2; B[k] = rad + W[k] / 2; if (W[k] < 0.05) whole = false; }
        var pos = (function (M2) { return function (q, off) { var a2 = rot + TAU * q / M2; return r2(off * Math.cos(a2)) + ' ' + r2(off * Math.sin(a2)); }; })(M);
        var gap = Math.max(1, Math.floor(M / 120));
        if (whole) { // a closed ring: outer edge one way, inner edge the other, so the middle stays open
          var kp = keepPoints(0, M - 1, T, B, gap);
          dh += 'M' + kp.map(function (q) { return pos(q, B[q]); }).join('L') + 'Z' + 'M' + kp.reverse().map(function (q) { return pos(q, T[q]); }).join('L') + 'Z';
        } else for (k = 0; k < M; k++) { if (W[k] < 0.05) continue; var r0 = k; while (k < M - 1 && W[k + 1] >= 0.05) k++; d += ribbon(r0, k, T, B, pos, gap); }
      }
    } else {
      var rIn = RMAX * hole, unit = TAU * RMAX * 0.6 / count; M = Math.round(RMAX - rIn) + 1;
      for (j = 0; j < count; j++) {
        var an = rot + TAU * j / count, ca = Math.cos(an), sa = Math.sin(an); f = new Float32Array(M);
        for (k = 0; k < M; k++) f[k] = c.at(C + (rIn + k) * ca, C + (rIn + k) * sa);
        g = smooth(f, M, n, false, swell); weights(unit);
        for (k = 0; k < M; k++) { T[k] = -W[k] / 2; B[k] = W[k] / 2; }
        var posS = (function (ca2, sa2) { return function (q, off) { var rr = rIn + q; return r2(rr * ca2 - off * sa2) + ' ' + r2(rr * sa2 + off * ca2); }; })(ca, sa);
        for (k = 0; k < M; k++) { if (W[k] < 0.05) continue; var s0 = k; while (k < M - 1 && W[k + 1] >= 0.05) k++; d += ribbon(s0, k, T, B, posS); }
      }
    }
    // port: a whole ring (outer edge and its hole) comes back on its own, so the engine keeps it one shape with a hole
    var out = finish(c, d); out.dh = c.original ? '' : dh; return out;
  }

  // Moire: two sets of even lines a few degrees apart. The second set jogs where it crosses the shape, and the shape shows in the interference.
  function moire(props, img) {
    props = roll('moire', props);
    var c = setup(props, img, { shape: 'circle', size: 0.8, palette: 'white on blue' });
    if (c.original) return finish(c, '');
    var num = c.num, count = c.clamp(Math.round(num('count', 48)), 2, 120), w = c.clamp(num('weight', 0.3), 0.02, 1), ang = num('angle', 0);
    var base = ext(c.s, { world: true, thickPart: c.inv ? 'outside' : 'inside', thin: w, thick: w, length: 'frame', overhang: 0, ends: 'square',
      transition: c.clamp(num('transition', 60), 0, 240), curve: c.p.curve === 'bevel' ? 'bevel' : 'swell', growFrom: 'center', effect: 1 });
    var d = '';
    try {
      d = buildPath(ext(base, { count: count, angle: ang, shift: 0 }), img) +
          buildPath(ext(base, { count: c.clamp(Math.round(count * num('ratio', 1.06)), 2, 160), angle: ang + num('spread', 0), shift: num('push', 0.6) * c.e }), img);
    } catch (e) { d = ''; }
    return finish(c, d);
  }

  // Pinch: even lines pulled into poles, then fanning back out. The poles are the shape, so it takes no source.
  function pinch(props) {
    props = roll('pinch', props);
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var count = clamp(Math.round(num('count', 17)), 2, 120), th = num('angle', 0) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    var BOX = 560, H = BOX / 2, M = BOX + 1, pitch = BOX / count, w = clamp(num('weight', 0.3), 0.02, 1) * pitch;
    var poles = clamp(Math.round(num('poles', 2)), 1, 4), px = clamp(p.positionAbs !== undefined && p.positionAbs !== null ? +p.positionAbs : num('position', -0.3), -1, 1) * H;
    var st = clamp(num('strength', 1), 0, 1) * clamp(num('effect', 1), 0, 1);
    var gl = clamp(num('gather', 0.3), 0.02, 2) * BOX, gr = clamp(num('release', 0.9), 0.02, 2) * BOX, fan = clamp(num('fan', 1.8), 0, 4);
    var pal = PALETTES[p.palette] || PALETTES['paper on ink'], custom = p.palette === 'custom';
    var T = new Float32Array(M), B = new Float32Array(M), Cn = new Float32Array(M), d = '', i, k;
    var pos = function (q, off) { var u = q - H; return r2(u * cos - off * sin) + ' ' + r2(u * sin + off * cos); };
    for (i = 0; i < count; i++) {
      var v0 = -H + (i + 0.5) * pitch, j = Math.min(poles - 1, Math.floor((v0 + H) / (BOX / poles))), py = -H + (j + 0.5) * BOX / poles;
      // only lines on the outer side of their pole fan, so neighbouring groups never cross; the fan fades with strength
      var outer = Math.abs(py) < 1 || (v0 - py) * py > 0, fanI = outer ? 1 + (fan - 1) * st : 1;
      for (k = 0; k < M; k++) {
        var dx = -H + k - px, base = v0, t;
        if (dx <= 0) t = clamp(1 + dx / gl, 0, 1);
        else { t = clamp(1 - dx / gr, 0, 1); var pr = clamp(dx / Math.max(1, H - px), 0, 1); pr = pr * pr * (3 - 2 * pr); base = v0 + (v0 - py) * (fanI - 1) * pr; }
        Cn[k] = base + (py - base) * st * t * t * (3 - 2 * t);
      }
      for (k = 0; k < M; k++) { // true weight across the slope, cut flat at the edge of the square
        var slope = (Cn[k < M - 1 ? k + 1 : k] - Cn[k > 0 ? k - 1 : k]) / (k > 0 && k < M - 1 ? 2 : 1);
        var half = w / 2 * Math.min(3, Math.sqrt(1 + slope * slope));
        T[k] = Math.max(-H, Cn[k] - half); B[k] = Math.min(H, Cn[k] + half);
      }
      for (k = 0; k < M; k++) { if (B[k] - T[k] < 0.05) continue; var r0 = k; while (k < M - 1 && B[k + 1] - T[k + 1] >= 0.05) k++; d += ribbon(r0, k, T, B, pos); }
    }
    var py0 = -H + 0.5 * BOX / poles; // the first pole, for the drag handle
    return { d: d, rot: 'translate(600 400)', ink: custom ? (p.ink || pal[0]) : pal[0], ground: custom ? (p.ground || pal[1]) : pal[1], src: '', showOriginal: false,
      pole: { hx: 600 + px * cos - py0 * sin, hy: 400 + px * sin + py0 * cos, cos: cos, sin: sin, H: H, position: px / H } };
  }

  // Flow: two to five heavy bands that follow one path. The path is the shape, so it takes no source.
  function flow(props) {
    props = roll('flow', props);
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var n = clamp(Math.round(num('bands', 3)), 1, 8), path = p.path || 'wave', th = num('angle', 0) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    var BOX = 480, H = BOX / 2, M = BOX + 1, pitch = BOX / n, w = clamp(num('weight', 0.6), 0.05, 1) * pitch, mid = (n - 1) / 2;
    var amp = num('amplitude', 0.35) * pitch * clamp(num('effect', 1), 0, 1), st = clamp(num('stretch', 480), 40, 2000);
    var stag = clamp(num('stagger', 0), 0, 1), ends = p.ends || 'square', seed = Math.round(num('seed', 0)), drift = num('drift', 0), fphase = num('phase', 0);
    var pal = PALETTES[p.palette] || PALETTES['light on grey'], custom = p.palette === 'custom';
    var T = new Float32Array(M), B = new Float32Array(M), Cn = new Float32Array(M), d = '', i, k;
    var pos = function (q, off) { var u = q - H; return r2(u * cos - off * sin) + ' ' + r2(u * sin + off * cos); };
    for (i = 0; i < n; i++) {
      var v0 = -H + (i + 0.5) * pitch, ka = 0, kb = M - 1;
      if (stag > 0) { // stagger: with no seed, alternate bands are cut short at opposite ends; a seed cuts each band by its own amount
        if (seed > 0) { ka = Math.round(stag * BOX * 0.6 * hash(i, 1, seed)); kb = M - 1 - Math.round(stag * BOX * 0.6 * hash(i, 2, seed)); }
        else if (i % 2) ka = Math.round(stag * BOX * 0.5); else kb = M - 1 - Math.round(stag * BOX * 0.5);
      }
      for (k = 0; k < M; k++) {
        var u = -H + k, t, c;
        if (path === 'step') { t = clamp((u - drift * (i - mid) * st * 0.3) / st + 0.5, 0, 1); t = t * t * (3 - 2 * t); c = v0 + amp * (1 - 2 * t); }
        else if (path === 'bulge') c = v0 + amp * Math.exp(-u * u / (2 * Math.pow(st / 2.5, 2))) * (mid ? (i - mid) / mid : 0);
        else if (path === 'cross') { t = clamp((u - drift * (i - mid) * st * 0.3) / st + 0.5, 0, 1); t = t * t * (3 - 2 * t); c = v0 - 2 * v0 * t; }
        else c = v0 + amp * Math.sin(TAU * (u / st + fphase) + drift * i * 0.8);
        Cn[k] = c;
      }
      for (k = 0; k < M; k++) {
        var slope = (Cn[k < M - 1 ? k + 1 : k] - Cn[k > 0 ? k - 1 : k]) / (k > 0 && k < M - 1 ? 2 : 1);
        var half = w / 2 * Math.min(1.6, Math.sqrt(1 + slope * slope));
        T[k] = Cn[k] - half; B[k] = Cn[k] + half;
      }
      for (k = ka; k <= kb; k++) { // band ends: a slant closes one edge onto the other, a round end is a half circle
        var da = k - ka + 0.5, db = kb - k + 0.5, full = B[k] - T[k], cut = w * 0.9, rad = w / 2;
        if (ends === 'slant') { if (da < cut) T[k] = B[k] - full * da / cut; if (db < cut) B[k] = T[k] + (B[k] - T[k]) * db / cut; }
        else if (ends === 'round') { var dd = Math.min(da, db); if (dd < rad) { var sc = Math.sqrt(1 - Math.pow(1 - dd / rad, 2)), cc = (T[k] + B[k]) / 2; T[k] = cc - full / 2 * sc; B[k] = cc + full / 2 * sc; } }
      }
      d += ribbon(ka, kb, T, B, pos);
    }
    return { d: d, rot: 'translate(600 400)', ink: custom ? (p.ink || pal[0]) : pal[0], ground: custom ? (p.ground || pal[1]) : pal[1], src: '', showOriginal: false };
  }
  // 24 seeded Flow combinations for scanning. Each caption is the full recipe, to type into fx-05-flow.
  var flowCache = null;
  function flowVariants() {
    if (flowCache) return flowCache;
    flowCache = [];
    for (var n = 1; n <= 24; n++) {
      var h = (function (n2) { return function (j) { return hash(n2, j, 17); }; })(n);
      var path = ['wave', 'step', 'bulge', 'cross'][Math.floor(h(1) * 4)], bands = path === 'cross' ? 2 : 2 + Math.floor(h(2) * 3);
      var q = { path: path, bands: bands, weight: Math.round((path === 'cross' ? 0.3 + 0.2 * h(3) : 0.4 + 0.25 * h(3)) * 20) / 20,
        amplitude: Math.round((path === 'step' ? 0.3 + 0.4 * h(4) : path === 'bulge' ? 0.3 + 0.3 * h(4) : 0.15 + 0.25 * h(4)) * 20) / 20,
        stretch: (path === 'wave' ? 320 : 240) + Math.round(h(5) * 24) * 10, stagger: h(6) < 0.4 ? 0 : Math.round((0.2 + 0.5 * h(7)) * 20) / 20,
        ends: ['square', 'slant', 'round'][Math.floor(h(8) * 3)], drift: h(9) < 0.5 ? 0 : Math.round(h(10) * 10) / 10,
        angle: h(11) < 0.65 ? 0 : [30, 60, 90, 120, 150][Math.floor(h(12) * 5)] };
      q.seed = q.stagger && h(13) > 0.5 ? n : 0;
      var v = flow(q), id = 'flow-' + (n < 10 ? '0' : '') + n;
      flowCache.push({ label: id + ': ' + q.path + ', ' + q.bands + ' bands, weight ' + q.weight + ', amplitude ' + q.amplitude + ', stretch ' + q.stretch +
        ', stagger ' + q.stagger + ', ' + q.ends + ' ends, drift ' + q.drift + ', seed ' + q.seed + ', angle ' + q.angle,
        d: v.d, rot: v.rot.replace('translate(600 400)', 'translate(240 160) scale(0.4)'), ink: v.ink, ground: v.ground, q: q });
    }
    return flowCache;
  }

  // Rotor: one unit repeated around a center, in one or more rings. The unit is the shape, so it takes no source.
  function rotor(props) {
    props = roll('rotor', props);
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var unit = p.unit || 'sector', count = clamp(Math.round(num('count', 8)), 1, 96), rings = clamp(Math.round(num('rings', 1)), 1, 6);
    var RM = 280, rin = clamp(num('inner', 0.25), 0, 0.98) * RM, rout = Math.max(rin + 4, clamp(num('outer', 1), 0.05, 1) * RM);
    var width = clamp(num('width', 0.6), 0.02, 1), taper = clamp(num('taper', 0), -1, 1), twist = num('twist', 40) * Math.PI / 180 * clamp(num('effect', 1), 0, 1);
    var gap = clamp(num('gap', 0.15), 0, 0.9), shift = num('shift', 0), rot = num('angle', 0) * Math.PI / 180, band = (rout - rin) / rings, S = 20, d = '', q, j, i;
    var pal = PALETTES[p.palette] || PALETTES['light on grey'], custom = p.palette === 'custom';
    var pt = function (rr, a) { return r2(rr * Math.cos(a)) + ' ' + r2(rr * Math.sin(a)); };
    var tw = function (rr) { return twist * (rr - rin) / (rout - rin); };
    var fT = function (t) { return taper >= 0 ? 1 - taper * (1 - t) : 1 + taper * t; };
    for (q = 0; q < rings; q++) {
      var ra = rin + q * band, rb = ra + band * (rings > 1 ? 1 - gap : 1), rmid = (ra + rb) / 2;
      for (j = 0; j < count; j++) {
        var a0 = rot - Math.PI / 2 + TAU * (j + q * shift) / count, pts = [];
        if (unit === 'dot') {
          var rad = Math.min((rb - ra) / 2, width * Math.PI * rmid / count), cx = rmid * Math.cos(a0 + tw(rmid)), cy = rmid * Math.sin(a0 + tw(rmid));
          for (i = 0; i < 28; i++) pts.push(r2(cx + rad * Math.cos(TAU * i / 28)) + ' ' + r2(cy + rad * Math.sin(TAU * i / 28)));
          d += 'M' + pts.join('L') + 'Z'; continue;
        }
        var ha = function (t, rr) {
          if (unit === 'petal') return width * Math.PI / count * Math.pow(Math.sin(Math.PI * t), 0.75);
          if (unit === 'bar') return Math.min(Math.PI / count, width * Math.PI * rmid / count * fT(t) / Math.max(rr, 1));
          return width * Math.PI / count * fT(t);
        };
        var right = [], hOut = ha(1, rb), hIn = ha(0, ra), steps;
        for (i = 0; i <= S; i++) { var t = i / S, rr = ra + (rb - ra) * t, h = ha(t, rr), ac = a0 + tw(rr); pts.push(pt(rr, ac - h)); right.push(pt(rr, ac + h)); }
        steps = Math.ceil(2 * hOut / 0.05); for (i = 1; i < steps; i++) pts.push(pt(rb, a0 + tw(rb) - hOut + 2 * hOut * i / steps));
        pts = pts.concat(right.reverse());
        steps = Math.ceil(2 * hIn / 0.05); for (i = 1; i < steps; i++) pts.push(pt(ra, a0 + tw(ra) + hIn - 2 * hIn * i / steps));
        d += 'M' + pts.join('L') + 'Z';
      }
    }
    var ink = custom ? (p.ink || pal[0]) : pal[0], ground = custom ? (p.ground || pal[1]) : pal[1], d2 = '', d3 = '', c2 = Math.round(num('count2', 0)), ringKind = p.ring || 'off';
    if (c2 > 0) d2 = rotor(ext(p, { random: 0, motion: 'off', unit: p.unit2 || unit, count: c2, width: num('width2', 0.5), taper: 0, twist: num('twist2', 0), inner: num('inner2', 0.05), outer: num('outer2', 0.35),
      angle: num('angle', 0) + num('angle2', 0), rings: 1, count2: 0, ring: 'off' })).d;
    if (ringKind !== 'off') {
      var R0 = clamp(num('ringRadius', 0.25), 0.02, 1.4) * RM, rw = clamp(num('ringWeight', 1), 0.01, 1), rc = clamp(Math.round(num('ringCount', 12)), 2, 96), rd = clamp(num('ringDepth', 0.15), 0, 0.6);
      var SG = Math.max(96, rc * 16), o1 = [], o2 = [];
      for (i = 0; i < SG; i++) {
        var ph = i * rc / SG, fr = ph - Math.floor(ph), kk = 1 + rd * (ringKind === 'wave' ? Math.sin(TAU * ph) : ringKind === 'zigzag' ? 4 * Math.abs(fr - 0.5) - 1 : 0), an = TAU * i / SG + rot;
        o1.push(pt(R0 * kk, an)); o2.push(pt(R0 * (1 - rw) * kk, an));
      }
      d3 = 'M' + o1.join('L') + 'Z' + (rw < 0.995 ? 'M' + o2.reverse().join('L') + 'Z' : '');
    }
    return { d: d, d2: d2, d3: d3, ringInk: p.ringColor === 'ground' ? ground : ink, rot: 'translate(600 400)', ink: ink, ground: ground, src: '', showOriginal: false };
  }

  // ---------- sheets: 24 seeded combinations per family ----------
  function rnd2(v) { return Math.round(v * 100) / 100; }
  var VARIANTS = { half: [], piano: [] };
  (function () {
    for (var n = 1; n <= 24; n++) {
      var h = (function (n2) { return function (j) { return hash(n2, j, 31); }; })(n), pick = function (list, j) { return list[Math.floor(h(j) * list.length) % list.length]; };
      VARIANTS.half.push({ shape: pick(['circle', 'hexagon', 'diamond', 'triangle', 'hexagon', 'circle'], 1), angle: pick([0, 90, 45, 135, 0, 90], 2),
        solidTurn: pick([0, 90, 180, 270, 45, 0], 3), solid: rnd2(0.3 + 0.35 * h(4)), count: 7 + Math.floor(h(5) * 14), thick: rnd2(0.35 + 0.3 * h(6)),
        taper: h(7) < 0.25 ? 1 : 0, ends: h(8) < 0.3 ? 'round' : 'square', size: 0.9 });
      VARIANTS.piano.push({ shape: pick(['circle', 'triangle', 'diamond', 'hexagon', 'peak', 'triangle'], 11), angle: pick([0, 0, 90, 90, 45, 0], 12),
        keysFrom: pick(['start', 'end', 'alternate', 'middle'], 13), keys: rnd2(0.45 + 0.5 * h(14)), count: 7 + Math.floor(h(15) * 14), thick: rnd2(0.5 + 0.4 * h(16)),
        thin: rnd2(0.04 + 0.06 * h(17)), overhang: Math.round(h(18) * 70), pattern: n, size: 0.9 });
    }
  })();
  // ---------- reference studies (refs-01-sheet), carried verbatim: the 28 collected marks, as far as the four effects reach ----------
  function sw(base, o) {
    var s = ext(MASTER[base], o); s.darkAreas = undefined;
    return { d: buildPath(s, null), rot: 'translate(600 400) rotate(' + s.angle + ')', ink: s.ink, ground: s.ground };
  }
  var STUDIES = [
    ['ref-01, Swell, blinds broken up', function () { return sw('blinds', { angle: 90, count: 15, thick: 0.4, ends: 'round', breakUp: 0.4, pattern: 3, size: 0.95 }); }],
    ['ref-02, Swell, keys', function () { return sw('keys', {}); }],
    ['ref-03, Swell, steps', function () { return sw('steps', { count: 3 }); }],
    ['ref-04, Swell, steps on a peak', function () { return sw('steps', { shape: 'peak', size: 0.8, count: 6, thin: 0.45, thick: 0.45, shift: -0.4, transition: 0, ink: '#e5303f', ground: '#111111' }); }],
    ['ref-05, Swell, glyph', function () { return sw('glyph', {}); }],
    ['ref-06, Swell, hex', function () { return sw('hex', {}); }],
    ['ref-07, Swell, taper', function () { return sw('taper', { angle: 155, count: 18, thick: 0.75 }); }],
    ['ref-09, Swell, sun', function () { return sw('sun', {}); }],
    ['ref-11, Swell, sun full width', function () { return sw('sun', { length: 'frame', count: 9, thin: 0.06, thick: 0.6, pattern: 9, size: 0.8, ink: '#e30613', ground: '#f6f6f6' }); }],
    ['ref-12, Warp, wave with swell', function () { return warp({ shape: 'split', count: 4, weight: 0.5, bend: 0, wave: 0.7, wavelength: 620, swell: 0.5, softness: 6, palette: 'paper on ink' }); }],
    ['ref-13, Pinch', function () { return pinch({}); }],
    ['ref-14, Swell, blinds', function () { return sw('blinds', {}); }],
    ['ref-16, Swell, telescope on a diamond', function () { return sw('telescope', { angle: 90, shape: 'diamond', size: 0.8, length: 'shape', levels: 2, depth: 0.55, thin: 0.3, thick: 0.85, count: 15, ink: '#111111', ground: '#ffffff' }); }],
    ['ref-17, Swell, ridge with soft bumps', function () { return sw('ridge', { count: 12, thin: 0.14, thick: 0.6, transition: 36, curve: 'swell', breakUp: 0.6, pattern: 4, ink: '#ffffff', ground: '#0a1fff' }); }],
    ['ref-18, Warp, wave', function () { return warp({ count: 3, weight: 0.5, bend: 0, wave: 0.3, wavelength: 560, palette: 'ink on paper' }); }],
    ['ref-19, Swell, ridge', function () { return sw('ridge', {}); }],
    ['ref-20, Swell, sun reversed', function () { return sw('sun', { count: 8, thin: 0.06, thick: 0.6, pattern: 11, ink: '#ffffff', ground: '#000000' }); }],
    ['ref-21, Swell, telescope on a peak', function () { return sw('telescope', { angle: 90, shape: 'peak', size: 0.8, length: 'shape', levels: 3, depth: 0.5, thin: 0.12, thick: 0.7, count: 11 }); }],
    ['ref-22, Swell, steps, two bars', function () { return sw('steps', { count: 2, angle: 160, transition: 170 }); }],
    ['ref-23, Swell, ridge in a circle', function () { return sw('ridge', { breakUp: 0, size: 0.72, count: 7, thin: 0.05, thick: 0.75, length: 'shape', overhang: 70, transition: 40, ink: '#111111', ground: '#e8e0d6' }); }],
    ['ref-24, Swell, blinds with a shifted core', function () { return sw('blinds', { levels: 2, depth: 0.45, count: 9, thin: 0.5, thick: 0.5, shift: 0.9, transition: 22 }); }],
    ['ref-25, Swell, bars with hairlines', function () { return sw('blinds', { shape: 'hexagon', size: 0.8, length: 'frame', thin: 0.1, thick: 0.78, transition: 14, count: 14, ink: '#0a1fff', ground: '#f1f1f1' }); }],
    ['ref-27, Swell, telescope upright', function () { return sw('telescope', { angle: 90, size: 1, depth: 0.8, levels: 4, thin: 0.12, thick: 0.95, count: 20, ink: '#f4f1e8', ground: '#000000' }); }],
    ['ref-28, Swell, telescope on a diamond, dark on light', function () { return sw('telescope', { angle: 90, shape: 'diamond', size: 1, depth: 0.7, levels: 3, thin: 0.25, thick: 0.9, count: 20, ink: '#111111', ground: '#f1ede2' }); }]
  ];
  var studyCache = null;
  function studies() { // each mark at 0.4 scale for a 480 × 320 tile
    if (studyCache) return studyCache;
    studyCache = STUDIES.map(function (st) {
      var v; try { v = st[1](); } catch (e) { v = { d: '', rot: 'translate(600 400)', ink: '#ffffff', ground: '#000000' }; }
      return { label: st[0], d: v.d, rot: v.rot.replace('translate(600 400)', 'translate(240 160) scale(0.4)'), ink: v.ink, ground: v.ground };
    });
    return studyCache;
  }

  var sheetCache = {};
  function sheet(kind) {
    if (sheetCache[kind]) return sheetCache[kind];
    var out = [], n, v, label, q;
    for (n = 1; n <= 24; n++) {
      q = null;
      var id = (n < 10 ? '0' : '') + n;
      try {
        if (kind === 'rotor') {
          var h = (function (n2) { return function (j) { return hash(n2, j, 53); }; })(n), pick = function (list, j) { return list[Math.floor(h(j) * list.length) % list.length]; };
          q = { unit: pick(['sector', 'petal', 'bar', 'dot', 'sector', 'petal'], 1) };
          q.count = q.unit === 'dot' ? pick([5, 6, 8, 12, 16], 2) : pick([3, 4, 5, 6, 8, 12, 16, 24, 36], 2);
          q.rings = h(3) < 0.6 ? 1 : 2 + Math.floor(h(4) * 2); q.inner = rnd2(0.1 + 0.4 * h(5)); q.outer = 1; q.width = rnd2(0.3 + 0.6 * h(6));
          q.taper = pick([0, 0, 0.6, 1, -0.6], 7); q.twist = h(8) < 0.4 ? 0 : Math.round((h(9) * 2 - 1) * 24) * 5; q.gap = rnd2(0.1 + 0.2 * h(10)); q.shift = pick([0, 0.5, 0.25], 11);
          v = rotor(q);
          label = 'rotor-' + id + ': ' + q.unit + ', count ' + q.count + ', rings ' + q.rings + ', inner ' + q.inner + ', outer 1, width ' + q.width + ', taper ' + q.taper + ', twist ' + q.twist + ', gap ' + q.gap + ', shift ' + q.shift;
        } else { v = sw(kind, VARIANTS[kind][n - 1]); label = kind + '-' + id + ': preset ' + kind + ', variant ' + n; }
      } catch (e) { v = { d: '', rot: 'translate(600 400)', ink: '#fafafa', ground: '#35363a' }; label = kind + '-' + id; }
      out.push({ label: label, d: v.d, rot: v.rot.replace('translate(600 400)', 'translate(240 160) scale(0.4)'), ink: v.ink, ground: v.ground, q: q });
    }
    return sheetCache[kind] = out;
  }

  // ---------- reference studies: the 28 collected marks, as far as the four effects reach ----------
  // ---------- vortex: level lines on a sheet that sinks into a hole and turns as it sinks, seen from an angle ----------
  function vortex(props) {
    props = roll('vortex', props);
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var count = clamp(Math.round(num('count', 21)), 2, 80), BOX = 560, H = BOX / 2, pitch = BOX / count, w = clamp(num('weight', 0.25), 0.02, 1) * pitch, e = clamp(num('effect', 1), 0, 1);
    var D = num('depth', 1) * H * e, rad = clamp(num('radius', 0.35), 0.03, 2) * H, hole = clamp(num('hole', 0.06), 0, 0.9) * H, twist = num('twist', 120) * Math.PI / 180 * e;
    var tilt = clamp(num('tilt', 55), 0, 85) * Math.PI / 180 * e, turn = num('turn', 0) * Math.PI / 180, cx = clamp(num('x', 0), -1, 1) * H, cy = clamp(num('y', 0), -1, 1) * H;
    var fade = clamp(num('fade', 0.6), 0, 1), funnel = p.well === 'funnel', round = p.frame === 'circle', ct = Math.cos(tilt), st = Math.sin(tilt), co = Math.cos(turn), si = Math.sin(turn);
    var pal = PALETTES[p.palette] || PALETTES['paper on ink'], custom = p.palette === 'custom', d = '', run = [], x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, i, a, j;
    var flush = function () {
      if (run.length > 1) {
        var left = [], right = [];
        for (j = 0; j < run.length; j++) {
          var q0 = run[Math.max(0, j - 1)], q1 = run[Math.min(run.length - 1, j + 1)], tx = q1[0] - q0[0], ty = q1[1] - q0[1], ln = Math.sqrt(tx * tx + ty * ty) || 1, hw = run[j][2];
          left.push(r2(run[j][0] - ty / ln * hw) + ' ' + r2(run[j][1] + tx / ln * hw)); right.push(r2(run[j][0] + ty / ln * hw) + ' ' + r2(run[j][1] - tx / ln * hw));
        }
        d += 'M' + left.join('L') + 'L' + right.reverse().join('L') + 'Z';
      }
      run = [];
    };
    for (i = 0; i < count; i++) {
      var b = -H + (i + 0.5) * pitch, span = round ? Math.sqrt(Math.max(0, H * H - b * b)) : H;
      for (a = -span; a <= span + 0.01; a += 4) {
        var dx = a * co - b * si - cx, dy = a * si + b * co - cy, r = Math.sqrt(dx * dx + dy * dy);
        if (r < hole) { flush(); continue; }
        var f = funnel ? rad / (r + rad) : 1 / (1 + (r / rad) * (r / rad)), ph = twist * f, c = Math.cos(ph), s = Math.sin(ph);
        var X = cx + dx * c - dy * s, Y = (cy + dx * s + dy * c) * ct + D * f * st;
        if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
        run.push([X, Y, Math.max(0.4, w / 2 * (1 - fade * f))]);
      }
      flush();
    }
    var k = Math.min(2.5, 640 / Math.max(1, y1 - y0), 1000 / Math.max(1, x1 - x0)); // the sheet always fills the board, however it is tilted
    return { d: d, rot: 'translate(600 400) scale(' + r2(k) + ') translate(' + r2(-(x0 + x1) / 2) + ' ' + r2(-(y0 + y1) / 2) + ')', ink: custom ? (p.ink || pal[0]) : pal[0], ground: custom ? (p.ground || pal[1]) : pal[1], src: '', showOriginal: false };
  }
  // ---------- 29.3: carried verbatim from the mirror (line-swell.js 237-274, 698-879): the wave source, the motion helpers, Wave and Keys ----------
  // ---------- Wave as a source: the two oscillators, read as "where is it heavy" at any point, at any moment of the loop ----------
  function waveField(p, num, clamp, depth, levels) {
    var S = 280, TAU2 = Math.PI * 2;
    var amp1 = num('waveAmp', 0.5) * S, wl1 = clamp(num('waveLength', 1), 0.1, 6) * 2 * S, band = clamp(num('waveBand', 0.45), 0, 2) * S, off = num('waveOffset', 0) * TAU2;
    var amp2 = num('waveAmp2', 0.25) * S, wl2 = clamp(num('waveLength2', 0.9), 0.1, 6) * 2 * S;
    var cycA = clamp(Math.round(num('waveSpeed', 1)), 0, 8), cycB = clamp(Math.round(num('waveSpeed2', 1)), 0, 8);
    var dirA = p.waveDir === 'left' ? -1 : 1, dirB = p.waveDir2 === 'left' ? -1 : 1;
    if (p.waveSync === true || p.waveSync === 'true') {
      var hr = String(p.waveHarmonic || '2:1').split(':'), hn = Math.max(1, +hr[0] || 1), hd = Math.max(1, +hr[1] || 1);
      wl2 = wl1 * hd / hn; cycB = cycA * hn; cycA = cycA * hd;
    }
    var tw = (((+p.waveT || 0) % 1) + 1) % 1, phA = TAU2 * tw * cycA * dirA, phB = TAU2 * tw * cycB * dirB + off;
    var fillA = p.waveFill || 'center', fillB = p.waveFill2 || 'center', comb = p.waveCombine || 'between';
    var invA = p.waveInvert === true || p.waveInvert === 'true', invB = p.waveInvert2 === true || p.waveInvert2 === 'true';
    var cA = -band / 2, cB = band / 2, tr = num('waveTurn', 0) * Math.PI / 180, ct = Math.cos(tr), st2 = Math.sin(tr), FAR = S * 1.6;
    var inside = function (mode, y, wv, cen) { return mode === 'above' ? y < wv : mode === 'below' ? y > wv : mode === 'center' ? (y - cen) * (y - wv) < 0 : false; };
    return function (cx, cy) {
      var X = cx - C, Y = cy - C, x = X * ct + Y * st2, y = -X * st2 + Y * ct;
      if (y <= -FAR || y >= FAR) return 0;
      var yA = cA + amp1 * Math.sin(TAU2 * x / wl1 - phA), yB = cB + amp2 * Math.sin(TAU2 * x / wl2 - phB);
      var on = function (yy) {
        if (comb === 'between') return (yy - yA) * (yy - yB) < 0;
        var ia = inside(fillA, yy, yA, cA) !== invA, ib = inside(fillB, yy, yB, cB) !== invB;
        return comb === 'intersect' ? ia && ib : comb === 'subtract' ? ia && !ib : comb === 'exclude' ? ia !== ib : ia || ib;
      };
      if (!on(y)) return 0;
      if (!(depth > 0)) return 1;
      // depth: 1 in the middle of this filled stretch, falling toward its edges, so stepped presets have something to step on
      var bp = [-FAR, FAR, yA, yB, cA, cB].sort(function (u, v) { return u - v; }), j = 0, lo, hi;
      while (j < 4 && bp[j + 1] <= y) j++;
      lo = bp[j]; hi = bp[j + 1];
      var a = j, b = j + 1;
      while (a > 0 && (bp[a] - bp[a - 1] < 0.01 || on((bp[a] + bp[a - 1]) / 2))) { a--; lo = bp[a]; }
      while (b < 5 && (bp[b + 1] - bp[b] < 0.01 || on((bp[b] + bp[b + 1]) / 2))) { b++; hi = bp[b]; }
      var val = 1 - depth + depth * Math.min(1, Math.min(y - lo, hi - y) / Math.max(1, (hi - lo) / 2));
      return levels >= 2 ? Math.max(1 / levels, Math.ceil(val * levels) / levels) : val;
    };
  }

  // ---------- motion: two marks that loop. t runs from 0 to 1 over exactly one loop, so the last frame meets the first ----------
  function motionBase(props, palette) {
    var p = props || {};
    var num = numOf(p);
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var pal = PALETTES[p.palette] || PALETTES[palette], custom = p.palette === 'custom', th = num('angle', 0) * Math.PI / 180, cos = Math.cos(th), sin = Math.sin(th);
    return { p: p, num: num, clamp: clamp, dir: p.direction === 'left' ? -1 : 1, cos: cos, sin: sin, turned: Math.abs(sin) > 1e-6,
      ink: custom ? (p.ink || pal[0]) : pal[0], ground: custom ? (p.ground || pal[1]) : pal[1],
      rot: function (u, v) { return [u * cos - v * sin, u * sin + v * cos]; } };
  }
  function polyD(pts) { return pts.length < 3 ? '' : 'M' + pts.map(function (q) { return r2(q[0]) + ' ' + r2(q[1]); }).join('L') + 'Z'; }
  // Cuts a polygon to a convex outline (Sutherland-Hodgman). The outline never moves; what is drawn inside it can turn.
  function clipConvex(poly, clip) {
    var area = 0, i, j;
    for (i = 0; i < clip.length; i++) { j = (i + 1) % clip.length; area += clip[i][0] * clip[j][1] - clip[j][0] * clip[i][1]; }
    var sgn = area >= 0 ? 1 : -1, out = poly;
    for (i = 0; i < clip.length && out.length; i++) {
      var ca = clip[i], cb = clip[(i + 1) % clip.length], inp = out; out = [];
      for (j = 0; j < inp.length; j++) {
        var pp = inp[j], qq = inp[(j + 1) % inp.length];
        var sp = sgn * ((cb[0] - ca[0]) * (pp[1] - ca[1]) - (cb[1] - ca[1]) * (pp[0] - ca[0])), sq = sgn * ((cb[0] - ca[0]) * (qq[1] - ca[1]) - (cb[1] - ca[1]) * (qq[0] - ca[0]));
        if (sp >= 0) out.push(pp);
        if ((sp >= 0) !== (sq >= 0)) { var tc = sp / (sp - sq); out.push([pp[0] + (qq[0] - pp[0]) * tc, pp[1] + (qq[1] - pp[1]) * tc]); }
      }
    }
    return out;
  }
  function outlineOf(shape, R) {
    var pts = [], i;
    if (shape === 'circle') for (i = 0; i < 72; i++) pts.push([R * Math.cos(TAU * i / 72), R * Math.sin(TAU * i / 72)]);
    else if (shape === 'hexagon') for (i = 0; i < 6; i++) pts.push([R * Math.sin(i * Math.PI / 3), -R * Math.cos(i * Math.PI / 3)]);
    else if (shape === 'triangle') pts = [[0, -R], [0.95 * R, 0.72 * R], [-0.95 * R, 0.72 * R]];
    else if (shape === 'diamond') pts = [[0, -R], [R, 0], [0, R], [-R, 0]];
    return pts;
  }
  // A bar cut to a mask that is not convex (a letter): two-pixel slices along the bar, joined where consecutive slices match.
  function maskBar(bounds, ua, ub, va, vb, cos, sin, slant) {
    var d = '', prev = null, st = slant ? 3 : 2, vv, uu, vc = (va + vb) / 2;
    slant = slant || 0;
    var rp = function (u, v) { return r2(u * cos - v * sin) + ' ' + r2(u * sin + v * cos); };
    var box = function (a, b, v0, v1) { return 'M' + rp(a, v0) + 'L' + rp(b, v0) + 'L' + rp(b, v1) + 'L' + rp(a, v1) + 'Z'; };
    for (vv = va; vv < vb; vv += st) {
      var run = null, runs = [], v1 = Math.min(vb, vv + st), vm = (vv + v1) / 2, lean = slant * (vm - vc);
      for (uu = ua + lean; uu <= ub + lean + st; uu += st) {
        var on = false;
        if (uu <= ub + lean) { var x = Math.round(C + uu * cos - vm * sin), y = Math.round(C + uu * sin + vm * cos); on = x >= 0 && y >= 0 && x < N && y < N && bounds[y * N + x] > 0.5; }
        if (on && run === null) run = uu;
        if (!on && run !== null) { runs.push([run, Math.min(ub + lean, uu)]); run = null; }
      }
      if (runs.length === 1 && prev && prev[0] === runs[0][0] && prev[1] === runs[0][1]) { prev[3] = v1; continue; }
      if (prev) { d += box(prev[0], prev[1], prev[2], prev[3]); prev = null; }
      if (runs.length === 1) prev = [runs[0][0], runs[0][1], vv, v1];
      else for (var q = 0; q < runs.length; q++) d += box(runs[q][0], runs[q][1], vv, v1);
    }
    if (prev) d += box(prev[0], prev[1], prev[2], prev[3]);
    return d;
  }
  // Wave: upright lines crossed by two separate waves, each with its own length and height. The lines are heavy between
  // the two waves and taper to the frame edge outside them. The frame stays put; angle turns the lines and the waves inside it.
  function wave(props, t) {
    props = roll('wave', props);
    var m = motionBase(props, 'ink on paper'), num = m.num, clamp = m.clamp;
    var n = clamp(Math.round(num('count', 40)), 2, 160), W = 720, HH = 280, pitch = W / n;
    var ea = Math.abs(W / 2 * m.cos) + Math.abs(HH * m.sin), eb = Math.abs(HH * m.cos) + Math.abs(W / 2 * m.sin); // half extents across and along the lines
    var amp1 = num('amplitude', 0.5) * HH, wl1 = clamp(num('wavelength', 1), 0.1, 6) * W, band = clamp(num('band', 0.45), 0, 2) * HH, off = num('offset', 0) * TAU;
    var amp2 = num('amplitude2', 0.25) * HH, wl2 = clamp(num('wavelength2', 0.9), 0.1, 6) * W;
    // Two oscillators. Each has its own length, height, speed (whole cycles per loop, so the loop always closes) and direction.
    // Sync locks B to A as a harmonic n:d: B's wave is n/d times as frequent and travels at A's pace, so the two move as one shape
    // when they run the same way, and beat against each other when B is reversed.
    var cycA = clamp(Math.round(num('speed', 1)), 0, 8), sp2 = Math.round(num('speed2', 1)), cycB = Math.abs(sp2);
    var dirB = (m.p.direction2 === 'left' ? -1 : 1) * (sp2 < 0 ? -1 : 1);
    if (m.p.sync === true || m.p.sync === 'true') {
      var hr = String(m.p.harmonic || '2:1').split(':'), hn = Math.max(1, +hr[0] || 1), hd = Math.max(1, +hr[1] || 1);
      wl2 = wl1 * hd / hn; cycB = cycA * hn; cycA = cycA * hd;
    }
    var thin = clamp(num('thin', 0.06), 0, 1) * pitch, thick = clamp(num('thick', 0.62), 0, 1) * pitch, edge = thin + (thick - thin) * clamp(num('taper', 0.35), 0, 1);
    var tw = (((t || 0) % 1) + 1) % 1; // the end of the loop is its start, exactly
    var phA = TAU * tw * cycA * m.dir, phB = TAU * tw * cycB * dirB + off, rect = [[-W / 2, -HH], [W / 2, -HH], [W / 2, HH], [-W / 2, HH]], n2 = Math.ceil(2 * ea / pitch), a0 = -n2 * pitch / 2, d = '';
    // Each oscillator fills part of every line: from its own center line out to the wave, or everything on one side of the wave.
    // combine says what happens where the two fills meet. "between" ignores the fills and takes the span from one wave to the other.
    var fillA = m.p.fill || 'center', fillB = m.p.fill2 || 'center', comb = m.p.combine || 'between', round = m.p.round === true || m.p.round === 'true';
    var invA = m.p.invert === true || m.p.invert === 'true', invB = m.p.invert2 === true || m.p.invert2 === 'true'; // flips what that oscillator fills
    var cA = -band / 2, cB = band / 2;
    var inside = function (mode, y, wv, cen) { return mode === 'above' ? y < wv : mode === 'below' ? y > wv : mode === 'center' ? (y - cen) * (y - wv) < 0 : false; };
    // Filter: one more pass over each line before it is drawn. piano steps every fill down through a narrower block,
    // dash breaks the fills into segments, warp bends the whole line sideways as wave A passes.
    var filt = m.p.filter || 'none', famt = clamp(num('filterAmount', 0.5), 0, 1), bendBy = filt === 'warp' ? famt * pitch * 1.6 : 0;
    var pianoW = clamp(num('pianoWidth', 0.5), 0.05, 1), dashLen = clamp(num('dashLength', 40), 6, 400), dashSp = Math.round(num('dashSpeed', 2));
    var warpLen = 1.3 * eb * clamp(num('warpScale', 1), 0.1, 8), warpPh = TAU * tw * Math.round(num('warpSpeed', 1));
    var put = function (pts, lx) {
      if (bendBy) { // split long edges so the line can curve, then shift every point sideways by where it sits along the line
        var dense = [], e0, e1, parts, pi;
        for (e0 = 0; e0 < pts.length; e0++) {
          e1 = pts[(e0 + 1) % pts.length]; parts = Math.max(1, Math.ceil(Math.abs(e1[1] - pts[e0][1]) / 14));
          for (pi = 0; pi < parts; pi++) dense.push([pts[e0][0] + (e1[0] - pts[e0][0]) * pi / parts, pts[e0][1] + (e1[1] - pts[e0][1]) * pi / parts]);
        }
        pts = dense.map(function (q) { return [q[0] + bendBy * Math.sin(TAU * q[1] / warpLen + TAU * lx / wl1 - warpPh), q[1]]; });
      }
      pts = pts.map(function (q) { return m.rot(q[0], q[1]); });
      if (m.turned || bendBy) pts = clipConvex(pts, rect); // warp never moves the frame: the lines flow inside it
      var ar = 0; for (var w2 = 0; w2 < pts.length; w2++) { var w3 = (w2 + 1) % pts.length; ar += pts[w2][0] * pts[w3][1] - pts[w3][0] * pts[w2][1]; }
      if (ar < 0) pts.reverse(); // every outline wound the same way: a fill laid over a stem adds to it, never cuts a hole in it
      d += polyD(pts);
    };
    var extra = bendBy ? Math.ceil(bendBy / pitch) + 1 : 0; // spare lines each side, so a bend never opens a gap at the frame edge
    for (var i = -extra; i < n2 + extra; i++) {
      var x = a0 + (i + 0.5) * pitch, yA = cA + amp1 * Math.sin(TAU * x / wl1 - phA), yB = cB + amp2 * Math.sin(TAU * x / wl2 - phB);
      var bp = [-eb, eb, yA, yB, cA, cB].map(function (v) { return clamp(v, -eb, eb); }).sort(function (u, v) { return u - v; }), iv = [], j;
      for (j = 0; j < bp.length - 1; j++) {
        var lo = bp[j], hi = bp[j + 1]; if (hi - lo < 0.01) continue;
        var mid = (lo + hi) / 2, ia = inside(fillA, mid, yA, cA) !== invA, ib = inside(fillB, mid, yB, cB) !== invB;
        var on = comb === 'between' ? (mid - yA) * (mid - yB) < 0 : comb === 'intersect' ? ia && ib : comb === 'subtract' ? ia && !ib : comb === 'exclude' ? ia !== ib : ia || ib;
        if (!on) continue;
        if (iv.length && Math.abs(iv[iv.length - 1][1] - lo) < 0.011) iv[iv.length - 1][1] = hi; else iv.push([lo, hi]);
      }
      if (thin > 0.01 || edge > 0.01) { // the stem: thin at the frame edge and in the middle of a gap, widening to the taper width where it meets a fill
        var st = [[-eb, iv.length && iv[0][0] <= -eb + 0.01 ? edge : thin]], end = -eb;
        for (j = 0; j < iv.length; j++) {
          if (iv[j][0] > end + 0.01) { if (end > -eb) st.push([(end + iv[j][0]) / 2, thin]); st.push([iv[j][0], edge]); }
          st.push([iv[j][1], edge]); end = iv[j][1];
        }
        if (end < eb - 0.01) st.push([eb, thin]);
        put(st.map(function (q) { return [x - q[1] / 2, q[0]]; }).concat(st.slice().reverse().map(function (q) { return [x + q[1] / 2, q[0]]; })), x);
      }
      for (j = 0; j < iv.length; j++) { // the fills: bars, or capsules when round is on (a very short one becomes a dot)
        var ya = iv[j][0], yb = iv[j][1], segs = [[ya, yb, thick]], g;
        if (filt === 'piano') { // a full block, then a narrower one; which end steps down, and how far, is fixed per line so nothing flickers
          var keep = 1 - famt * (0.25 + 0.6 * hash(i, 1, 7)), low = thick * pianoW;
          segs = hash(i, 2, 7) > 0.5 ? [[ya, ya + (yb - ya) * keep, thick], [ya + (yb - ya) * keep, yb, low]] : [[ya, yb - (yb - ya) * keep, low], [yb - (yb - ya) * keep, yb, thick]];
        } else if (filt === 'dash') {
          // the segments travel along the line: a whole number of segment lengths per loop, so the loop still closes; odd lines sit half a step over
          var per = dashLen, onLen = per * (1 - 0.8 * famt), sh = (((tw * dashSp) % 1 + 1) % 1) * per + (((i % 2) + 2) % 2) * per / 2, y0;
          segs = [];
          for (y0 = Math.floor((ya - sh) / per) * per + sh - per; y0 < yb; y0 += per) { var s0 = Math.max(ya, y0), s1 = Math.min(yb, y0 + onLen); if (s1 - s0 > 0.5) segs.push([s0, s1, thick]); }
        }
        for (g = 0; g < segs.length; g++) {
          var sa = segs[g][0], sb = segs[g][1], wd = segs[g][2];
          if (sb - sa < 0.05) continue;
          if (!round) { put([[x - wd / 2, sa], [x + wd / 2, sa], [x + wd / 2, sb], [x - wd / 2, sb]], x); continue; }
          var rr = Math.min(wd / 2, (sb - sa) / 2), cap = [], q;
          for (q = 0; q <= 8; q++) cap.push([x - rr * Math.cos(Math.PI * q / 8), sa + rr - rr * Math.sin(Math.PI * q / 8)]);
          for (q = 0; q <= 8; q++) cap.push([x + rr * Math.cos(Math.PI * q / 8), sb - rr + rr * Math.sin(Math.PI * q / 8)]);
          put(cap, x);
        }
      }
    }
    return { d: d, rot: 'translate(600 400)', ink: m.ink, ground: m.ground };
  }
  // Keys: rows of upright bars whose widths breathe in a travelling wave, each row out of step with the one above.
  // The bars are cut to an outline that stays put. angle leans the bars inside each row; the rows and the outline never turn,
  // because turning the whole thing is something the finished piece can always do later.
  function keys(props, t, img) { // the port's one change: a letter's outline comes in as `img.rings` (getField below)
    props = roll('keys', props);
    var m = motionBase(props, 'paper on ink'), num = m.num, clamp = m.clamp, p = m.p;
    var rows = clamp(Math.round(num('rows', 2)), 1, 6), bars = clamp(Math.round(num('bars', 5)), 1, 24), size = clamp(num('size', 1), 0.3, 2);
    var mn = clamp(num('min', 0.08), 0, 1), mx = clamp(num('max', 0.85), 0, 1), spread = num('spread', 0.12), rowPhase = num('rowPhase', 0.5);
    var stagger = rows > 1 ? num('stagger', 0.5) : 0, anchor = p.anchor || 'left', typed = p.letter ? String(p.letter).trim() : '', d = '', clip = null, bounds = null, ea, eb, i;
    var shape = typed ? 'letter' : (!p.shape || p.shape === 'letter' ? 'rectangle' : p.shape); // a typed letter is the shape; an empty box leaves it to the list
    var sl = Math.tan(clamp(num('angle', 0), -75, 75) * Math.PI / 180);
    if (shape === 'letter') {
      bounds = getField({ shape: 'letter', letter: typed, font: p.letterFont, weight: num('letterWeight', 900), stretch: num('letterStretch', 1), lean: num('letterLean', 0), shiftX: num('letterX', 0), shiftY: num('letterY', 0), size: 0.75 * size, breakUp: 0, pattern: 1, depth: 0, levels: 1, contrast: 1 }, img || null).bounds;
      ea = eb = 215 * size;
    } else {
      if (shape === 'rectangle') { var W = 440 * size, HT = 320 * size, hw = (W + stagger * W / bars) / 2; clip = [[-hw, -HT / 2], [hw, -HT / 2], [hw, HT / 2], [-hw, HT / 2]]; }
      else clip = outlineOf(shape, 200 * size);
      ea = 0; eb = 0;
      for (i = 0; i < clip.length; i++) { ea = Math.max(ea, Math.abs(clip[i][0])); eb = Math.max(eb, Math.abs(clip[i][1])); }
    }
    var pitch = 2 * ea / (bars + stagger), rowH = 2 * eb / rows, gap = clamp(num('gap', 0), 0, 0.5) * rowH, plain = shape === 'rectangle' && !sl;
    for (var r = 0; r < rows; r++) {
      var ya = -eb + r * rowH + gap / 2, yb = ya + rowH - gap, xs = -ea + (r % 2) * stagger * pitch;
      for (i = 0; i < bars; i++) {
        var w = pitch * (mn + (mx - mn) * (0.5 + 0.5 * Math.sin(TAU * ((t || 0) * m.dir - i * spread - r * rowPhase))));
        if (w < 0.05) continue;
        var cell = xs + i * pitch, xa = anchor === 'center' ? cell + (pitch - w) / 2 : anchor === 'right' ? cell + pitch - w : cell;
        if (bounds) { d += maskBar(bounds, xa, xa + w, ya, yb, 1, 0, sl); continue; }
        var la = sl * (ya - yb) / 2, lb = sl * (yb - ya) / 2, pts = [[xa + la, ya], [xa + w + la, ya], [xa + w + lb, yb], [xa + lb, yb]];
        d += polyD(plain ? pts : clipConvex(pts, clip));
      }
    }
    return { d: d, rot: 'translate(600 400)', ink: m.ink, ground: m.ground };
  }

  // ---------- randomise: random 0 leaves the settings alone; any other number rolls a set of values near a few starting points that look good ----------
  var ROLLS = {"master":[{"preset":"sun","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"blinds","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"steps","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"keys","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"hex","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"ridge","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"glyph","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"pulse","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"telescope","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"taper","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"dash","variant":0,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"half","variant":2,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"half","variant":9,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"half","variant":15,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"half","variant":22,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"piano","variant":4,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"piano","variant":11,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0},{"preset":"piano","variant":19,"density":0,"angle":0,"thin":0,"thick":0,"taper":0,"shift":0,"transition":0}],"warp":[{"shape":"circle","size":1.04,"depth":0.7,"levels":"8","count":12,"angle":0,"weight":0.46,"bend":2,"softness":4,"swell":0.63,"wave":1.8,"wavelength":590,"phase":0},{"shape":"circle","size":0.9,"depth":0,"levels":"smooth","count":24,"angle":0,"weight":0.4,"bend":1.5,"softness":5,"swell":0.5,"wave":0,"wavelength":400,"phase":0},{"shape":"ring","size":1,"depth":0,"levels":"smooth","count":18,"angle":0,"weight":0.45,"bend":-1.5,"softness":4,"swell":0.6,"wave":0,"wavelength":400,"phase":0},{"shape":"hexagon","size":1,"depth":0.5,"levels":"4","count":16,"angle":30,"weight":0.4,"bend":2.5,"softness":3,"swell":0.4,"wave":0.6,"wavelength":300,"phase":0.3},{"shape":"peak","size":1,"depth":0,"levels":"smooth","count":20,"angle":0,"weight":0.35,"bend":1.2,"softness":6,"swell":0.7,"wave":1,"wavelength":800,"phase":0.5},{"shape":"split","size":1,"depth":0.3,"levels":"3","count":14,"angle":90,"weight":0.5,"bend":-2,"softness":4,"swell":0.5,"wave":0.4,"wavelength":500,"phase":0}],"radial":[{"shape":"split","size":1,"depth":0,"levels":"smooth","mode":"rings","count":14,"angle":0,"hole":0.1,"thin":0.08,"thick":0.7,"transition":40,"curve":"swell"},{"shape":"circle","size":0.9,"depth":0,"levels":"smooth","mode":"spokes","count":36,"angle":0,"hole":0.2,"thin":0.1,"thick":0.7,"transition":60,"curve":"swell"},{"shape":"hexagon","size":1,"depth":0.5,"levels":"3","mode":"rings","count":20,"angle":0,"hole":0,"thin":0.1,"thick":0.8,"transition":10,"curve":"bevel"},{"shape":"ring","size":1,"depth":0,"levels":"smooth","mode":"spokes","count":60,"angle":0,"hole":0.3,"thin":0.05,"thick":0.6,"transition":30,"curve":"swell"},{"shape":"peak","size":1,"depth":0,"levels":"smooth","mode":"rings","count":10,"angle":45,"hole":0.15,"thin":0.15,"thick":0.75,"transition":80,"curve":"swell"},{"shape":"circle","size":1,"depth":0.6,"levels":"4","mode":"spokes","count":24,"angle":90,"hole":0.1,"thin":0.1,"thick":0.8,"transition":20,"curve":"bevel"}],"moire":[{"shape":"circle","size":0.8,"depth":0,"levels":"smooth","count":48,"angle":0,"weight":0.3,"spread":0,"ratio":1.06,"push":0.6,"transition":60,"curve":"swell"},{"shape":"circle","size":1,"depth":0,"levels":"smooth","count":60,"angle":0,"weight":0.25,"spread":4,"ratio":1,"push":0.8,"transition":80,"curve":"swell"},{"shape":"ring","size":1,"depth":0,"levels":"smooth","count":40,"angle":45,"weight":0.3,"spread":-6,"ratio":1.03,"push":0.5,"transition":40,"curve":"swell"},{"shape":"hexagon","size":0.9,"depth":0.4,"levels":"3","count":36,"angle":0,"weight":0.35,"spread":2,"ratio":1.1,"push":1,"transition":20,"curve":"bevel"},{"shape":"split","size":1,"depth":0,"levels":"smooth","count":54,"angle":90,"weight":0.28,"spread":8,"ratio":0.95,"push":-0.6,"transition":60,"curve":"swell"},{"shape":"peak","size":1,"depth":0,"levels":"smooth","count":44,"angle":0,"weight":0.3,"spread":-3,"ratio":1.08,"push":0.9,"transition":100,"curve":"swell"}],"pinch":[{"count":17,"weight":0.3,"poles":2,"position":-0.3,"strength":1,"gather":0.3,"release":0.9,"fan":1.8},{"count":17,"weight":0.2,"poles":4,"position":-0.3,"strength":1,"gather":0.18,"release":0.34,"fan":3.4},{"count":9,"weight":0.35,"poles":1,"position":0,"strength":1,"gather":0.5,"release":0.5,"fan":2.5},{"count":24,"weight":0.25,"poles":1,"position":-0.6,"strength":1,"gather":0.25,"release":1.4,"fan":3},{"count":12,"weight":0.3,"poles":3,"position":0.3,"strength":1,"gather":0.6,"release":0.3,"fan":1},{"count":20,"weight":0.2,"poles":2,"position":0,"strength":0.8,"gather":0.4,"release":0.4,"fan":2.2},{"count":31,"weight":0.3,"poles":1,"position":-0.2,"strength":1,"gather":0.2,"release":1,"fan":4}],"rotor":[{"unit":"sector","count":8,"rings":1,"inner":0.45,"outer":1,"width":0.6,"taper":0,"twist":40,"gap":0.15,"shift":0,"count2":8,"unit2":"petal","width2":0.5,"twist2":-40,"inner2":0.1,"outer2":0.4,"angle2":0,"ring":"off"},{"unit":"bar","count":24,"rings":1,"inner":0.5,"outer":1,"width":0.4,"taper":0,"twist":0,"gap":0.15,"shift":0,"count2":0,"ring":"zigzag","ringRadius":0.4,"ringWeight":1,"ringCount":12,"ringDepth":0.15,"ringColor":"ink"},{"unit":"petal","count":12,"rings":1,"inner":0.3,"outer":1,"width":0.7,"taper":0,"twist":60,"gap":0.15,"shift":0,"count2":0,"ring":"wave","ringRadius":0.25,"ringWeight":0.3,"ringCount":6,"ringDepth":0.2,"ringColor":"ink"},{"unit":"sector","count":6,"rings":1,"inner":0.05,"outer":1,"width":0.7,"taper":0.6,"twist":90,"gap":0.15,"shift":0,"count2":0,"ring":"plain","ringRadius":0.3,"ringWeight":1,"ringCount":8,"ringDepth":0,"ringColor":"ground"},{"unit":"dot","count":12,"rings":2,"inner":0.5,"outer":1,"width":0.6,"taper":0,"twist":0,"gap":0.15,"shift":0.5,"count2":6,"unit2":"sector","width2":0.6,"twist2":0,"inner2":0.1,"outer2":0.42,"angle2":0,"ring":"off"},{"unit":"sector","count":16,"rings":1,"inner":0.55,"outer":1,"width":0.5,"taper":0,"twist":-60,"gap":0.15,"shift":0,"count2":0,"ring":"zigzag","ringRadius":0.5,"ringWeight":0.25,"ringCount":16,"ringDepth":0.1,"ringColor":"ink"}],"wave":[{"amplitude":0.13,"wavelength":1.55,"speed":1,"direction":"right","fill":"center","amplitude2":0.24,"wavelength2":1,"speed2":1,"direction2":"right","offset":-0.37,"fill2":"center","sync":false,"harmonic":"2:1","combine":"between","band":0.76,"count":40,"thin":0,"thick":0.62,"taper":0.33},{"amplitude":0.96,"wavelength":1.4,"speed":1,"direction":"right","fill":"above","amplitude2":-0.39,"wavelength2":1.15,"speed2":1,"direction2":"left","offset":-0.16,"fill2":"above","sync":true,"harmonic":"1:1","combine":"exclude","band":0.66,"count":46,"thin":0.28,"thick":0.9,"taper":0.55},{"amplitude":0.85,"wavelength":0.78,"speed":1,"direction":"right","fill":"center","amplitude2":0,"wavelength2":1,"speed2":0,"direction2":"right","offset":0,"fill2":"off","sync":false,"harmonic":"2:1","combine":"union","band":0,"count":44,"thin":0.1,"thick":0.46,"taper":0},{"amplitude":0.7,"wavelength":1,"speed":1,"direction":"right","fill":"center","amplitude2":0,"wavelength2":1,"speed2":0,"direction2":"right","offset":0,"fill2":"off","sync":false,"harmonic":"2:1","combine":"union","band":0,"count":34,"thin":0.1,"thick":0.5,"taper":0}],"keys":[{"rows":6,"bars":10,"min":0.17,"max":0.55,"anchor":"left","gap":0.16,"angle":0,"shape":"hexagon","size":1.35,"spread":-0.39,"rowPhase":0.06,"stagger":0.8},{"rows":4,"bars":8,"min":0.1,"max":0.6,"anchor":"left","gap":0.2,"angle":0,"shape":"rectangle","size":1,"spread":0.2,"rowPhase":0.1,"stagger":0.5},{"rows":5,"bars":12,"min":0.15,"max":0.5,"anchor":"center","gap":0.15,"angle":0,"shape":"circle","size":1.3,"spread":-0.3,"rowPhase":0.15,"stagger":0.6},{"rows":3,"bars":6,"min":0.2,"max":0.7,"anchor":"left","gap":0.25,"angle":20,"shape":"rectangle","size":1,"spread":0.3,"rowPhase":0.2,"stagger":0},{"rows":6,"bars":16,"min":0.1,"max":0.45,"anchor":"right","gap":0.12,"angle":0,"shape":"diamond","size":1.4,"spread":0.4,"rowPhase":0.08,"stagger":1},{"rows":5,"bars":9,"min":0.2,"max":0.6,"anchor":"center","gap":0.18,"angle":-20,"shape":"triangle","size":1.4,"spread":-0.2,"rowPhase":0.12,"stagger":0.4}],"vortex":[{"count":21,"weight":0.25,"depth":1,"radius":0.35,"hole":0.06,"twist":120,"tilt":55,"turn":0,"x":0,"y":0,"fade":0.6,"well":"bowl","frame":"square"},{"count":31,"weight":0.2,"depth":1.4,"radius":0.3,"hole":0.05,"twist":0,"tilt":65,"turn":0,"x":0,"y":0,"fade":0.5,"well":"funnel","frame":"circle"},{"count":25,"weight":0.25,"depth":0,"radius":0.45,"hole":0.08,"twist":220,"tilt":0,"turn":0,"x":0,"y":0,"fade":0.7,"well":"bowl","frame":"circle"},{"count":17,"weight":0.3,"depth":1.2,"radius":0.4,"hole":0.1,"twist":90,"tilt":60,"turn":90,"x":-0.3,"y":0,"fade":0.6,"well":"funnel","frame":"square"},{"count":41,"weight":0.18,"depth":0.8,"radius":0.25,"hole":0.04,"twist":300,"tilt":45,"turn":0,"x":0,"y":0,"fade":0.8,"well":"bowl","frame":"circle"},{"count":21,"weight":0.25,"depth":1.6,"radius":0.5,"hole":0.12,"twist":-150,"tilt":70,"turn":45,"x":0.2,"y":0,"fade":0.4,"well":"funnel","frame":"square"}]}, ROLL_SPAN = {"master":{"density":0.8,"angle":180,"thin":0.3,"thick":0.4,"taper":0.5,"shift":0.8,"transition":80}}, rollCache = {};
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function rollRows(kind) {
    if (rollCache[kind]) return rollCache[kind];
    var rows = ROLLS[kind] || [], info = {};
    if (kind === 'flow') rows = flowVariants().map(function (v) { return v.q; });
    if (kind === 'rotor') rows = sheet('rotor').map(function (v) { return v.q; }).filter(Boolean).concat(rows);
    rows.forEach(function (row) {
      for (var k in row) {
        var v = row[k], o = info[k] || (info[k] = { num: true, int: true, lo: Infinity, hi: -Infinity });
        if (typeof v !== 'number') { o.num = false; continue; }
        if (v < o.lo) o.lo = v; if (v > o.hi) o.hi = v; if (v !== Math.round(v)) o.int = false;
      }
    });
    return rollCache[kind] = { rows: rows, info: info };
  }
  function roll(kind, props) {
    var p = props || {}, n = Math.round(+p.random || 0);
    if (!(n > 0)) return p;
    var R = rollRows(kind), len = R.rows.length;
    if (!len) return p;
    var sp = p.randomSpread === undefined || p.randomSpread === null || p.randomSpread === '' || isNaN(+p.randomSpread) ? 0.5 : Math.max(0, Math.min(2, +p.randomSpread));
    var r = rng(n * 2654435761 + kind.charCodeAt(0) * 97 + kind.length), a = R.rows[Math.floor(r() * len)], b = R.rows[Math.floor(r() * len)], mix = r() * Math.min(1, sp), o = ext(p), k;
    for (k in R.info) {
      var inf = R.info[k], u = r(), va = a[k], vb = b[k];
      if (va === undefined) continue;
      if (inf.num) {
        if (typeof vb !== 'number') vb = va;
        var span = (ROLL_SPAN[kind] && ROLL_SPAN[kind][k]) || (inf.hi - inf.lo) || Math.abs(inf.hi) * 0.5 || 1;
        var v = Math.max(inf.lo - span * sp * 0.5, Math.min(inf.hi + span * sp * 0.5, va + (vb - va) * mix + (u * 2 - 1) * span * sp * 0.3));
        o[k] = inf.int ? Math.round(v) : Math.round(v * 100) / 100;
      } else o[k] = vb !== undefined && u < mix * 0.5 ? vb : va;
    }
    return o;
  }

export { vals, sw, studies, STUDIES, master, warp, radial, moire, pinch, flow, rotor, vortex, wave, keys, roll, sheet, flowVariants, PRESETS, MASTER, VARIANTS, PALETTES, N, C };
