/**
 * The expression engine — ONE compiler for every scope, expression module and animated value in
 * the estate (signal engine, 2026-09-27). Before it there were four: kol-monitor's and kol-mirror's
 * `hooks/useExpressionValue.js`, the design editor's Oscilloscope (`loops/math/expression.js`) and
 * its modulation DSL (`params/expr.js`) — already drifted (monitor's helpers span [min, max],
 * mirror's always started at 0), and two of them handed user text straight to `new Function`.
 *
 * SEMANTICS — monitor's, the newest: every helper spans the caller's [min, max], so `wave(t)` is
 * min…max. With min = 0 that is exactly mirror's and the editor's `0…max`; with min 0 max 1 it is
 * labs' normalized "animate any value". `sin`/`cos` stay raw (−1…1).
 *
 * SAFETY — the design editor's two gates, in front of the Function sink: math-only characters,
 * and an identifier allowlist (the helpers, `t f min max`, and the caller's bus names), so
 * `sin.constructor(…)` dies at the gate. Browser globals are shadowed inside the body. A compiled
 * fn never throws and never returns a non-finite value (last good value, labs behaviour).
 *
 *   const { ok, fn } = compileExpression('wave(t*2)')
 *   fn(t, frame, min, max, bus)   // → number
 */

const HELPERS = `
  "use strict";
  var sin=Math.sin,cos=Math.cos,tan=Math.tan,atan2=Math.atan2,abs=Math.abs,floor=Math.floor,
      ceil=Math.ceil,round=Math.round,sqrt=Math.sqrt,pow=Math.pow,
      PI=Math.PI,TAU=Math.PI*2,PHI=1.618033988749895,E=Math.E,
      __span=max-min,
      __map=function(u){return min+u*__span},
      __ph=function(x){return((x%1)+1)%1},
      wave=function(x){return __map(sin(x)*0.5+0.5)},
      saw=function(x){return __map(__ph(x))},
      pulse=function(x,w){w=w||0.5;return __ph(x)<w?max:min},
      rand=function(){return __map(Math.random())},
      tri=function(x){var p=__ph(x);return __map(p<0.5?p*2:(1-p)*2)},
      ease=function(x,c){c=c||2;var p=__ph(x);var v=p<0.5?p*2:(1-p)*2;return __map(pow(v,c))},
      bell=function(x){var p=__ph(x);return __map(Math.exp(-pow((p-0.5)*6,2)))},
      exp=function(x){var p=__ph(x);return __map((Math.exp(p*3)-1)/(Math.exp(3)-1))},
      log=function(x){var p=__ph(x);return __map(Math.log(1+p*9)/Math.log(10))},
      step=function(x,n){n=n||4;return __map(floor(__ph(x)*n)/n)},
      clamp=function(x,a,b){return x<a?a:x>b?b:x},
      lerp=function(a,b,u){return a+(b-a)*u},
      mod=function(a,b){return((a%b)+b)%b},
      frac=function(x){return x-floor(x)},
      smooth=function(x){x=clamp(x,0,1);return x*x*(3-2*x)};
`

export const EXPRESSION_HELPERS = [
  'sin', 'cos', 'tan', 'atan2', 'abs', 'floor', 'ceil', 'round', 'sqrt', 'pow',
  'PI', 'TAU', 'PHI', 'E',
  'wave', 'saw', 'pulse', 'rand', 'tri', 'ease', 'bell', 'exp', 'log', 'step',
  'clamp', 'lerp', 'mod', 'frac', 'smooth',
]
const BASE = new Set([...EXPRESSION_HELPERS, 't', 'f', 'min', 'max'])
const CHARS = /^[\w\s+\-*/%(),.?:<>=!&|]+$/
const SHADOWED = [
  'globalThis', 'window', 'self', 'document', 'fetch', 'XMLHttpRequest', 'localStorage',
  'sessionStorage', 'indexedDB', 'navigator', 'location', 'top', 'parent', 'frames', 'opener',
  'Function', 'WebSocket', 'Worker', 'importScripts',
]
const IDENT = /^[A-Za-z_$][\w$]*$/
const FAIL = Object.freeze({ ok: false, fn: () => 0 })

const cache = new Map()

/**
 * compileExpression(expr, { bus }) → { ok, fn(t, f, min, max, busValues) }
 * `bus` names extra variables the expression may read (a module's CV inputs: `['a', 'b']`);
 * their values arrive as the fifth argument, an object. Never throws.
 */
export function compileExpression(expr, { bus = [] } = {}) {
  const src = String(expr ?? '').trim()
  if (!src) return FAIL
  const names = bus.filter((b) => IDENT.test(b) && !BASE.has(b))
  const key = `${names.join(',')}|${src}`
  const hit = cache.get(key)
  if (hit) return hit
  let entry = FAIL
  try {
    if (!CHARS.test(src)) throw new Error('chars')
    const allowed = new Set([...BASE, ...names])
    for (const m of src.matchAll(/[A-Za-z_$][\w$]*/g)) {
      if (!allowed.has(m[0])) throw new Error(`ident ${m[0]}`)
    }
    const busVars = names.length ? `var ${names.map((n) => `${n}=+(__bus&&__bus.${n})||0`).join(',')};` : ''
    // eslint-disable-next-line no-new-func
    const raw = new Function('t', 'f', 'min', 'max', '__bus', ...SHADOWED, `${HELPERS}${busVars}return (${src});`)
    if (typeof raw(1, 60, 0, 100, {}) !== 'number') throw new Error('not numeric')
    let last = 0
    entry = {
      ok: true,
      fn: (t, f = 0, min = 0, max = 100, busValues) => {
        try {
          const v = raw(t, f, min, max, busValues)
          if (typeof v === 'number' && Number.isFinite(v)) { last = v; return v }
          return last
        } catch { return last }
      },
    }
  } catch { /* FAIL */ }
  cache.set(key, entry)
  return entry
}

/** A typed string is an expression (not a plain number) when it has any letter but `e`
 *  (so `1e3` stays a number) — the rule monitor's and mirror's slider boxes use. */
export const isExpression = (str) => /[a-df-zA-DF-Z]/.test(String(str))

/**
 * Fit — the [min, max] a curve actually covers over a window, with 10% headroom on Y (labs /
 * mirror's Fit button). Evaluates at min 0 max 100, the helpers' reference scale, so fitting the
 * view never feeds back into the curve.
 */
export function fitRange(expr, { sec = 5, ofs = 0, bus } = {}) {
  const { ok, fn } = compileExpression(expr, { bus })
  if (!ok) return null
  const N = Math.min(20000, Math.max(300, Math.round(sec * 240)))
  let lo = Infinity
  let hi = -Infinity
  for (let i = 0; i <= N; i++) {
    const t = ofs + (i / N) * sec
    const v = fn(t, Math.round(t * 60), 0, 100)
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  if (!(hi > lo)) { lo -= 1; hi += 1 }
  const m = (hi - lo) * 0.1
  return { min: Math.floor(lo - m), max: Math.ceil(hi + m) }
}
