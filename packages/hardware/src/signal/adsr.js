/**
 * ADSR — the envelope engine (signal engine, 2026-09-27), ported from kol-monitor's
 * `modules/control/EnvelopeModule.jsx` so the rack module, the envelope generator and any scope
 * share one curve. Levels are 0…100 like every other signal here; map to a range with `toRange`.
 *
 * Params are the knob values, 0…100:
 *   attack · decay · release   → seconds via `stageSeconds` (0 → 5 ms, 100 → 2 s, linear — monitor's)
 *   sustain                    → the held level, 0…100
 *
 * `hold` is SECONDS, not a knob (app frame and curves, 2026-09-27): how long the gate stays open
 * once the envelope has reached sustain. Default 1 — the gate the engine always assumed
 * (`a + d + 1`), so an envelope without it draws exactly as before.
 */

export const ADSR_DEFAULTS = Object.freeze({ attack: 10, decay: 30, sustain: 70, release: 50, hold: 1 })

/** knob 0…100 → seconds, 5 ms … 2 s */
export const stageSeconds = (v) => 0.005 + (Math.max(0, Math.min(100, v)) / 100) * 1.995

/** a 0…100 level → [min, max] */
export const toRange = (level, min = 0, max = 100) => min + (level / 100) * (max - min)

/** Seconds the gate stays open: attack + decay + the sustain hold. */
export const gateSeconds = (params = ADSR_DEFAULTS) => {
  const p = { ...ADSR_DEFAULTS, ...params }
  return stageSeconds(p.attack) + stageSeconds(p.decay) + Math.max(0, p.hold)
}

/**
 * envelopeAt(t, params, { hold, cycle }) — the level at `t` seconds after the gate opens. The
 * gate stays open for `gateSeconds(params)`; the `hold` option (total gate seconds) overrides it.
 * Pure, so a scope can draw it and a timeline can scrub it. `cycle` repeats the whole envelope.
 */
export function envelopeAt(t, params = ADSR_DEFAULTS, { hold, cycle = false } = {}) {
  const { attack, decay, sustain, release } = { ...ADSR_DEFAULTS, ...params }
  const a = stageSeconds(attack)
  const d = stageSeconds(decay)
  const r = stageSeconds(release)
  const s = Math.max(0, Math.min(100, sustain))
  const gate = hold ?? gateSeconds(params)
  const length = gate + r
  let u = t
  if (cycle) u = ((t % length) + length) % length
  if (u < 0) return 0
  const held = (x) => (x < a ? (x / a) * 100 : x < a + d ? 100 - ((x - a) / d) * (100 - s) : s)
  if (u < gate) return held(u)
  const from = held(gate)
  const k = (u - gate) / r
  return k >= 1 ? 0 : from * (1 - k)
}

/** Total seconds of one envelope pass — for sizing a scope window. */
export const envelopeLength = (params = ADSR_DEFAULTS, { hold } = {}) => {
  const p = { ...ADSR_DEFAULTS, ...params }
  return (hold ?? gateSeconds(p)) + stageSeconds(p.release)
}

/**
 * createEnvelope() — the stateful form a rack module runs per frame (monitor's stage machine,
 * verbatim in behaviour): `step(dt, { gate, trig }, params)` → level 0…100. A rising `gate`
 * attacks and holds sustain until it drops; a rising `trig` is a one-shot A→D→R (with sustain 0,
 * D and R fold into one long decay); `cycle` loops.
 */
export function createEnvelope() {
  let stage = 'idle'
  let level = 0
  let releaseFrom = 0
  let oneShot = false
  let prevGate = false
  let prevTrig = false
  return {
    get stage() { return stage },
    get level() { return level },
    step(dt, { gate = false, trig = false } = {}, params = ADSR_DEFAULTS) {
      const { attack, decay, sustain, release, cycle = false } = { ...ADSR_DEFAULTS, ...params }
      const aT = stageSeconds(attack)
      const dT = stageSeconds(decay)
      const rT = stageSeconds(release)
      const sL = Math.max(0, Math.min(100, sustain))
      if (trig && !prevTrig) { stage = 'attack'; oneShot = true }
      prevTrig = trig
      if (cycle && stage === 'idle') stage = 'attack'
      if (gate && !prevGate) { stage = 'attack'; oneShot = false }
      if (!gate && prevGate && stage !== 'idle') { releaseFrom = level; stage = 'release' }
      prevGate = gate
      if (stage === 'attack') {
        level += (dt / aT) * 100
        if (level >= 100) { level = 100; stage = 'decay' }
      } else if (stage === 'decay') {
        const once = oneShot || (cycle && !gate)
        const dTime = once && sL <= 0 ? dT + rT : dT
        level -= (dt / dTime) * (100 - sL)
        if (level <= sL) {
          level = sL
          if (once) {
            if (sL > 0) { releaseFrom = level; stage = 'release' } else { stage = cycle ? 'attack' : 'idle'; oneShot = false }
          } else stage = 'sustain'
        }
      } else if (stage === 'sustain') {
        level = sL
        if (cycle && !gate) { releaseFrom = level; stage = 'release' }
      } else if (stage === 'release') {
        level -= (dt / rT) * (releaseFrom || 1)
        if (level <= 0) { level = 0; stage = cycle ? 'attack' : 'idle'; oneShot = false }
      }
      return level
    },
    reset() { stage = 'idle'; level = 0; releaseFrom = 0; oneShot = false; prevGate = false; prevTrig = false },
  }
}
