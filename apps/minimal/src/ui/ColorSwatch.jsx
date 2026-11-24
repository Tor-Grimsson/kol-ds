/* One color as a button: a hex fills it, none draws the slash. `size` in px, or 'fill' for a grid cell. Named by `label`,
   else by its hex. */
export default function ColorSwatch({ hex, size = 16, title, label, onClick, className = '' }) {
  const box = size === 'fill' ? { aspectRatio: '1' } : { width: size, height: size }
  return (
    <button
      type="button"
      title={title}
      aria-label={label ?? hex ?? 'transparent'}
      onClick={onClick}
      className={`relative shrink-0 overflow-hidden rounded-inner outline-none focus-visible:outline-1 focus-visible:outline-fg ${size === 'fill' ? 'w-full' : ''} ${className}`}
      style={{ ...box, background: hex ?? 'transparent' }}
    >
      {!hex && <span className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_45%,var(--color-muted)_45%,var(--color-muted)_55%,transparent_55%)]" />}
    </button>
  )
}
