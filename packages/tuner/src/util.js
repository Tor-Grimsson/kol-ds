/* Shared helpers: settings read as numbers, a seeded hash, a shallow merge, rounding.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

function numOf(p) {
  var m = p.motion && p.motion !== 'off' ? p.motion : null, amt = +p.motionAmount || 0, tt = +p.motionT || 0;
  var dv = !m ? 0 : p.motionKind === 'run' ? amt * tt : amt * Math.sin(Math.PI * 2 * tt);
  return function (k, d) { var v = p[k]; v = v === undefined || v === null || v === '' || isNaN(+v) ? d : +v; return k === m ? v + dv : v; };
}

function hash(x, y, seed) { var n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return n - Math.floor(n); }

function ext() { var o = {}; for (var a = 0; a < arguments.length; a++) for (var k in arguments[a]) o[k] = arguments[a][k]; return o; }

var TAU = Math.PI * 2;
function r2(v) { return Math.round(v * 100) / 100; }
export { numOf, hash, ext, TAU, r2 }
