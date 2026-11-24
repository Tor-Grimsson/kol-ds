import InputNumber from './InputNumber.jsx'

/* `readout` off when an editable box stands beside it (InputNumber). With `onCommit` the readout is edited in place: the
   mono value at the right takes a typed number or expression (Enter or blur commits, Escape restores), no box drawn. */
export default function Slider({ value, min, max, step, onChange, onCommit, format = (v) => v, readout = true, label }) {
  const p = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        type="range"
        className="range min-w-0 flex-1"
        style={{ '--p': `${p}%` }}
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {readout && (onCommit
        ? <InputNumber value={format(value)} onCommit={onCommit} chars={Math.max(3, String(format(value)).length)} aria-label={label} className="min-w-10 justify-end bg-transparent px-0 hover:bg-transparent [&_input]:text-right" />
        : <span className="w-10 shrink-0 text-right font-mono text-label text-fg">{format(value)}</span>)}
    </div>
  )
}
