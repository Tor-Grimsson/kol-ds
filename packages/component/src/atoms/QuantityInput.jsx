import { useEffect, useState } from 'react'

/**
 * QuantityInput — a compact integer quantity picker with two control layouts.
 *
 *   controls="chevron" (default) — value with a stacked up/down chevron pair
 *                                  on the right, inside a full-width field.
 *   controls="split"             — a − value + pill (minus and plus flank the
 *                                  value). The former `QuantityStepper`.
 *
 * Display-only value (not a text-editable input) — for an editable number
 * field with bump chevrons use `Stepper`. Size auto-adapts to the viewport
 * (sm < 768 ≤ md < 1024 ≤ lg) unless `size` pins it. Controlled: `value` +
 * `(next) => onChange`, clamped to [min, max].
 *
 * @param {number}   value     current quantity (default 1)
 * @param {Function} onChange  (next) => void
 * @param {number}   min       lower bound (default 1)
 * @param {number}   max       upper bound (default 99)
 * @param {string}   controls  'chevron' (default) | 'split'
 * @param {string}   size      'sm' | 'md' | 'lg' — pins the responsive size
 * @param {string}   className extra classes on the root
 */

const SIZE_MAP = {
  sm: { fontSize: 11, paddingY: 12, paddingX: 24, radius: 20, icon: 10 },
  md: { fontSize: 12, paddingY: 14, paddingX: 24, radius: 22, icon: 12 },
  lg: { fontSize: 14, paddingY: 16, paddingX: 24, radius: 24, icon: 14 },
}

const QuantityInput = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  controls = 'chevron',
  size,
  className = '',
}) => {
  const [resolvedSize, setResolvedSize] = useState('md')
  const [componentWidth, setComponentWidth] = useState('180px')

  useEffect(() => {
    const determineSize = () => {
      if (size) { setResolvedSize(size); return }
      if (typeof window === 'undefined') { setResolvedSize('md'); return }
      if (window.innerWidth >= 1024) setResolvedSize('lg')
      else if (window.innerWidth >= 768) setResolvedSize('md')
      else setResolvedSize('sm')
    }
    determineSize()
    window.addEventListener('resize', determineSize)
    return () => window.removeEventListener('resize', determineSize)
  }, [size])

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return
      if (window.innerWidth >= 1024) setComponentWidth('180px')
      else if (window.innerWidth >= 768) setComponentWidth('140px')
      else setComponentWidth('100px')
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const metrics = SIZE_MAP[resolvedSize] || SIZE_MAP.md
  const increment = () => { if (value < max) onChange?.(value + 1) }
  const decrement = () => { if (value > min) onChange?.(value - 1) }

  /* controls="split" — the − value + pill (formerly QuantityStepper). */
  if (controls === 'split') {
    const btn = (disabled) => ({
      padding: `${metrics.paddingY}px 12px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'transparent', border: 'none',
      color: 'var(--kol-surface-on-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      transition: 'opacity 0.15s',
      fontFamily: 'var(--kol-font-family-mono)',
      fontSize: `${metrics.fontSize}px`, lineHeight: '120%',
    })
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          width: componentWidth, minWidth: componentWidth,
          border: '1px solid var(--kol-border-default)',
          borderRadius: `${metrics.radius}px`,
          backgroundColor: 'var(--kol-surface-primary)',
        }}
      >
        <button type="button" onClick={decrement} disabled={value <= min} style={btn(value <= min)} aria-label="Decrease quantity">−</button>
        <span style={{ minWidth: '24px', textAlign: 'center', color: 'var(--kol-surface-on-primary)', fontFamily: 'var(--kol-font-family-mono)', fontSize: `${metrics.fontSize}px`, lineHeight: '120%' }}>{value}</span>
        <button type="button" onClick={increment} disabled={value >= max} style={btn(value >= max)} aria-label="Increase quantity">+</button>
      </div>
    )
  }

  /* controls="chevron" (default) — value + stacked chevron pair on the right. */
  return (
    <div className={`relative block ${className}`}>
      <div
        className="w-full flex items-center"
        style={{
          position: 'relative', height: '42.5px',
          border: '1px solid var(--kol-border-default)',
          borderRadius: `${metrics.radius}px`,
          backgroundColor: 'var(--kol-surface-primary)',
          color: 'var(--kol-surface-on-primary)',
          paddingLeft: `${metrics.paddingX}px`, paddingRight: `${metrics.paddingX}px`,
          fontSize: `${metrics.fontSize}px`, lineHeight: '120%',
          fontFamily: 'var(--kol-font-family-mono)', boxSizing: 'border-box',
        }}
      >
        <span>{value}</span>
        <div style={{ position: 'absolute', right: `${metrics.paddingX}px`, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={increment} disabled={value >= max} style={{ backgroundColor: 'transparent', border: 'none', padding: '0', cursor: value >= max ? 'not-allowed' : 'pointer', opacity: value >= max ? 0.3 : 1, lineHeight: 0, display: 'block' }} aria-label="Increase quantity">
            <svg width={metrics.icon} height={metrics.icon} viewBox="0 0 12 12" fill="none">
              <path d="m3 7 3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={decrement} disabled={value <= min} style={{ backgroundColor: 'transparent', border: 'none', padding: '0', cursor: value <= min ? 'not-allowed' : 'pointer', opacity: value <= min ? 0.3 : 1, lineHeight: 0, display: 'block' }} aria-label="Decrease quantity">
            <svg width={metrics.icon} height={metrics.icon} viewBox="0 0 12 12" fill="none">
              <path d="m3 5 3 3 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuantityInput
