import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: atom — readout lines on the canvas: a glyph and a float type role, no box */

/**
 * ZoomReadout — The canvas zoom on the float chrome (float-everything W5 row 73, 2026-11-04): the value in
 * `kol-float-timecode` (oq-64) with a ▾ that opens the zoom menu, and ⤢ that fits the canvas. The exploration's
 * `Canvas zoom` (kol-float--style 9:8979).
 *
 * @param {string}   value   the zoom, formatted ("58.3%")
 * @param {Function} onMenu  the ▾ press (the consumer owns the menu)
 * @param {Function} onFit   the ⤢ press
 * @param {string}   className
 */
export function ZoomReadout({ value, onMenu, onFit, className = '' }) {
  return (
    <div className={`kol-zoom-readout inline-flex items-center gap-3 ${className}`.trim()}>
      <button type="button" onClick={onMenu} aria-haspopup={onMenu ? 'menu' : undefined} className="kol-float-timecode text-oq-64 hover:text-oq-96 inline-flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer">
        {value}
        {onMenu && <Icon name="chevron-down" size={16} className="text-oq-64" />}
      </button>
      {onFit && (
        <button type="button" onClick={onFit} aria-label="Fit" className="inline-flex text-oq-64 hover:text-oq-96 bg-transparent border-0 p-0 cursor-pointer">
          <Icon name="maximize" size={16} />
        </button>
      )}
    </div>
  )
}

/**
 * SceneBreadcrumb — The scene's line on the canvas (float-everything W5 row 74, 2026-11-04): the scene glyph, its name
 * (`kol-float-label`, oq-64), a slash and the technical meta in `kol-float-ruler` (oq-48). The exploration's
 * `Scene breadcrumb` (kol-float--style 9:8983).
 *
 * @param {string} icon  the glyph (default `video`)
 * @param {string} name  the scene ("Scene 01")
 * @param {string} meta  the readout ("1920 × 1080 · 30 fps · 12 s")
 * @param {string} className
 */
export function SceneBreadcrumb({ icon = 'video', name, meta, className = '' }) {
  return (
    <div className={`kol-scene-breadcrumb inline-flex items-center gap-3 ${className}`.trim()}>
      <Icon name={icon} size={16} className="text-oq-64" />
      <span className="kol-float-label text-oq-64">{name}</span>
      {meta && <span className="kol-float-label text-oq-48">/</span>}
      {meta && <span className="kol-float-ruler text-oq-48">{meta}</span>}
    </div>
  )
}

/**
 * CanvasHint — The hint line under the canvas (float-everything W5 row 75, 2026-11-04): the pointer glyph and the
 * gestures in `kol-float-ruler` (oq-48), ` · ` between. The exploration's `Canvas footer` (kol-float--style 9:8806).
 *
 * @param {string}          icon   the glyph (default `pointer`)
 * @param {string|string[]} hint   the line, or its parts joined by ` · `
 * @param {string}          className
 */
export function CanvasHint({ icon = 'pointer', hint, className = '' }) {
  return (
    <div className={`kol-canvas-hint inline-flex items-center gap-3 ${className}`.trim()}>
      <Icon name={icon} size={14} className="text-oq-48" />
      <span className="kol-float-ruler text-oq-48">{Array.isArray(hint) ? hint.join(' · ') : hint}</span>
    </div>
  )
}

/**
 * SelectionMeasure — The selection's frame on the canvas (float-everything W5 row 76, 2026-11-04): a 1px outline on
 * oq-64 hugging `children` and its handles, the object's label above (`kol-float-label`) and the size cap under it
 * (`kol-float-ruler` on the `--kol-float-list-r` round). The exploration's `Selection measurement` (kol-float--style
 * 9:8594: outline + eight 6 handles centred on it); since 0.104.0 the outline is drawn (float-figma-review W3.5).
 *
 * @param {number|string} width · {number|string} height  the cap's numbers ("754 × 771") — the measure: eight 6 handles
 *                         (corners + edge middles). Both unset, no cap — the selected row: four 4 corner handles
 *                         (the selected brief, kol-float--style 9:14340)
 * @param {string}   label     the object's name, above the frame
 * @param {ReactNode} children  the selected thing
 * @param {string}   className
 */
export function SelectionMeasure({ width, height, label, children, className = '' }) {
  const measure = width != null || height != null
  /* a handle is centred on the outline: 6 (the measure) or 4 (the selected row), corners first, then the edge middles */
  const handle = `absolute ${measure ? 'size-1.5 -m-[3px]' : 'size-1 -m-0.5'} bg-[var(--kol-surface-on-primary)]`
  const spots = measure
    ? ['top-0 left-0', 'top-0 left-full', 'top-full left-0', 'top-full left-full', 'top-0 left-1/2', 'top-full left-1/2', 'top-1/2 left-0', 'top-1/2 left-full']
    : ['top-0 left-0', 'top-0 left-full', 'top-full left-0', 'top-full left-full']
  return (
    <div className={`kol-selection-measure relative inline-block ${className}`.trim()}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[0_0_0_1px_var(--kol-oq-64)]">
        {spots.map((at) => <span key={at} className={`${handle} ${at}`} />)}
      </div>
      {label && <span className="kol-float-label text-oq-64 absolute left-0 bottom-full mb-2 whitespace-nowrap">{label}</span>}
      {(width != null || height != null) && <span className="kol-float-ruler text-emphasis absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-[var(--kol-float-list-r)] bg-oq-08">{width} × {height}</span>}
    </div>
  )
}
