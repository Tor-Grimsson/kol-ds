import { Fragment, useEffect, useRef, useState } from 'react'

/**
 * LogoScaling — the responsive logo scale matrix.
 *
 * A specimen grid: columns = logo variants, rows = pixel steps (128 → 8px).
 * Each cell renders the variant's mark sized to that step, so a brand manual
 * can show at a glance where a lockup stops being legible. A fixed internal
 * canvas is scaled to fit the container (ResizeObserver + transform), keeping
 * every step at an exact px size regardless of viewport.
 *
 * ASSET-AGNOSTIC: variants (columns) are CONSUMER-INJECTED. Each variant supplies
 * a rendered mark `node` that fills its cell (a width-constrained box), so the
 * mark scales with the step. The monorepo original hardcoded four `KolLogo`
 * variants; this DS version bakes in no mark — the consumer passes their own.
 *
 *   import { LogoScaling } from '@kolkrabbi/kol-styleguide'
 *   import { Asset } from '@kolkrabbi/kol-brand/svg'
 *   <LogoScaling
 *     variants={[
 *       { label: 'Logomark',          node: <Asset name="kol-logomark" />,    widthMul: 1 },
 *       { label: 'Vertical lockup',   node: <Asset name="kol-lockup-vert" />, widthMul: 1 },
 *       { label: 'Horizontal lockup', node: <Asset name="kol-lockup-hori" />, widthMul: 2.5 },
 *       { label: 'Wordmark',          node: <Asset name="kol-wordmark" />,    widthMul: 2.5 },
 *     ]}
 *   />
 *
 * Column labels are authored in the case they should render — no text-transform
 * is applied (KOL no-auto-casing rule).
 */

const DEFAULT_STEPS = [128, 96, 64, 48, 40, 32, 24, 16, 12, 8]

export default function LogoScaling({
  variants = [],
  steps = DEFAULT_STEPS,
  canvasWidth = 1600,
  canvasHeight = 1000,
  className = '',
}) {
  const outerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / canvasWidth)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [canvasWidth])

  return (
    <div className={`kol-logo-scaling ${className}`.trim()}>
      <div
        ref={outerRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
      >
        <div
          className="absolute top-0 left-0 inline-grid gap-x-12 gap-y-8 items-center text-emphasis origin-top-left"
          style={{
            gridTemplateColumns: `auto repeat(${variants.length}, auto)`,
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
          }}
        >
          <div />
          {variants.map((v, i) => (
            <div key={v.label ?? i} className="kol-helper-12 tracking-widest">
              {v.label}
            </div>
          ))}

          {steps.map((px) => (
            <Fragment key={px}>
              <div className="kol-helper-12 text-right">{px}</div>
              {variants.map((v, i) => (
                <div
                  key={v.label ?? i}
                  className="[&_svg]:w-full [&_svg]:h-auto"
                  style={{ width: px * (v.widthMul ?? 1) }}
                >
                  {v.node}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
