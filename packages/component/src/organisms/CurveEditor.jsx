import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import LabeledControl from '../molecules/LabeledControl.jsx'

/* The six curve kinds the picker offers. A consumer with more passes `kinds`. */
export const CURVE_KINDS = [
  { value: 'epicycle', label: 'Epicycle' },
  { value: 'polar',    label: 'Polar' },
  { value: 'param2d',  label: 'Parametric 2D' },
  { value: 'param3d',  label: 'Parametric 3D' },
  { value: 'points',   label: 'Points' },
  { value: 'maurer',   label: 'Maurer rose' },
]

const TAU = Math.PI * 2

/* Fresh per-kind defaults — the engine's `defaultCustomFor`, kept as the
 * default so a kind switch has somewhere to land. Injectable via `defaultFor`. */
export function defaultCurveFor(kind) {
  switch (kind) {
    case 'epicycle': return { kind, turns: 2, terms: [{ amp: 1, freq: 1, phase: 0 }] }
    case 'param2d':  return { kind, range: [0, TAU], x: 'sin(3*t)', y: 'sin(2*t + 0.6)' }
    case 'param3d':  return { kind, range: [0, 6 * TAU], x: 'cos(t)', y: 'sin(t)', z: '0.3*t' }
    case 'points':   return { kind, count: 1400, a: 'k*TAU/(PHI*PHI)', r: 'sqrt(k)' }
    case 'maurer':   return { kind, n: 6, d: 71 }
    default:         return { kind: 'polar', range: [0, 6 * TAU], r: '3*sin(6*th)' }
  }
}

const num = (v, fb) => { const n = Number(v); return Number.isFinite(n) ? n : fb }

/* Draft/commit number — `Input onCommit` IS the idiom since 0.196.0. */
function NumberField({ value, onCommit, ...rest }) {
  return <Input type="number" variant="filled" size="sm" {...rest} value={String(value)} onCommit={onCommit} />
}

/* Draft/commit text input for an expression, mono. A string that does not
 * validate is STILL committed — the renderer keeps its last good function —
 * and the field shows the hint until it is fixed. That is what makes live
 * expression editing bearable; keep it. */
function ExprField({ label, value, args, validate, onCommit }) {
  const bad = validate && String(value ?? '').trim() !== '' && !validate(value, args)
  return (
    <LabeledControl label={label} hint={bad ? 'doesn’t compile — last good kept' : undefined}>
      <Input
        variant="filled" size="sm" className="w-full"
        style={{ fontFamily: 'var(--kol-font-family-mono, monospace)', fontVariantLigatures: 'none' }}
        value={value ?? ''}
        onCommit={(v) => { if (v !== value) onCommit(v) }}
      />
    </LabeledControl>
  )
}

/* Start/end of the curve's parameter range. */
function RangeFields({ def, commit }) {
  const [a, b] = def.range || [0, 1]
  return (
    <div className="grid grid-cols-2 gap-2">
      <LabeledControl label="Start">
        <NumberField value={a} onCommit={(v) => commit({ range: [num(v, a), b] })} />
      </LabeledControl>
      <LabeledControl label="End">
        <NumberField value={b} onCommit={(v) => commit({ range: [a, num(v, b)] })} />
      </LabeledControl>
    </div>
  )
}

/* Epicycle = a sum of rotating vectors; each term {amp, freq, phase} is one
 * vector (add/remove terms = the vector array). */
function TermsEditor({ def, commit }) {
  const terms = def.terms || []
  const setTerm = (i, key, v) => commit({ terms: terms.map((tm, j) => (j === i ? { ...tm, [key]: v } : tm)) })
  const addTerm = () => commit({ terms: [...terms, { amp: 0.5, freq: 2, phase: 0 }] })
  const removeTerm = (i) => commit({ terms: terms.filter((_, j) => j !== i) })
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="kol-helper-10 text-meta">Vectors</span>
        <Button variant="primary" size="sm" onClick={addTerm}>Add</Button>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1.5 items-center min-w-0 [&>*]:min-w-0">
        <span className="kol-helper-10 text-fg-48 text-center">amp</span>
        <span className="kol-helper-10 text-fg-48 text-center">freq</span>
        <span className="kol-helper-10 text-fg-48 text-center">phase</span>
        <span />
        {terms.map((tm, i) => (
          <TermRow key={i} term={tm} onSet={(k, v) => setTerm(i, k, v)} onRemove={() => removeTerm(i)} canRemove={terms.length > 1} />
        ))}
      </div>
    </div>
  )
}

function TermRow({ term, onSet, onRemove, canRemove }) {
  const cell = (key, fallback) => (
    <NumberField value={term[key] ?? fallback} onCommit={(v) => onSet(key, num(v, term[key] ?? fallback))} />
  )
  return (
    <>
      {cell('amp', 1)}
      {cell('freq', 1)}
      {cell('phase', 0)}
      <Button variant="ghost" size="sm" onClick={onRemove} disabled={!canRemove} aria-label="Remove vector">×</Button>
    </>
  )
}

