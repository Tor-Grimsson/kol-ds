import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * DiagonalMarqueeRiver — an auto-scrolling multi-column marquee "river":
 * `items` are dealt round-robin into `colCount` vertical columns, each column
 * runs an infinite constant-velocity GSAP y-tween at its own speed, and the
 * whole block is rotated + scaled so the columns stream diagonally across a
 * tall stage. An IntersectionObserver pauses every tween while the stage is
 * off-screen. Data-agnostic — the card is a `renderItem` slot; the engine only
 * measures scrollHeight and tweens y.
 *
 * Each column's list is rendered twice so the tween can travel exactly one set
 * then repeat with an invisible wrap. On `prefers-reduced-motion` no GSAP runs
 * and the columns render static. The tween set is rebuilt on container resize
 * (a ResizeObserver remeasures scrollHeight — the source keyed only on the item
 * list and drifted when the viewport changed).
 *
 * @param {any[]}    items         pool dealt round-robin into columns
 * @param {(item:any,i:number)=>ReactNode} renderItem card slot per item
 * @param {number}   colCount      number of columns (default 4)
 * @param {number[]} columnSpeeds  px/s per column (default [28,38,22,34], fallback 30)
 * @param {number}   gap           vertical gap between cards and gap-between-columns, px (default 24)
 * @param {string}   height        stage height (default '300vh')
 * @param {number}   rotate        tilt of the block, deg (default -15)
 * @param {number}   scale         oversize of the block (default 1.3)
 * @param {boolean}  shuffle       one-time shuffle of `items` before dealing (default false)
 */
export default function DiagonalMarqueeRiver({
  items = [],
  renderItem,
  colCount = 4,
  columnSpeeds = [28, 38, 22, 34],
  gap = 24,
  height = '300vh',
  rotate = -15,
  scale = 1.3,
  shuffle = false,
}) {
  const containerRef = useRef(null)
  const columnRefs = useRef([])
  const tweensRef = useRef([])
  const reducedMotion = usePrefersReducedMotion()

  // Deal items round-robin into columns (optionally shuffled once).
  const columns = useMemo(() => {
    const pool = shuffle ? [...items].sort(() => Math.random() - 0.5) : items
    const cols = Array.from({ length: colCount }, () => [])
    pool.forEach((item, i) => cols[i % colCount].push(item))
    return cols
  }, [items, colCount, shuffle])

  useEffect(() => {
    if (reducedMotion) return undefined

    const build = () => {
      const colEls = columnRefs.current.filter(Boolean)
      tweensRef.current.forEach((tw) => tw.kill())
      tweensRef.current = []
      if (!colEls.length) return

      colEls.forEach((colEl, i) => {
        colEl.style.willChange = 'transform'
        const singleSetHeight = colEl.scrollHeight / 2 // one copy of the doubled list
        const speed = columnSpeeds[i] || 30
        const initialOffset = -(singleSetHeight * ((i * 0.15) % 1)) // staggered per-column start
        gsap.set(colEl, { y: initialOffset })
        const tween = gsap.to(colEl, {
          y: initialOffset - singleSetHeight, // travel exactly one set → seamless
          duration: singleSetHeight / speed, // constant px/s regardless of column length
          ease: 'none',
          repeat: -1,
        })
        tweensRef.current.push(tween)
      })
    }

    build()

    // Pause tweens while the stage is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        tweensRef.current.forEach((tw) => (entry.isIntersecting ? tw.resume() : tw.pause()))
      },
      { threshold: 0 },
    )
    if (containerRef.current) io.observe(containerRef.current)

    // [source-bug] resize-remeasure: source keyed only on the item list, so a
    // viewport change left the tweens measuring a stale scrollHeight. Rebuild
    // on container resize (debounced).
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(build)
    })
    if (containerRef.current) ro.observe(containerRef.current)

    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
      tweensRef.current.forEach((tw) => tw.kill())
      tweensRef.current = []
    }
  }, [columns, columnSpeeds, reducedMotion])

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ height }}>
      <div
        className="flex gap-6"
        style={{
          transform: `rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: 'center center',
          height: '140%',
          marginTop: '-20%',
        }}
      >
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex-1 overflow-hidden">
            <div
              ref={(el) => {
                columnRefs.current[colIndex] = el
              }}
              className="flex flex-col"
              style={{ gap: `${gap}px` }}
            >
              {[...col, ...col].map((item, i) => (
                <div key={i}>{renderItem?.(item, i)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
