import { useLayoutEffect, useRef, useState } from 'react'

const FULL = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz'

/**
 * TypefaceAlphabet — the specimen alphabet, trimmed to what fits on one line.
 * Lifted verbatim from TypefaceLibraryItem's list variant (binary-search the
 * character count against the container width, ResizeObserver re-measures) so
 * the DS row's `footer` clips the same way the local card always did.
 */
export default function TypefaceAlphabet({ fontFamily, fontStyle = 'normal', inset = 0, className = '' }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [visibleText, setVisibleText] = useState(FULL)

  useLayoutEffect(() => {
    const container = containerRef.current
    const textElement = textRef.current
    if (!container || !textElement) return undefined

    const calculateClipping = () => {
      const width = container.getBoundingClientRect().width
      if (width < 80) return
      const availableWidth = width - inset
      const chars = FULL.split('')
      let clippedText = ''
      let low = 0
      let high = chars.length
      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const testText = chars.slice(0, mid).join('')
        textElement.textContent = testText
        if (textElement.scrollWidth <= availableWidth) {
          clippedText = testText
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
      // never blank the specimen — at least the first pair stays
      const next = clippedText.length >= 2 ? clippedText : FULL.slice(0, 2)
      // the loop left the DOM on its last probe; React bails when state is
      // unchanged, so put the answer back by hand
      textElement.textContent = next
      setVisibleText(next)
    }

    const ro = new ResizeObserver(calculateClipping)
    ro.observe(container)
    window.addEventListener('resize', calculateClipping)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calculateClipping)
    }
  }, [fontFamily, fontStyle, inset])

  return (
    <div ref={containerRef} className={`w-full self-stretch flex justify-start items-center ${className}`.trim()}>
      {/* shrink-to-fit, NOT flex-1: a growing item is never narrower than the
          container, so scrollWidth <= container was always false and the
          binary search clipped every alphabet down to "Aa" */}
      <div
        ref={textRef}
        className="shrink-0 text-auto leading-[52px] whitespace-nowrap"
        style={{ fontFamily, fontStyle, fontWeight: 400, fontSize: '48px', letterSpacing: '0' }}
      >
        {visibleText}
      </div>
    </div>
  )
}