/**
 * CurveEditor — curve authoring: a kind picker, per-kind ranges and
 * EXPRESSION fields, and the epicycle term list.
 *
 * Lifted from kol-fxr's editor (`compose/inspectors/CurveEditor.jsx`,
 * `editor-panels-the-held-specs` A4, 2026-09-03) with its two couplings
 * dropped: the compiler (`loops/math/mathfn`) is the `validate` seam, and the
 * stock-clip table (`loops/math/curves`) is the `stock` prop.
 *
 * FORK-ON-EDIT, kept exactly: while the layer shows a stock clip the editor
 * displays that clip's definition (`value`), and the FIRST commit forks it —
 * `onChange` fires with `fork: true` and the extras the fork should seed
 * (`copies` / `spiral` from the stock clip, unless the caller says they were
 * already moved). The shared clip table is never mutated; the caller writes
 * `{ clip: 'custom', custom, ...extras }`. A kind switch replaces the whole
 * def with that kind's defaults.
 *
 * @param {Object} value - The curve def being edited: `{ kind, range?, r?, x?, y?, z?, turns?, terms?, count?, a?, n?, d? }`
 * @param {Function} onChange - `(nextDef, { fork, extras }) => void` — `fork` is true when this commit leaves a stock clip; `extras` carries what the fork seeds
 * @param {{label: string, copies?: number, spiral?: number, layerCopies?: number, layerSpiral?: number}} [stock] - Present while the layer still shows a STOCK clip: its label, its authored `copies` / `spiral`, and the layer's current ones so the fork only seeds what the user has not moved. Omit once the curve is custom
 * @param {Function} [validate] - `(expr, args) => boolean` — the consumer's compiler; omitted, every expression is accepted without a hint
 * @param {Array<{value: string, label: string}>} [kinds] - The kind picker (default `CURVE_KINDS`)
 * @param {Function} [defaultFor] - `(kind) => def` for a kind switch (default `defaultCurveFor`)
 * @param {string} [className] - Extra classes on the editor
 */
export default function CurveEditor({ value, onChange, stock = null, validate, kinds = CURVE_KINDS, defaultFor = defaultCurveFor, className = '' }) {
  const def = value ?? defaultFor('polar')
  const kind = def.kind || 'polar'
  const isCustom = stock == null

  /* Any commit forks a stock clip — and seeds the copies/spiral the stock
   * clip authored, unless the layer already moved them. */
  const commit = (defPatch) => {
    const extras = {}
    if (!isCustom) {
      if ((stock.layerCopies ?? 1) <= 1 && (stock.copies ?? 0) > 1) extras.copies = stock.copies
      if (!((stock.layerSpiral ?? 0) > 0) && (stock.spiral ?? 0) > 0) extras.spiral = stock.spiral
    }
    onChange?.({ ...def, ...defPatch }, { fork: !isCustom, extras })
  }
  const setKind = (k) => {
    if (k === kind) return
    onChange?.(defaultFor(k), { fork: !isCustom, extras: {} })
  }

  return (
    <div className={`kol-curve-editor flex flex-col gap-3 ${className}`.trim()}>
      <span className="kol-helper-10 text-meta">Curve</span>
      <Dropdown size="sm" variant="subtle" className="w-full" options={kinds} value={kind} onChange={setKind} />
      {!isCustom && (
        <p className="kol-helper-10 text-meta">Editing “{stock.label}” forks it to a custom curve.</p>
      )}

      {kind === 'epicycle' && (
        <>
          <LabeledControl label="Turns">
            <NumberField value={def.turns ?? 1} onCommit={(v) => commit({ turns: num(v, def.turns ?? 1) })} />
          </LabeledControl>
          <TermsEditor def={def} commit={commit} />
        </>
      )}

      {kind === 'polar' && (
        <>
          <RangeFields def={def} commit={commit} />
          <ExprField label="r(th)" value={def.r} args={['th']} validate={validate} onCommit={(v) => commit({ r: v })} />
        </>
      )}

      {(kind === 'param2d' || kind === 'param3d') && (
        <>
          <RangeFields def={def} commit={commit} />
          <ExprField label="x(t)" value={def.x} args={['t']} validate={validate} onCommit={(v) => commit({ x: v })} />
          <ExprField label="y(t)" value={def.y} args={['t']} validate={validate} onCommit={(v) => commit({ y: v })} />
          {kind === 'param3d' && <ExprField label="z(t)" value={def.z} args={['t']} validate={validate} onCommit={(v) => commit({ z: v })} />}
        </>
      )}

      {kind === 'points' && (
        <>
          <LabeledControl label="Count">
            <NumberField value={def.count ?? 1400} onCommit={(v) => commit({ count: Math.max(1, Math.round(num(v, def.count ?? 1400))) })} />
          </LabeledControl>
          <ExprField label="a(k)" value={def.a} args={['k']} validate={validate} onCommit={(v) => commit({ a: v })} />
          <ExprField label="r(k)" value={def.r} args={['k']} validate={validate} onCommit={(v) => commit({ r: v })} />
        </>
      )}

      {kind === 'maurer' && (
        <div className="grid grid-cols-2 gap-2">
          <LabeledControl label="n"><NumberField value={def.n ?? 6} onCommit={(v) => commit({ n: num(v, def.n ?? 6) })} /></LabeledControl>
          <LabeledControl label="d°"><NumberField value={def.d ?? 71} onCommit={(v) => commit({ d: num(v, def.d ?? 71) })} /></LabeledControl>
        </div>
      )}
    </div>
  )
}
