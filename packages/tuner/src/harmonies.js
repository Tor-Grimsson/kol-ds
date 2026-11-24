/* Harmonies: the ratios and scales every measure grows by.
 * Carried verbatim from kol-branding's line-swell.js (the Line Swell canvas, copied 2026-11-18); only the module seams are new. */

var HARMONY = {
  'golden': { r: [1, 1.618] }, 'octave 1:2': { r: [1, 2] }, 'fifth 2:3': { r: [2, 3] }, 'fourth 3:4': { r: [3, 4] },
  'major third 4:5': { r: [4, 5] }, 'minor third 5:6': { r: [5, 6] }, '2:5': { r: [2, 5] }, '1:3': { r: [1, 3] },
  'major scale': { s: [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1]] },
  'minor scale': { s: [[1, 1], [9, 8], [6, 5], [4, 3], [3, 2], [8, 5], [9, 5], [2, 1]] },
  'dorian': { s: [[1, 1], [9, 8], [6, 5], [4, 3], [3, 2], [5, 3], [9, 5], [2, 1]] },
  'phrygian': { s: [[1, 1], [16, 15], [6, 5], [4, 3], [3, 2], [8, 5], [9, 5], [2, 1]] },
  'lydian': { s: [[1, 1], [9, 8], [5, 4], [45, 32], [3, 2], [5, 3], [15, 8], [2, 1]] },
  'mixolydian': { s: [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [9, 5], [2, 1]] },
  'pentatonic': { s: [[1, 1], [9, 8], [5, 4], [3, 2], [5, 3], [2, 1]] }
};
function divisions(name) {
  var h = HARMONY[name] || HARMONY.golden, out = [];
  if (h.s) out = h.s.map(function (q) { return { d: q[0] / q[1] - 1, t: q[0] + '/' + q[1] }; });
  else { var t = h.r[0] / (h.r[0] + h.r[1]); out = [0, t * t, t, 1 - t, 1 - t * t, 1].map(function (v) { return { d: v, t: (Math.round(v * 1000) / 1000).toString() }; }); }
  out.sort(function (a, b) { return a.d - b.d; });
  return out.filter(function (q, i) { return !i || q.d - out[i - 1].d > 0.004; });
}

function systemGrow(H0, k) { // a ratio multiplies every time; a scale climbs its chord: root, third, fifth, octave, and on
  if (H0.r) return Math.pow(H0.r[1] / H0.r[0], k);
  var ch = [H0.s[0], H0.s[2], H0.s[4]], q = ch[k % 3];
  return q[0] / q[1] * Math.pow(2, Math.floor(k / 3));
}
var harmonies = Object.keys(HARMONY)
export { HARMONY, divisions, systemGrow, harmonies }
