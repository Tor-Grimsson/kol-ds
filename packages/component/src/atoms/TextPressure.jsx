import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

// Variable-font axis rest values — where every glyph sits with no pointer near.
const DEFAULTS = { wdth: 100, wght: 400, ital: 0, alpha: 1 }
const STATIC_VARIATION = "'wght' 400, 'wdth' 100, 'ital' 0.00"

/**
 * TextPressure — a single line of variable-font text whose glyphs deform
 * toward the pointer: characters nearest the cursor grow widest / heaviest /
 * most italic, and the effect falls off linearly with distance. A
 * requestAnimationFrame loop lerps a smoothed follower toward the raw cursor
 * (container-scoped listeners) and writes per-glyph `font-variation-settings`
 * each frame. On mouse-leave the glyphs coast back to their rest axis values
 * (`returnToDefault`) or freeze in place, then the loop auto-stops until the
 * pointer returns. Ported from the react-bits / JuanFuentes effect, collapsed
 * from three source variants into one.
 *
 * ── Font contract ──────────────────────────────────────────────────────────
 * The effect only *moves* if the resolved font is a VARIABLE font exposing the
 * `wght` / `wdth` / `ital` axes. The KOL variable font is a CONSUMER asset —
 * the design system does not ship one. Two ways to supply it:
 *   • `fontUrl` given → an `@font-face` is injected at runtime for `fontFamily`
 *     (e.g. fontFamily="TG Root-Tune" fontUrl="/fonts/TGRoot-TuneVF.ttf").
 *   • `fontUrl` omitted → the already-loaded `fontFamily` is used as-is; the
 *     default `var(--kol-font-family-sans)` animates only if that theme font is
 *     itself variable — otherwise the text renders correctly but static.
 *
 * Reduced motion → no listeners, no rAF; glyphs render static at the rest axis
 * values (wght 400 / wdth 100 / ital 0). Casing is authored by the caller —
 * this component never text-transforms.
 *
 * @param {string}  text          the line; split into one <span> per character
 * @param {string}  fontFamily    applied family + injected @font-face family
 * @param {string}  [fontUrl]     variable-font URL → injects @font-face when set
 * @param {boolean} width         animate the `wdth` axis (5–150)
 * @param {boolean} weight        animate the `wght` axis (100–900)
 * @param {boolean} italic        animate the `ital` axis (0–1)
 * @param {boolean} alpha         animate per-glyph opacity (0–1)
 * @param {boolean} flex          distribute glyphs with justify-between
 * @param {boolean} stroke        add an outlined ghost layer behind each glyph
 * @param {boolean} scale         vertically scale the line to fill the container
 * @param {string}  textColor     glyph color (KOL token / CSS color)
 * @param {string}  strokeColor   stroke color when `stroke` is on
 * @param {string}  className     extra classes on the <h1>
 * @param {number}  minFontSize   floor for the responsive font size
 * @param {number}  [maxFontSize] cap for the responsive font size
 * @param {boolean} returnToDefault true: coast back to rest on leave; false: freeze
 */
