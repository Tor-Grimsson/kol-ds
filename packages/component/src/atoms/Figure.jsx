/**
 * Figure — the shared caption'd media shell for long-form prose: optional
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
export default function Figure({ label, caption, aspect = '5/3', className = '', children }) {
  return (
    <figure className={`kol-prose-figure ${className}`.trim()}>
      {label && <div className="kol-caption-label">{label}</div>}
      <div
        className="border border-fg-08 rounded overflow-hidden"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {children}
      </div>
      {caption && <figcaption className="kol-caption-text">{caption}</figcaption>}
    </figure>
  )
}
