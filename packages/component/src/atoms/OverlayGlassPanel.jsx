/**
 * OverlayGlassPanel — the KOL frosted-glass content card that floats over
 * hero/carousel media: translucent surface-primary (color-mix) + a 1px
 * backdrop blur, children stacked vertically. Extracted from 4 identical
 * inline copies in the monorepo (StudioHero, StudioAboutCard,
 * FeaturedCarousel, TypefacePage). The 80% / 1px defaults ARE the design —
 * exposed as props, not tokenized away.
 *
 * @param {number} surfaceOpacity  % of surface-primary in the color-mix
 * @param {string} blur            backdrop-filter blur radius
 * @param {string} align           'center' | 'start' | 'end' (cross-axis + text)
 * @param {string} gap             vertical rhythm class between children
 * @param {string} maxWidth        optional max-w-* class (adds mx-auto)
 */
export default function OverlayGlassPanel({
  children,
  surfaceOpacity = 80,
  blur = '1px',
  align = 'center',
  gap = 'gap-6',
  maxWidth = '',
  className = '',
}) {
  const alignCls =
    align === 'start' ? 'items-start text-left'
    : align === 'end' ? 'items-end text-right'
    : 'items-center text-center'

  return (
    <div
      className={`flex flex-col ${alignCls} ${gap} rounded-[2px] px-6 py-8 ${maxWidth ? `${maxWidth} mx-auto` : ''} ${className}`.trim()}
      style={{
        backgroundColor: `color-mix(in srgb, var(--kol-surface-primary) ${surfaceOpacity}%, transparent)`,
        backdropFilter: `blur(${blur})`,
      }}
    >
      {children}
    </div>
  )
}
