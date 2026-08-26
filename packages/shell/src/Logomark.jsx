import { useState, useEffect } from 'react'

/**
 * Logomark — fetches and INLINES an SVG so currentColor theming works: an
 * <img> renders a currentColor mark black in dark mode (invisible). Ported
 * verbatim from the kol-mirror cut (module-level cache; async resolve even on
 * cache hit — sync setState in an effect cascades renders).
 */

const svgCache = new Map()

export default function Logomark({ svgUrl, size = 20, className = '', ...props }) {
  const [svgContent, setSvgContent] = useState(() => svgCache.get(svgUrl) || null)

  useEffect(() => {
    if (!svgUrl) return
    let active = true
    Promise.resolve(
      svgCache.get(svgUrl) ?? fetch(svgUrl).then(res => res.text()).then(svg => { svgCache.set(svgUrl, svg); return svg })
    )
      .then(svg => { if (active) setSvgContent(svg) })
      .catch(() => {})
    return () => { active = false }
  }, [svgUrl])

  if (!svgContent) return <span style={{ width: size, height: size, display: 'inline-block' }} />

  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'inline-flex', color: 'currentColor' }}
      dangerouslySetInnerHTML={{
        __html: svgContent.replace('<svg', `<svg width="${size}" height="${size}"`),
      }}
      {...props}
    />
  )
}
