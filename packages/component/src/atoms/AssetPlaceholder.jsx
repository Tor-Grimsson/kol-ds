/**
 * AssetPlaceholder — deliberate "missing asset" frame.
 *
 * Used by Image + Graphic as fallback when the resource can't be found.
 * Renders an outlined tile with the asset's category/name so missing assets
 * are visibly flagged rather than showing the browser's broken-image icon.
 */

export default function AssetPlaceholder({
  category,
  name,
  aspectRatio = '16 / 9',
  note = 'missing',
  className = '',
}) {
  const label = [category, name].filter(Boolean).join(' · ')
  return (
    <div
      className={`kol-asset-placeholder flex flex-col items-center justify-center gap-[6px] w-full p-6 border border-dashed border-[var(--kol-fg-24)] rounded-[4px] bg-[var(--kol-fg-02)] text-fg-48 font-mono text-center box-border ${className}`.trim()}
      style={{ aspectRatio }}
      role="img"
      aria-label={`${label || 'asset'} — ${note}`}
    >
      {/* note is single-line → helper scale; label can wrap (category · name
        * in a narrow tile) → line-height-bearing mono scale */}
      <span className="kol-asset-placeholder-note kol-helper-12 uppercase [letter-spacing:0.12em] text-fg-48">{note}</span>
      {label && <span className="kol-asset-placeholder-label kol-mono-12 text-fg-40 [letter-spacing:0.04em]">{label}</span>}
    </div>
  )
}
