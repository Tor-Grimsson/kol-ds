// The transport — one clock for everything time-driven (knob expressions, a scope, an animated stage, a timeline).
// Plain JS, no React (TransportAndTimeline, kol-mirror 2026-10-28 — user: *"fxr uses the loop from transport controls. so
// its two components together … this should live in DS"*).
//
// kol-mirror's `hooks/transport.js`, verbatim, made a factory: `createTransport()` returns one clock, so an app keeps its
// own (`export const transport = createTransport()`). Its contract, carried:
//   `now()` is the SHAPED time in seconds — it stands still while paused, runs at `rate`, and in reverse / ping-pong folds
//   over the loop window (ease-in-out on the turnarounds by `ease`); `swing` slides each cycle's midpoint; `hold` freezes the
//   output while time keeps running underneath. The loop is a WINDOW (`loopIn` · `loopOut`, absolute seconds, read
//   min-first); `looping` arms it for forward, the folding modes always use it. Nothing autoplays.
//
// kol-fxr's transport (`editor/params/transport.js`) adds three things, also here:
//   `phase()` — the position in the loop as 0..1 (fxr's `t`, the loops' `u`): `(now − in) / length`, wrapped
//   `epoch` — a counter bumped ONLY by stop and home (never pause), so free-running state can key a fresh run on it
//   `loopSeconds` / `setLoopSeconds(s)` — the window's length; setting it moves OUT, IN stays
// What stays the app's: fxr's pointer and live sources, its keyframes. The clock reads `performance.now()` lazily and
// notifies only on a state change; a renderer that needs every frame asks for one (`useTransportFrame`).

export const TRANSPORT_MODES = ['forward', 'reverse', 'pingpong']
/* NOTHING AUTOPLAYS (mirror, user 2026-08-28): a clock boots paused; `reset()` restores its shape, never its run state */
export const TRANSPORT_DEFAULTS = { playing: false, rate: 1, mode: 'forward', loopIn: 0, loopOut: 8, swing: 0, ease: 0, looping: false, hold: false }

const nowSec = () => (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000
const easeInOut = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)
const wrap = (x, m) => ((x % m) + m) % m

/* SWING — "two ticks on one clock" (mirror, user 2026-08-28). Every loop cycle carries two beats; swing slides the midpoint
   between them, so the first runs long in wall time and the second catches up — a pure reparameterisation of the cycle. */
const swingU = (u, s) => {
  if (!s) return u
  const m = 0.5 + s * 0.4 // the moved midpoint: 0.5 (straight) → 0.9 (hard shuffle)
  return u < m ? (u / m) * 0.5 : 0.5 + ((u - m) / (1 - m)) * 0.5
}
const swung = (r, L, s) => (s ? (Math.floor(r / L) + swingU(wrap(r, L) / L, s)) * L : r)

export function createTransport(initial = {}) {
  let state = { ...TRANSPORT_DEFAULTS, ...initial }
  let base = 0 // rate-scaled seconds banked up to `anchor`
  let anchor = nowSec()
  let held = 0
  let epoch = 0
  const listeners = new Set()
  const emit = () => listeners.forEach((l) => l())

  const raw = () => (state.playing ? base + (nowSec() - anchor) * state.rate : base)
  const windowOf = () => ({ a: Math.min(state.loopIn, state.loopOut), L: Math.max(0.1, Math.abs(state.loopOut - state.loopIn)) })

  function shape(r) {
    const { mode, swing, ease, looping } = state
    const { a, L } = windowOf()
    const s = swing / 100
    if (mode === 'forward' && !looping) return swung(r, L, s)
    const t = swung(r, L, s)
    if (mode === 'forward') return a + wrap(t, L)
    if (mode === 'reverse') return a + (L - wrap(t, L))
    const p = wrap(t, 2 * L) / L // 0..2 — out and back
    const leg = p <= 1 ? p : 2 - p
    return a + (leg + (easeInOut(leg) - leg) * ease) * L
  }

  // Bank the elapsed time at the OLD rate before anything changes, so the clock never jumps.
  const set = (patch) => {
    // HOLD freezes the OUTPUT, not the clock — releasing it jumps to where the transport actually got to.
    if (patch.hold === true && !state.hold) held = shape(raw())
    base = raw()
    anchor = nowSec()
    state = { ...state, ...patch }
    emit()
  }

  const transport = {
    now: () => (state.hold ? held : shape(raw())),
    /* the position in the loop as 0..1 — fxr's `t` */
    phase() { const { a, L } = windowOf(); return wrap(transport.now() - a, L) / L },
    get playing() { return state.playing },
    get state() { return state },
    get epoch() { return epoch },
    get loopSeconds() { return windowOf().L },
    play() { if (!state.playing) set({ playing: true }) },
    pause() { if (state.playing) set({ playing: false }) },
    toggle() { if (state.playing) transport.pause(); else transport.play() },
    /* stop = pause + home + a new epoch (fxr's stop) */
    stop() { base = 0; anchor = nowSec(); epoch++; state = { ...state, playing: false }; emit() },
    /* THE HEAD (mirror, user 2026-10-15): START is raw 0 — in a loop or a fold that IS the window's start; END is the window's
       far edge. Run state is untouched — moving the head never starts or stops the clock. Home is fxr's rewind: a new epoch. */
    home() { base = 0; anchor = nowSec(); epoch++; emit() },
    end() {
      const { L } = windowOf()
      const free = state.mode === 'forward' && !state.looping
      base = free ? Math.max(state.loopIn, state.loopOut) : L - 0.001
      anchor = nowSec()
      emit()
    },
    /* the raw position, for a scrubber: shape(seek) lands on the timeline */
    seek(r) { base = Math.max(0, r); anchor = nowSec(); emit() },
    /* a 0..1 position in the loop (fxr's seek) */
    seekPhase(u) { const { L } = windowOf(); transport.seek(wrap(u, 1) * L) },
    setLoopSeconds(s) { const n = Math.max(0.1, Number(s) || 0.1); set({ loopOut: Math.min(state.loopIn, state.loopOut) + n }) },
    /* restores the clock's SHAPE, never its run state */
    reset() { const { playing, ...shapeDefaults } = TRANSPORT_DEFAULTS; set(shapeDefaults) },
    set,
    subscribe(l) { listeners.add(l); return () => listeners.delete(l) },
  }
  return transport
}

/* Timeline seconds → the raw position `seek` takes so `now()` lands there (mirror's TimeStrip `seekTo`).
   ponytail: a ping-pong seek lands on the OUT leg; the return leg is the same picture mirrored. */
export function seekToSeconds(transport, sec) {
  const t = transport.state
  const a = Math.min(t.loopIn, t.loopOut)
  const L = Math.max(0.1, Math.abs(t.loopOut - t.loopIn))
  if (t.mode === 'forward' && !t.looping) return transport.seek(sec)
  const u = Math.max(0, Math.min(L - 0.001, sec - a))
  if (t.mode === 'reverse') return transport.seek(L - u)
  return transport.seek(u)
}
