import { Icon } from '@kolkrabbi/kol-icons'

/**
 * FileIcon — the file as a page: folded corner, the kind's glyph, the extension under it.
 * Finder's generic document icon (user 2026-09-23: *"a generic preview for that like wav and
 * the type below that finder has"*). What a file shows when it has nothing of its own to draw:
 * audio without cover art, an empty file, a kind no renderer handles.
 *
 * Drawn in one SVG so the label scales with the page — the box sets the size, never the type.
 *
 * @param {string} ext        the extension, shown as authored upper-case (`WAV`)
 * @param {string} glyph      a kol-icons name drawn on the page, or none
 * @param {string} className  sizes the icon; it keeps its own 100:128 ratio
 */
export default function FileIcon({ ext, glyph, className = '' }) {
  const label = ext ? String(ext).toUpperCase() : ''
  /* a long extension (GITIGNORE) is FITTED to the page, never cut — "GITIG" named nothing */
  const fit = label.length > 5 ? { textLength: 76, lengthAdjust: 'spacingAndGlyphs' } : {}
  return (
    <svg className={`kol-file-icon ${className}`.trim()} viewBox="0 0 100 128" role="img" aria-label={label ? `${label} file` : 'File'}>
      <path className="kol-file-icon-page" d="M8 2h58l32 32v86a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      <path className="kol-file-icon-fold" d="M66 2v26a6 6 0 0 0 6 6h26z" />
      {glyph && (
        <foreignObject x="30" y={label ? 42 : 52} width="40" height="40">
          <Icon name={glyph} size={40} className="kol-file-icon-glyph" />
        </foreignObject>
      )}
      {label && <text className="kol-file-icon-ext" x="50" y="108" textAnchor="middle" {...fit}>{label}</text>}
    </svg>
  )
}
