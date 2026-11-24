/**
 * Figure — Captioned media for long-form prose. the shared caption'd media shell for long-form prose: optional
 * label above, an aspect-locked bordered frame around `children`, optional
 * figcaption below. ImageBlock and VideoBlock (and the portable-text image
 * renderer) all compose this one shell.
 *
 * Aspect is an inline style (not aspect-[x/y]) so any ratio works without
 * Tailwind needing to see the class. Pass aspect="" for natural height.
 *
 * @param {string} label    small mono label above the frame
 * @param {string} caption  figcaption below the frame
 * @param {string} aspect   CSS aspect-ratio value, e.g. '5/3' (default)
 */
function FigureDefault({ label, caption, aspect = '5/3', className = '', children }) {
  return (
    <figure className={`kol-prose-figure ${className}`.trim()}>
      {label && <div className="kol-doc-eyebrow mb-2">{label}</div>}
      <div
        className="border border-fg-08 rounded overflow-hidden"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {children}
      </div>
      {caption && <figcaption className="kol-doc-caption mt-3">{caption}</figcaption>}
    </figure>
  )
}

/* folio (Folio batch E, 2026-11-22): Folio's figure, carried from apps/folio's Media.jsx: the image on a hairline at
 * radius 2, as wide as it is or `width` px, its caption 10 under it in Folio's meta type, muted. Spans, not <figure>:
 * an image that shares a line with text sits inside a <p>, where a figure is not allowed. Figure's word: `caption`.
 * Folio's own: `src`, `alt`, `width` (the caller reads them off its Markdown). `data-wide` lets Folio's prose grid run it
 * full width. */
function FigureFolio({ src, alt, caption, width }) {
  return (
    <span data-wide role="figure" aria-label={caption || undefined} className="kol-figure--folio flex flex-col items-start gap-[10px]">
      <img src={src} alt={alt ?? ''} loading="lazy" className="kol-figure-image max-w-full rounded-[2px] border" style={width ? { width: `${width}px` } : undefined} />
      {caption && <span className="kol-folio-meta kol-figure-caption block">{caption}</span>}
    </span>
  )
}

export default function Figure(props) {
  return props.variant === 'folio' ? <FigureFolio {...props} /> : <FigureDefault {...props} />
}
