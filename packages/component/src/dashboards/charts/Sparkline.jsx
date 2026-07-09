import { useMemo } from 'react'

const Sparkline = ({
  data = [],
  color = 'var(--kol-surface-on-primary)',
  height = 24,
  fill = false
}) => {
  const path = useMemo(() => {
    if (data.length < 2) return ''
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    return data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((v - min) / range) * 80 - 10
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
      })
      .join(' ')
  }, [data])

  if (!path) return null

  const id = useMemo(() => `spark-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${path} L 100 100 L 0 100 Z`}
            fill={`url(#${id})`}
          />
        </>
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default Sparkline
