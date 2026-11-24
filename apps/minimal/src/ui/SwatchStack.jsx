import Icon from './Icon.jsx'

/* The fill and stroke pair: fill in front, stroke behind (a ring), the focused one on top; the swap arrows and the
   none slash at its corners. KOL's SwatchStack, drawn in this style. */
export default function SwatchStack({ fillColor, strokeColor, activePaint = 'fill', onPick, onSwap, onClear, size = 24 }) {
  const chip = (paint) => {
    const front = activePaint === paint
    const off = paint === 'fill' ? 0 : size * 0.4
    return (
      <button
        key={paint}
        type="button"
        aria-label={paint === 'fill' ? 'Fill color' : 'Stroke color'}
        onClick={() => onPick?.(paint)}
        className={`absolute rounded-full outline-none focus-visible:outline-1 focus-visible:outline-fg ${front ? 'z-10' : ''}`}
        style={{
          left: off, top: off, width: size, height: size,
          background: paint === 'fill' ? fillColor : 'var(--color-panel)',
          boxShadow: paint === 'stroke' ? `inset 0 0 0 ${Math.round(size / 5)}px ${strokeColor}` : `0 0 0 1px var(--color-line-strong)`,
        }}
      />
    )
  }
  const box = size * 1.4
  return (
    <div className="relative shrink-0" style={{ width: box + 8, height: box }}>
      {chip('stroke')}
      {chip('fill')}
      <button type="button" aria-label="Swap colors" onClick={onSwap} className="absolute top-0 right-0 flex size-3 items-center justify-center text-muted outline-none hover:text-fg">
        <Icon name="swap" size={10} />
      </button>
      <button type="button" aria-label="Clear color" onClick={onClear} className="absolute bottom-0 left-0 z-20 size-2.5 rounded-full bg-[linear-gradient(to_top_right,var(--color-fg)_42%,var(--color-muted)_42%,var(--color-muted)_58%,var(--color-fg)_58%)] outline-none" />
    </div>
  )
}
