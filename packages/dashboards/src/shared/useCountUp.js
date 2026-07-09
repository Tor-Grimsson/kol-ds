import { useState, useEffect, useRef } from 'react'

const parseNumeric = (value) => {
  const str = String(value)
  const match = str.match(/^([^0-9]*?)([\d,.]+)(.*?)$/)
  if (!match) return null
  const prefix = match[1]
  const numStr = match[2]
  const suffix = match[3]
  const num = parseFloat(numStr.replace(/,/g, ''))
  if (isNaN(num)) return null
  const hasCommas = numStr.includes(',')
  const decimalMatch = numStr.match(/\.(\d+)/)
  const decimals = decimalMatch ? decimalMatch[1].length : 0
  return { prefix, num, suffix, hasCommas, decimals }
}

const formatNumber = (n, hasCommas, decimals) => {
  const fixed = n.toFixed(decimals)
  if (!hasCommas) return fixed
  const [intPart, decPart] = fixed.split('.')
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${withCommas}.${decPart}` : withCommas
}

const useCountUp = (targetValue, { duration = 600, enabled = true } = {}) => {
  const [displayValue, setDisplayValue] = useState(targetValue)
  const ref = useRef(null)
  const hasEnteredRef = useRef(false)
  const prevTargetRef = useRef(targetValue)
  const rafRef = useRef(null)
  const elRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetValue)
      return
    }

    const animate = (from, to) => {
      const parsed = parseNumeric(to)
      if (!parsed) {
        setDisplayValue(to)
        return
      }

      const parsedFrom = parseNumeric(from)
      const startNum = parsedFrom ? parsedFrom.num : 0
      const endNum = parsed.num
      const startTime = performance.now()

      const step = (now) => {
        const elapsed = now - startTime
        const t = Math.min(elapsed / duration, 1)
        const eased = t * (2 - t) // ease-out quadratic
        const current = startNum + (endNum - startNum) * eased
        const formatted = `${parsed.prefix}${formatNumber(current, parsed.hasCommas, parsed.decimals)}${parsed.suffix}`
        setDisplayValue(formatted)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(step)
    }

    // On target change while already visible
    if (hasEnteredRef.current && prevTargetRef.current !== targetValue) {
      animate(prevTargetRef.current, targetValue)
      prevTargetRef.current = targetValue
      return
    }

    prevTargetRef.current = targetValue

    // IntersectionObserver for first entry
    if (hasEnteredRef.current) return

    const el = elRef.current
    if (!el) {
      setDisplayValue(targetValue)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEnteredRef.current) {
          hasEnteredRef.current = true
          animate('0', targetValue)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [targetValue, duration, enabled])

  return { displayValue, ref: elRef }
}

export default useCountUp