export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'var(--kol-font-family-sans)',
  fontUrl,

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = 'var(--kol-fg-emphasis)',
  strokeColor = 'var(--kol-accent-primary)',
  className = '',

  minFontSize = 24,
  maxFontSize = null,
  returnToDefault = true,
}) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const spansRef = useRef([])

  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })
  const currentValuesRef = useRef([])
  const velocityRef = useRef([])

  const [fontSize, setFontSize] = useState(minFontSize)
  const [scaleY, setScaleY] = useState(1)
  const [lineHeight, setLineHeight] = useState(1)
  const [isHovering, setIsHovering] = useState(false)

  const reducedMotion = usePrefersReducedMotion()
  const chars = text.split('')

  const dist = (a, b) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Container-scoped pointer tracking (never window). Skipped for reduced motion.
  useEffect(() => {
    if (reducedMotion) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const handleTouchMove = (e) => {
      const t = e.touches[0]
      cursorRef.current.x = t.clientX
      cursorRef.current.y = t.clientY
    }
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    const { left, top, width: w, height: h } = container.getBoundingClientRect()
    mouseRef.current.x = left + w / 2
    mouseRef.current.y = top + h / 2
    cursorRef.current.x = mouseRef.current.x
    cursorRef.current.y = mouseRef.current.y

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [reducedMotion])

  // Responsive sizing (layout, not motion — runs regardless of reduced motion).
  useEffect(() => {
    const setSize = () => {
      if (!containerRef.current || !titleRef.current) return
      const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect()

      let newFontSize = containerW / (chars.length / 2)
      newFontSize = Math.max(newFontSize, minFontSize)
      if (maxFontSize) newFontSize = Math.min(newFontSize, maxFontSize)

      setFontSize(newFontSize)
      setScaleY(1)
      setLineHeight(1)

      requestAnimationFrame(() => {
        if (!titleRef.current) return
        const textRect = titleRef.current.getBoundingClientRect()
        if (scale && textRect.height > 0) {
          const yRatio = containerH / textRect.height
          setScaleY(yRatio)
          setLineHeight(yRatio)
        }
      })
    }

    setSize()
    window.addEventListener('resize', setSize)
    return () => window.removeEventListener('resize', setSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, text, minFontSize, maxFontSize])

  // The pressure loop. Skipped entirely for reduced motion (glyphs stay static).
  useEffect(() => {
    if (reducedMotion) return undefined
    let rafId

    const animate = () => {
      if (isHovering) {
        mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15
        mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15

        if (titleRef.current && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect()
          const maxDist = containerRect.width / 2

          spansRef.current.forEach((span, i) => {
            if (!span) return
            const rect = span.getBoundingClientRect()
            const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
            const d = dist(mouseRef.current, charCenter)

            const getAttr = (distance, minVal, maxVal) => {
              const val = maxVal - Math.abs((maxVal * distance) / maxDist)
              return Math.max(minVal, val + minVal)
            }

            const wdth = width ? Math.floor(getAttr(d, 5, 150)) : 100
            const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400
            const italVal = italic ? getAttr(d, 0, 1) : 0
            const alphaVal = alpha ? getAttr(d, 0, 1) : 1

            const prev = currentValuesRef.current[i]
            if (prev && !returnToDefault) {
              velocityRef.current[i] = {
                wdth: wdth - prev.wdth,
                wght: wght - prev.wght,
                ital: italVal - prev.ital,
                alpha: alphaVal - prev.alpha,
              }
            }
            currentValuesRef.current[i] = { wdth, wght, ital: italVal, alpha: alphaVal }

            span.style.opacity = alphaVal
            span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal.toFixed(2)}`
          })
        }
      } else {
        // Coast back to rest (returnToDefault) or settle into a frozen pose.
        let allSettled = true

        spansRef.current.forEach((span, i) => {
          if (!span) return
          const current = currentValuesRef.current[i] || { ...DEFAULTS }
          if (!velocityRef.current[i]) velocityRef.current[i] = { wdth: 0, wght: 0, ital: 0, alpha: 0 }
          const velocity = velocityRef.current[i]

          if (returnToDefault) {
            const springStrength = 0.05
            const damping = 0.88
            velocity.wdth += (DEFAULTS.wdth - current.wdth) * springStrength
            velocity.wght += (DEFAULTS.wght - current.wght) * springStrength
            velocity.ital += (DEFAULTS.ital - current.ital) * springStrength
            velocity.alpha += (DEFAULTS.alpha - current.alpha) * springStrength
            velocity.wdth *= damping
            velocity.wght *= damping
            velocity.ital *= damping
            velocity.alpha *= damping

            const newWdth = current.wdth + velocity.wdth
            const newWght = current.wght + velocity.wght
            const newItal = current.ital + velocity.ital
            const newAlpha = current.alpha + velocity.alpha

            if (
              Math.abs(newWdth - DEFAULTS.wdth) > 0.5 ||
              Math.abs(newWght - DEFAULTS.wght) > 0.5 ||
              Math.abs(velocity.wdth) > 0.1 ||
              Math.abs(velocity.wght) > 0.1
            ) {
              allSettled = false
            }

            currentValuesRef.current[i] = { wdth: newWdth, wght: newWght, ital: newItal, alpha: newAlpha }
            span.style.opacity = newAlpha
            span.style.fontVariationSettings = `'wght' ${Math.round(newWght)}, 'wdth' ${Math.round(newWdth)}, 'ital' ${newItal.toFixed(2)}`
          } else {
            const damping = 0.75
            velocity.wdth *= damping
            velocity.wght *= damping
            velocity.ital *= damping
            velocity.alpha *= damping

            const newWdth = current.wdth + velocity.wdth
            const newWght = current.wght + velocity.wght
            const newItal = current.ital + velocity.ital
            const newAlpha = current.alpha + velocity.alpha

            if (
              Math.abs(velocity.wdth) > 0.01 ||
              Math.abs(velocity.wght) > 0.01 ||
              Math.abs(velocity.ital) > 0.0001 ||
              Math.abs(velocity.alpha) > 0.0001
            ) {
              allSettled = false
            }

            currentValuesRef.current[i] = { wdth: newWdth, wght: newWght, ital: newItal, alpha: newAlpha }
            span.style.opacity = newAlpha
            span.style.fontVariationSettings = `'wght' ${Math.round(newWght)}, 'wdth' ${Math.round(newWdth)}, 'ital' ${newItal.toFixed(2)}`
          }
        })

        if (allSettled) {
          cancelAnimationFrame(rafId)
          return
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [width, weight, italic, alpha, chars.length, isHovering, returnToDefault, reducedMotion])

  const titleClass = [
    'kol-text-pressure-title m-0 w-full max-w-full overflow-hidden box-border text-center whitespace-nowrap select-none origin-top font-thin',
    flex ? 'flex justify-between' : '',
    stroke ? 'kol-text-pressure--stroke' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={containerRef}
      className="kol-text-pressure relative flex h-full w-full max-w-full items-center justify-center overflow-hidden"
    >
      {fontUrl && (
        <style>{`@font-face { font-family: '${fontFamily}'; src: url('${fontUrl}'); font-style: normal; }`}</style>
      )}

      <h1
        ref={titleRef}
        className={titleClass}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          color: textColor,
          '--kol-text-pressure-stroke': strokeColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            className="kol-text-pressure-char inline-block"
            style={{ fontVariationSettings: STATIC_VARIATION }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}
