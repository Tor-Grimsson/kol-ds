/**
 * FlipToggle — the eurorack flip switch, two or three positions (kol-monitor's
 * rack, lifted 2026-09-01). `positions=2`: `value` is a boolean; `positions=3`:
 * `value` is 0 · 1 · 2 (top, centre, bottom / left, centre, right).
 *
 * @param {boolean|number} value · onChange
 * @param {string}   labelA · labelB · labelC   up to three labels along the switch
 * @param {'vertical'|'horizontal'} variant   (default vertical)
 * @param {2|3}      positions
 */
export default function FlipToggle({ value, onChange, labelA, labelB, labelC, variant = 'vertical', positions = 2 }) {
  const isHorizontal = variant === 'horizontal'

  const handleClick = () => {
    if (positions === 3) {
      onChange((value + 1) % 3)
    } else {
      onChange(!value)
    }
  }

  const trackW = isHorizontal ? (positions === 3 ? 24 : 16) : 8
  const trackH = isHorizontal ? 8 : (positions === 3 ? 24 : 16)
  const thumbW = isHorizontal ? 8 : 6
  const thumbH = isHorizontal ? 6 : 8

  let thumbPos
  if (positions === 3) {
    const offsets = [0, 8, 15]
    thumbPos = isHorizontal
      ? { top: 0, left: offsets[value], transition: 'left 0.1s' }
      : { left: 0, top: offsets[value], transition: 'top 0.1s' }
  } else {
    thumbPos = isHorizontal
      ? { top: 0, left: value ? 0 : 7, transition: 'left 0.1s' }
      : { left: 0, top: value ? 0 : 7, transition: 'top 0.1s' }
  }

  return (
    <div
      onClick={handleClick}
      style={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', alignItems: 'center', gap: 2, cursor: 'pointer', userSelect: 'none' }}
    >
      {labelA && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {labelA}
        </span>
      )}
      <div style={{
        width: trackW,
        height: trackH,
        borderRadius: 4,
        backgroundColor: 'var(--kol-ctl-hw-cap)',
        border: '1px solid var(--kol-ctl-hw-cap-edge)',
        position: 'relative',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: thumbW,
          height: thumbH,
          borderRadius: 3,
          backgroundColor: 'var(--kol-ctl-hw-on-cap)',
          position: 'absolute',
          ...thumbPos,
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }} />
      </div>
      {labelB && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {labelB}
        </span>
      )}
      {labelC && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {labelC}
        </span>
      )}
    </div>
  )
}
