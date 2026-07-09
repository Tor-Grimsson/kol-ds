import { useState, useCallback, useRef } from 'react'

const useChartTooltip = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const containerRef = useRef(null)

  const containerHandlers = {
    onMouseMove: (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      containerRef.current.style.setProperty('--tx', `${e.clientX - rect.left}px`)
      containerRef.current.style.setProperty('--ty', `${e.clientY - rect.top}px`)
    },
    onMouseLeave: () => setActiveIndex(null)
  }

  const handlers = useCallback((index) => ({
    onMouseEnter: () => setActiveIndex(index),
    onMouseLeave: () => setActiveIndex(null)
  }), [])

  return { activeIndex, handlers, containerHandlers, containerRef }
}

export default useChartTooltip
