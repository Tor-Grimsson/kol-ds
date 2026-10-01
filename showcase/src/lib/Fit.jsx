import { useEffect, useRef, useState } from 'react'

/* FIT, NEVER CROP (2026-09-30, the names audit: *"can we somehow scale the content into the
 * preview?"*). A demo wider or taller than the card's preview box is scaled DOWN to fit, centred;
 * one that fits is left at 1:1. Measured, so a demo is never guessed at. */
/* scaled from the top, and the height it no longer draws handed back (W20): a transform keeps the
 * unscaled box, so a scaled demo left a band of empty tile under it on the landing wall */
const FIT_STYLE = (scale, ih) => ({ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: -ih * (1 - scale) })

/* `height={false}` — width only, for a box with no height of its own (the landing wall's tiles): the
 * handed-back height would shrink the box, which shrinks the scale, down to nothing */
export default function Fit({ children, height = true }) {
  const box = useRef(null)
  const inner = useRef(null)
  const [{ scale, ih }, setFit] = useState({ scale: 1, ih: 0 })
  useEffect(() => {
    const measure = () => {
      if (!box.current || !inner.current) return
      const bw = box.current.clientWidth
      const bh = box.current.clientHeight
      const iw = inner.current.scrollWidth
      const ih = inner.current.scrollHeight
      setFit({ scale: Math.min(1, bw / (iw || 1), height ? bh / (ih || 1) : 1), ih })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (box.current) ro.observe(box.current)
    if (inner.current) ro.observe(inner.current)
    return () => ro.disconnect()
  }, [height])
  return (
    <div ref={box} className="flex h-full w-full items-center justify-center overflow-hidden">
      {/* at least the box's width (W18): a fluid demo (`w-full`) has no width of its own, so in a
        * shrink-to-fit wrapper it collapsed to nothing — FileIcon's grid drew a blank card */}
      <div ref={inner} className="flex min-w-full shrink-0 justify-center" style={scale < 1 ? FIT_STYLE(scale, ih) : undefined}>{children}</div>
    </div>
  )
}
