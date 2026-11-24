import Icon from './Icon.jsx'
import InputNumber from './InputNumber.jsx'

/* A number with its step buttons; the value is clamped to min and max. */
export default function Stepper({ value, min = 0, max = 100, step = 1, onChange, chars = 3, ...rest }) {
  const set = (n) => { if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n))) }
  const btn = 'flex h-3 w-4 items-center justify-center text-faint outline-none hover:text-fg'
  return (
    <div className="flex h-7 items-center rounded-field bg-field pr-1">
      <InputNumber value={value} chars={chars} onCommit={(s) => set(Math.round(Number(s)))} className="bg-transparent hover:bg-transparent" {...rest} />
      <div className="flex flex-col">
        <button type="button" aria-label="Increment" className={btn} onClick={() => set(value + step)}><Icon name="chevron-up" size={10} /></button>
        <button type="button" aria-label="Decrement" className={btn} onClick={() => set(value - step)}><Icon name="chevron-down" size={10} /></button>
      </div>
    </div>
  )
}
