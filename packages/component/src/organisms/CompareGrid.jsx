import { useMemo, useState } from 'react'
import IconPlate from '../atoms/IconPlate.jsx'
import IconToggle from '../atoms/IconToggle.jsx'
import Pill from '../atoms/Pill.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import ViewToggle from '../atoms/ViewToggle.jsx'

/* taxonomy-ok: organism — a toolbar of atoms over a wall of IconPlate pairs */

const SIZES = [24, 48, 96, 128]
const GROUNDS = [
  { value: 'dark', label: 'Dark ground', icon: 'mode-toggle-01' },
  { value: 'light', label: 'Light ground', icon: 'brightness' },
]
/* states are the consumer's words (monitor: same · redrawn · missing); shown capitalised, in the order
 * they first appear */
const stateLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const ACTUAL = 16

/* a side is a node or a renderer `(ctx) => node`; ctx is `{ size, ground, guide }` */
const draw = (side, ctx) => (typeof side === 'function' ? side(ctx) : side)

function Side({ name, item, side, size, ground, guide, showActual }) {
  const node = item[side]
  const missing = node == null
  return (
    <span className="inline-flex flex-col items-center gap-2">
      <IconPlate size={size} ground={ground} guide={guide && !missing}>
        {missing ? <span className="kol-mono-10 opacity-60 px-1 text-center break-all">{item.candidate ?? item.label}</span> : draw(node, { size, ground, guide })}
      </IconPlate>
      <span className="flex items-center gap-2">
        {showActual && !missing && <IconPlate size={ACTUAL} ground={ground}>{draw(node, { size: ACTUAL, ground, guide: false })}</IconPlate>}
        <span className="kol-mono-12 text-meta">{name}</span>
      </span>
    </span>
  )
}

/**
 * CompareGrid — Two versions of many things, side by side. Each item is a pair of plates, A beside B, each
 * side named in words, the item's name under the pair (CompareGridDevTab, kol-monitor 2026-10-17 — user:
 * *"why are we inventing the wheel for this every time in multiple repos … the way you diff local vs DS is
 * very confusing, its ill labeled, hard to read"*). The open-questions icon review was the readable one;
 * this is it, for any two renderers.
 *
 * The toolbar is controls, not text: size (24 · 48 · 96 · 128), ground, guide, and a filter by state. A
 * side draws at the chosen size on an `IconPlate`, with its real 16px size beside its name. A missing side
 * is an empty plate carrying the item's name.
 *
 * @param {Array}  items     `[{ id, label, a, b, state?, candidate? }]` — `a` / `b` a node, or
 *                           `({ size, ground, guide }) => node` (an Icon sized to `size`); `state` is the consumer's
 *                           word ('same' · 'redrawn' · 'missing'), a chip and the filter; `candidate` names what an
 *                           empty side would map to
 * @param {Object} labels    `{ a, b }` — what each side IS ("monitor" / "kol-icons", "old" / "new")
 * @param {number} [defaultSize=96]
 * @param {'light'|'dark'} [defaultGround='light']
 * @param {boolean} [defaultGuide=true]
 * @param {boolean} [showActual=true]  the 16px real size beside each side's name
 */
export default function CompareGrid({ items = [], labels = { a: 'A', b: 'B' }, defaultSize = 96, defaultGround = 'light', defaultGuide = true, showActual = true, className = '' }) {
  const [size, setSize] = useState(defaultSize)
  const [ground, setGround] = useState(defaultGround)
  const [guide, setGuide] = useState(defaultGuide)
  const [filter, setFilter] = useState('all')

  const states = useMemo(() => [...new Set(items.map((i) => i.state).filter(Boolean))], [items])
  const counts = useMemo(() => Object.fromEntries(states.map((s) => [s, items.filter((i) => i.state === s).length])), [items, states])
  const hasStates = states.length > 0
  const shown = filter === 'all' ? items : items.filter((i) => i.state === filter)

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedToggle ariaLabel="Size" value={size} onChange={setSize} options={SIZES.map((v) => ({ value: v, label: String(v) }))} size="sm" />
        <ViewToggle variant="icon" options={GROUNDS} viewMode={ground} onViewChange={setGround} />
        <IconToggle icon="grid" label="Guide" title="Keyline guide" pressed={guide} onChange={setGuide} size="sm" />
        {hasStates && (
          <SegmentedToggle
            ariaLabel="Show"
            value={filter}
            onChange={setFilter}
            size="sm"
            options={[{ value: 'all', label: `All ${items.length}` }, ...states.map((s) => ({ value: s, label: `${stateLabel(s)} ${counts[s]}` }))]}
          />
        )}
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${2 * size + 52}px), 1fr))` }}>
        {shown.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-3 rounded border border-fg-08 p-3">
            <div className="flex items-start gap-3">
              <Side name={labels.a} item={item} side="a" size={size} ground={ground} guide={guide} showActual={showActual} />
              <Side name={labels.b} item={item} side="b" size={size} ground={ground} guide={guide} showActual={showActual} />
            </div>
            <span className="flex flex-wrap items-center justify-center gap-2">
              <span className="kol-mono-12 text-emphasis">{item.label}</span>
              {item.state && <Pill size="sm" variant={item.state === 'same' ? 'secondary' : 'primary'}>{stateLabel(item.state)}</Pill>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
