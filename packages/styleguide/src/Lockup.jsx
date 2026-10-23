/* taxonomy-ok: molecule — a mark beside a parent name, a product name and descriptors */

/**
 * Lockup — A branded-house lockup of two names. The branded-house lockup: a parent name over a product name and an optional uppercase
 * descriptor, beside the mark.
 *
 * Carried from kol-atlas `components/lockup/Lockup.jsx` (itself kol-client-canalix's branded-house
 * Lockup), 2026-10-20 — the parent name, the mark and the face are props now, not Atlas's.
 *
 *   horizontal — mark + stacked column  ·  hero — big anatomy, framed mark, second descriptor  ·  wordmark — no mark
 *
 * Ink is currentColor, so it follows the surface. Without a `mark` a placeholder square stands in.
 *
 * @param {string}    parent       the parent brand name, e.g. "Kolkrabbi"
 * @param {string}    product      the product name; empty → the parent takes the product slot (horizontal)
 * @param {string}    descriptor   uppercase descriptor, e.g. "IS"
 * @param {string}    descriptor2  hero only — a second descriptor
 * @param {'sm'|'md'|'lg'|'xl'} scale
 * @param {'horizontal'|'hero'|'wordmark'} variant
 * @param {ReactNode} mark         the mark, drawn at the scale's mark size
 * @param {string}    font         CSS font-family for the names; inherits by default
 */
export const LOCKUP_SCALES = {
  sm: { mark: 32, wordmark: 12, product: 24, descriptor: 16, gap: 8, wordmarkLH: 16 },
  md: { mark: 48, wordmark: 14, product: 36, descriptor: 24, gap: 12, wordmarkLH: 18 },
  lg: { mark: 80, wordmark: 20, product: 56, descriptor: 36, gap: 16, wordmarkLH: 24 },
  xl: { mark: 128, wordmark: 40, product: 96, descriptor: 56, gap: 20, wordmarkLH: 48 },
}

const parentCls = 'font-bold whitespace-nowrap'
const productCls = 'font-bold leading-none whitespace-nowrap tracking-[-0.01em]'
const descriptorCls = 'font-normal leading-none whitespace-nowrap uppercase tracking-[0.01em]'

function Mark({ size, framed, mark }) {
  return (
    <div className={`shrink-0 box-border ${framed ? 'border border-current/16' : ''}`} style={{ width: size, height: size, padding: framed ? size * 0.12 : 0, borderRadius: framed ? Math.max(4, size * 0.08) : 0 }}>
      {mark
        ? <div className="flex size-full items-center justify-center [&_svg]:size-full">{mark}</div>
        : <div className="size-full rounded-[18%] bg-current opacity-80" />}
    </div>
  )
}

export default function Lockup({ parent = 'Brand', product = '', descriptor = '', descriptor2 = '', scale = 'md', variant = 'horizontal', mark, font, className = '' }) {
  const d = LOCKUP_SCALES[scale] ?? LOCKUP_SCALES.md
  const style = font ? { fontFamily: font } : undefined

  if (variant === 'hero') {
    const x = LOCKUP_SCALES.xl
    return (
      <div className={`inline-flex items-start ${className}`.trim()} style={{ ...style, gap: x.gap * 1.5, padding: x.gap * 3 }}>
        <Mark size={x.mark} framed mark={mark} />
        <div className="flex flex-col justify-between" style={{ gap: x.gap }}>
          <span className={parentCls} style={{ fontSize: x.wordmark }}>{parent}</span>
          <div className="flex items-start" style={{ gap: x.gap * 0.75 }}>
            <div className="flex flex-col" style={{ gap: x.gap * 0.5 }}>
              {product && <span className={`${productCls} tracking-[-0.015em]`} style={{ fontSize: x.product }}>{product}</span>}
              {descriptor && <span className={`${descriptorCls} font-medium opacity-40 text-right`} style={{ fontSize: x.descriptor }}>{descriptor}</span>}
            </div>
            {descriptor2 && <span className={`${descriptorCls} font-medium opacity-40`} style={{ fontSize: x.descriptor * 1.2, paddingTop: x.gap }}>{descriptor2}</span>}
          </div>
        </div>
      </div>
    )
  }

  const row = (
    <div className="flex items-end" style={{ gap: d.gap / 2 }}>
      {(product || variant === 'horizontal') && <span className={productCls} style={{ fontSize: d.product }}>{product || parent}</span>}
      {descriptor && <span className={descriptorCls} style={{ fontSize: d.descriptor, paddingBottom: d.descriptor * 0.05 }}>{descriptor}</span>}
    </div>
  )

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex flex-col items-start ${className}`.trim()} style={{ ...style, padding: d.gap * 2, gap: d.gap / 2 }}>
        <span className={parentCls} style={{ fontSize: d.wordmark }}>{parent}</span>
        {row}
      </div>
    )
  }

  /* horizontal: no product → the parent name takes the product slot */
  return (
    <div className={`inline-flex items-end ${className}`.trim()} style={{ ...style, gap: d.gap, padding: d.gap * 2 }}>
      <Mark size={d.mark} mark={mark} />
      <div className={`flex flex-col ${product ? 'justify-between' : 'justify-end'}`} style={{ minHeight: d.mark, gap: d.gap / 2 }}>
        {product && <span className={parentCls} style={{ fontSize: d.wordmark, lineHeight: `${d.wordmarkLH}px` }}>{parent}</span>}
        {row}
      </div>
    </div>
  )
}
