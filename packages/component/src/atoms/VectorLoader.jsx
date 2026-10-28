import { useState, useEffect } from 'react'

/**
 * VectorLoader — ANY SVG by URL, fetched and INLINED so `currentColor` theming works (`Logomark` until kol-component
 * 0.308.0 — user 2026-10-28: "Logomark is the loader Im talking about, it just has a terrible name"; the old name
 * stays an alias on the retirements ledger). `src` is the URL; `svgUrl` is the old prop and still works. Pair it
 * with a path export — `@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-wordmark.svg?url` — or any file of your own.
 * Fetches and inlines so currentColor theming works: an
 * <img> renders a currentColor mark black in dark mode (invisible). Ported
 * verbatim from the kol-mirror cut (module-level cache; async resolve even on
 * cache hit — sync setState in an effect cascades renders).
 *
 * The fetched markup is SANITIZED before injection — `<style>`/`<script>`
 * stripped, `on*` attributes dropped (LogomarkInlineStyleLeak, kol-chess
 * 2026-09-01). An SVG *document* may legitimately carry its own `<style>` — a
 * theme-aware favicon does — but once inlined, that `<style>` is
 * DOCUMENT-GLOBAL: kol-chess pointed `svgUrl` at its favicon and every <svg>
 * in the app took OS-keyed ink and ignored `data-theme`, presenting two
 * packages away as "the theme toggle is broken". A mark that needs its own
 * styling inlines it as attributes, not a stylesheet.
 */

const svgCache = new Map()

/* strip what must never escape into the host document: stylesheets (global
 * once inlined), scripts and event handlers (this is a fetch → innerHTML
 * boundary). DOMParser is the correct tool; the regex fallback only runs if
 * the markup does not even parse as SVG. */
function sanitizeSvg(svg) {
  try {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
    if (doc.querySelector('parsererror')) throw new Error('unparseable')
    doc.querySelectorAll('style, script').forEach((el) => el.remove())
    doc.querySelectorAll('*').forEach((el) => {
      for (const a of [...el.attributes]) if (/^on/i.test(a.name)) el.removeAttribute(a.name)
    })
    return new XMLSerializer().serializeToString(doc)
  } catch {
    return svg
      .replace(/<(style|script)[\s\S]*?<\/\1\s*>/gi, '')
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
  }
}

export default function VectorLoader({ src, svgUrl, size = 20, className = '', ...props }) {
  const url = src ?? svgUrl
  const [svgContent, setSvgContent] = useState(() => svgCache.get(url) || null)

  useEffect(() => {
    if (!url) return
    let active = true
    Promise.resolve(
      svgCache.get(url) ?? fetch(url).then(res => res.text()).then(raw => { const svg = sanitizeSvg(raw); svgCache.set(url, svg); return svg })
    )
      .then(svg => { if (active) setSvgContent(svg) })
      .catch(() => {})
    return () => { active = false }
  }, [url])

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
