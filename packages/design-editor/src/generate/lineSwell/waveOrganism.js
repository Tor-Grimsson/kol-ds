/* WAVE ORGANISMS — his Line Swell canvas's `wave-organism.js` (4Npm9zbKAg753Cz4TMPSKw, the Wave shapes page: shape-03-band,
 * shape-05-capsules, landing-01-wave), carried VERBATIM. Only the wrapper changed: the IIFE that set `window.WaveOrganism`
 * is a module that exports the same three drawings. */
/* eslint-disable */

  var TAU = Math.PI * 2;
  var num = function (p, k, d) { var v = +p[k]; return isFinite(v) && p[k] !== '' && p[k] != null ? v : d; };
  var on = function (p, k, d) { return p[k] == null ? d : (p[k] === true || p[k] === 'true'); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var f = function (v) { return Math.round(v * 100) / 100; };
  var poly = function (pts) { return 'M' + pts.map(function (q) { return f(q[0]) + ' ' + f(q[1]); }).join('L') + 'Z'; };
  var PAL = { 'ink on paper': ['#111111', '#f4f4f4'], 'paper on ink': ['#f4f4f4', '#111111'], 'mist on basalt': ['#EEEDE8', '#24272B'], 'basalt on mist': ['#24272B', '#EEEDE8'], 'sulphur on basalt': ['#E5C04A', '#24272B'], 'oxide on mist': ['#A9532E', '#EEEDE8'] };
  var colors = function (p) { var c = PAL[p.palette]; return c ? { ink: c[0], ground: c[1] } : { ink: p.ink || '#111111', ground: p.ground || '#f4f4f4' }; };

  /* one bar along a line: from a to b (a is the axis end), w wide. Round ends make it a capsule; a bar shorter than
   * it is wide becomes a dot. `turn` swaps the two axes, so the same code draws upright and lying lines. */
  function bar(x, a, b, w, round, turn) {
    var lo = Math.min(a, b), hi = Math.max(a, b), len = hi - lo, pts = [], q, r;
    if (len < 0.2 || w < 0.05) return '';
    if (!round) pts = [[x - w / 2, lo], [x + w / 2, lo], [x + w / 2, hi], [x - w / 2, hi]];
    else {
      r = Math.min(w / 2, len / 2);
      for (q = 0; q <= 8; q++) pts.push([x - r * Math.cos(Math.PI * q / 8), lo + r - r * Math.sin(Math.PI * q / 8)]);
      for (q = 0; q <= 8; q++) pts.push([x + r * Math.cos(Math.PI * q / 8), hi - r + r * Math.sin(Math.PI * q / 8)]);
    }
    return poly(turn ? pts.map(function (p) { return [p[1], p[0]]; }) : pts);
  }
  /* one needle: w0 wide at y0, w1 wide at y1, with a round head at y0 when asked */
  function needle(x, y0, y1, w0, w1, head) {
    if (Math.abs(y1 - y0) < 0.2) return '';
    var s = y1 > y0 ? 1 : -1, pts = [], q, r = w0 / 2;
    if (head && r > 0.3) { for (q = 0; q <= 8; q++) pts.push([x - s * r * Math.cos(Math.PI * q / 8), y0 + s * r - s * r * Math.sin(Math.PI * q / 8)]); }
    else pts.push([x - s * w0 / 2, y0], [x + s * w0 / 2, y0]);
    pts.push([x + s * w1 / 2, y1], [x - s * w1 / 2, y1]);
    return poly(pts);
  }

  /* Body. A band lies along the body, and thick lines cross it. One wave pushes them out past the band on one
   * side, a second wave on the other; with overlap at 0 the two take turns, above 0 both are out in the middle.
   * Thin lines stand between the thick ones and stay inside the band: they grow in from one edge at the body's
   * start and shrink away to the other edge at its end, as wedges. */
  function body(p, t) {
    var n = clamp(Math.round(num(p, 'count', 34)), 2, 160), L = num(p, 'length', 720), pitch = L / n, h = num(p, 'band', 0.15) * 280;
    var ampA = num(p, 'amplitude', 0.5) * 280, ampB = num(p, 'amplitude2', 0.5) * 280;
    var wl = clamp(num(p, 'wavelength', 1.25), 0.1, 6), ov = num(p, 'overlap', 0) * Math.PI;
    var thick = clamp(num(p, 'thick', 0.5), 0, 1) * pitch, thin = clamp(num(p, 'thin', 0.08), 0, 1) * pitch, wedge = clamp(num(p, 'wedge', 0.4), 0, 1) * pitch;
    var ramp = clamp(num(p, 'ramp', 0.22), 0.001, 0.5), round = on(p, 'round', true), turn = on(p, 'lying', false), flip = on(p, 'flip', false) ? -1 : 1;
    var sp = Math.round(num(p, 'speed', 1)), dir = p.direction === 'left' ? -1 : 1, ph = TAU * ((((t || 0) % 1) + 1) % 1) * sp * dir, d = '', i;
    for (i = 0; i < n; i++) {
      var x = -L / 2 + (i + 0.5) * pitch, th = TAU * ((i + 0.5) / n - 0.5) / wl - ph;
      var a = ampA * Math.max(0, -Math.sin(th - ov)), b = ampB * Math.max(0, Math.sin(th + ov));
      d += bar(x, flip * (-h - a), flip * (h + b), thick, round, turn);
      if (thin > 0 && i < n - 1) { // the thin line between this thick one and the next
        var xt = x + pitch / 2, q = (i + 1) / n, y0 = -h, y1 = h, w0 = thin, w1 = thin, len;
        if (q < ramp) { y1 = -h + 2 * h * q / ramp; len = (y1 - y0) / (2 * h); w0 = thin + (wedge - thin) * (1 - len); w1 = 0; }
        else if (q > 1 - ramp) { y0 = h - 2 * h * (1 - q) / ramp; len = (y1 - y0) / (2 * h); w0 = thin + (wedge - thin) * (1 - len); w1 = 0; }
        var pts = [[xt - w0 / 2, flip * y0], [xt + w0 / 2, flip * y0], [xt + w1 / 2, flip * y1], [xt - w1 / 2, flip * y1]];
        if (y1 - y0 > 0.3) d += poly(turn ? pts.map(function (v) { return [v[1], v[0]]; }) : pts);
      }
    }
    var c = colors(p);
    return { d: d || 'M0 0', rot: 'translate(600 400)', ink: c.ink, ground: c.ground };
  }

  /* Spikes. Two combs half a step apart share the frame. The first starts with a round head at wave A and thins on
   * its way to the bottom edge. The second hangs from the top edge and thins to a point at wave B, which runs ahead
   * of wave A; a short hanging needle is a fat one, a long one is slim. */
  function spikes(p, t) {
    var W = 1200, H = 800, n = clamp(Math.round(num(p, 'count', 44)), 2, 160), pitch = W / n;
    var amp = num(p, 'amplitude', 0.7) * H / 2, wl = clamp(num(p, 'wavelength', 1.6), 0.1, 6) * W, lead = num(p, 'lead', 0.18) * TAU, lift = num(p, 'lift', 0.05) * H / 2;
    var thick = clamp(num(p, 'thick', 0.5), 0, 1) * pitch, thin = clamp(num(p, 'thin', 0.06), 0, 1) * pitch, hang = clamp(num(p, 'hang', 0.5), 0, 1) * pitch;
    var sp = Math.round(num(p, 'speed', 1)), dir = p.direction === 'left' ? -1 : 1, ph = TAU * ((((t || 0) % 1) + 1) % 1) * sp * dir, d = '', i;
    for (i = -1; i <= n; i++) {
      var xa = -W / 2 + (i + 0.5) * pitch, xb = xa + pitch / 2;
      var ya = clamp(lift - amp * Math.sin(TAU * xa / wl - ph), -H / 2, H / 2), yb = clamp(lift - amp * Math.sin(TAU * xb / wl - ph + lead), -H / 2, H / 2);
      d += needle(xa, ya, H / 2, thick, thin, true);
      d += needle(xb, -H / 2, yb, hang * (1 - 0.72 * (yb + H / 2) / H), 0, false);
    }
    var c = colors(p);
    return { d: d || 'M0 0', rot: 'translate(600 400)', ink: c.ink, ground: c.ground };
  }

  /* Needles. The spikes drawing as a body of its own: a box of a given width and height, not the whole frame.
   * One comb starts with a round head on wave A, runs at full width for the length of `capsule`, then thins on its
   * way to the far edge of the box. The comb between hangs from the near edge down to wave B, which runs ahead of
   * wave A: a point with `foot` at 0, a thick round end on the long ones with `foot` up. `lying` turns the body on its side. */
  function needles(p, t) {
    var W = num(p, 'width', 760), H = num(p, 'height', 520), n = clamp(Math.round(num(p, 'count', 36)), 2, 160), pitch = W / n, turn = on(p, 'lying', false);
    var amp = num(p, 'amplitude', 0.7) * H / 2, wl = clamp(num(p, 'wavelength', 1.6), 0.1, 6) * W, lead = num(p, 'lead', 0.18) * TAU, lift = num(p, 'lift', 0) * H / 2;
    var thick = clamp(num(p, 'thick', 0.5), 0, 1) * pitch, thin = clamp(num(p, 'thin', 0.06), 0, 1) * pitch, hang = clamp(num(p, 'hang', 0.5), 0, 1) * pitch, cap = clamp(num(p, 'capsule', 0), 0, 1) * H, foot = clamp(num(p, 'foot', 0), 0, 1);
    var sp = Math.round(num(p, 'speed', 1)), dir = p.direction === 'left' ? -1 : 1, tw = (((t || 0) % 1) + 1) % 1, ph = TAU * tw * sp * dir, d = '', i, q;
    // Two oscillators, as on the Wave board: A carries the heads, B the hanging lines. With `amplitude2` set, B has its
    // own height, length, speed and direction, so one can travel right while the other travels left; without it, B is
    // A running `lead` ahead. Speeds are whole cycles per loop, so the loop always closes. Sync locks B to A at a harmonic.
    var two = p.amplitude2 != null && p.amplitude2 !== '', ampB = amp, wlB = wl, liftB = lift, phB = ph - lead;
    if (two) {
      // speeds here are cycles per loop length and need not be whole: the board lets time run on instead of wrapping it
      var spA = num(p, 'speed', 1), spB = num(p, 'speed2', 1), dirB = (p.direction2 === 'left' ? -1 : 1) * (spB < 0 ? -1 : 1), cycA = Math.abs(spA), cycB = Math.abs(spB);
      tw = t || 0;
      ampB = num(p, 'amplitude2', 0.7) * H / 2; wlB = clamp(num(p, 'wavelength2', 1.6), 0.1, 6) * W; liftB = num(p, 'lift2', num(p, 'lift', 0)) * H / 2;
      if (on(p, 'sync', false)) { var hr = String(p.harmonic || '1:1').split(':'), hn = Math.max(1, +hr[0] || 1), hd = Math.max(1, +hr[1] || 1); wlB = wl * hd / hn; cycB = cycA * hn; cycA = cycA * hd; }
      ph = TAU * tw * cycA * dir; phB = TAU * tw * cycB * dirB + num(p, 'offset', 0) * TAU;
    }
    var out = function (pts) { return poly(turn ? pts.map(function (v) { return [v[1], v[0]]; }) : pts); };
    for (i = 0; i < n; i++) {
      var xa = -W / 2 + (i + 0.5) * pitch, xb = xa + pitch / 2;
      var ya = clamp(lift - amp * Math.sin(TAU * xa / wl - ph), -H / 2, H / 2), yb = clamp(liftB - ampB * Math.sin(TAU * xb / wlB - phB), -H / 2, H / 2);
      var r = thick / 2, mid = Math.min(H / 2, ya + r + cap), pts = [];
      if (H / 2 - ya > 0.5) { // head, full-width run, then the taper to the far edge
        for (q = 0; q <= 8; q++) pts.push([xa - r * Math.cos(Math.PI * q / 8), Math.min(H / 2, ya + r - r * Math.sin(Math.PI * q / 8))]);
        pts.push([xa + r, mid], [xa + thin / 2, H / 2], [xa - thin / 2, H / 2], [xa - r, mid]);
        d += out(pts);
      }
      if (i < n - 1 && yb + H / 2 > 0.5) {
        // the hanging line: short, it is a fat wedge ending in a point; with `foot`, the longer it gets the slimmer
        // its top and the thicker its lower end, which then closes round on wave B
        var s = (yb + H / 2) / H, grown = clamp((s - 0.15) / 0.35, 0, 1), wb = foot * thick * grown * grown * (3 - 2 * grown), rb = wb / 2;
        var slim = Math.min(thin, hang), w = foot > 0 ? slim + (hang - slim) * Math.pow(1 - Math.min(1, s / 0.6), 2) : hang * (1 - 0.72 * s), hp = [[xb - w / 2, -H / 2], [xb + w / 2, -H / 2]];
        if (rb > 0.3) { for (q = 0; q <= 8; q++) hp.push([xb + rb * Math.cos(Math.PI * q / 8), yb - rb + rb * Math.sin(Math.PI * q / 8)]); }
        else hp.push([xb, yb]);
        d += out(hp);
      }
    }
    var c = colors(p);
    return { d: d || 'M0 0', rot: 'translate(600 400)', ink: c.ink, ground: c.ground };
  }

export { body, spikes, needles };
