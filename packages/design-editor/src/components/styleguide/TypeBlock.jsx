import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { applyCase } from '../../data/typography-cuts'
import { familyCssFor } from '../../editor/modes/type/families'
import { hangMarks } from '../../editor/modes/type/textSettings'

/**
 * TypeBlock — typography block organism (basic mode).
 *
 * Renders a single `<div>` styled with the value's typography props (family,
 * weight, italic, size, tracking, line-height, case,
 * color, alignment). When `selected` and the user double-clicks, enters
 * contentEditable mode; Escape or blur commits the text via
 * `onChange({ text })`. Deselecting while editing also commits.
 *
 * **Position is the consumer's job.** TypeBlock does NOT own absolute
 * positioning, outlines, resize handles, or drag chrome. It's a typography
 * rendering primitive — the parent wraps it in whatever positioned
 * container makes sense (Type Lab's TypeFrame wrapper, compose's layer
 * wrapper, /components showcase tile, etc.).
 *
 * Mousedown bubbles via `onMouseDown` so the parent's drag-start handler
 * fires only when not currently editing.
 *
 * Does NOT cover axis-morph rendering (morph/random/fade modes) — those
 * are Type-Lab-specific advanced behaviors. Type Lab's TypeFrame composes
 * TypeBlock for the basic branch and renders custom branches when axisOn.
 *
 * Props:
 *   value         { text, family, weight, italic, size, tracking, lineHeight,
 *                   case, color, textAlign, fontStyle? } — typography props (fontStyle overrides italic: a slant family passes its oblique angle)
 *   selected      enables contentEditable on double-click
 *   onMouseDown   bubbles to parent for drag-start (no-op while editing)
 *   onChange      partial-patch updates (e.g. { text: 'new value' })
 *   onExit        (text) => void, once each time an edit ends, with the text it ended on
 *   value.textCss     extra CSS for the block (features, decoration, wrap: textSettings.js textCss)
 *   value.paragraphs  the text as paragraph blocks (textSettings.js paragraphLayout), drawn when not editing
 *   value.trim        { top, bottom } px cut off the block (Vertical trim), value.clamp the lines it keeps (Truncate)
 *   className     extra classes for the rendered text div
 */
export default function TypeBlock({
  value,
  selected = false,
  onMouseDown,
  onChange,
  className = '',
  /* editOnMount — the block opens in edit mode with the caret in it (the text tool's placement,
     audit B3 2026-10-09: a placed text took no focus, so the first word typed went to the keymap). */
  editOnMount = false,
  onExit,
}) {
  const textRef = useRef(null)
  const [editing, setEditing] = useState(() => !!editOnMount)
  /* the edit is open from the moment it starts until finish() closes it, so an Escape and the blur it causes end it once */
  const open = useRef(false)
  const wasSelected = useRef(selected)

  useEffect(() => {
    if (editing && textRef.current) {
      open.current = true
      textRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      return undefined
    }
    /* leaving the edit drops the document selection the edit made, or its blue blocks stay over the letters while the
       layer is only selected (plan-2026-11-19-kolbox-whats-left R2: no blocks unless the text is being edited) */
    const sel = window.getSelection()
    if (sel?.rangeCount && textRef.current?.contains(sel.anchorNode)) sel.removeAllRanges()
    return undefined
  }, [editing])

  useEffect(() => {
    /* a selected → unselected TRANSITION commits; a block mounted editing before its selection
       lands (editOnMount) must not be closed by the first render's `selected: false` */
    if (wasSelected.current && !selected && editing) finish()
    wasSelected.current = selected
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const commitText = () => {
    if (!textRef.current) return
    const next = textRef.current.innerText
    if (next !== value.text) onChange?.({ text: next })
  }

  const finish = () => {
    commitText()
    setEditing(false)
    if (!open.current) return
    open.current = false
    onExit?.(textRef.current?.innerText ?? '')
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (selected) setEditing(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      finish()
    }
  }

  const handleBlur = () => finish()

  /* hanging punctuation: the marks at a line's edge pulled outside the box, again once the fonts have loaded */
  useLayoutEffect(() => {
    const el = textRef.current
    if (editing || !el?.querySelector('[data-hang]')) return undefined
    hangMarks(el)
    let live = true
    document.fonts?.ready.then(() => { if (live) hangMarks(el) })
    return () => { live = false }
  })

  const display = editing ? value.text : applyCase(value.text, value.case)
  const textTransform = editing
    ? 'none'
    : (value.case === 'upper' ? 'uppercase' : value.case === 'lower' ? 'lowercase' : 'none')

  return (
    <div
      ref={textRef}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => {
        if (editing) {
          /* Don't bubble — parent uses mousedown to start canvas drag,
             which would interrupt the caret-positioning click inside
             the contentEditable text. */
          e.stopPropagation()
          return
        }
        onMouseDown?.(e)
      }}
      spellCheck={false}
      className={className}
      style={{
        /* familyCss wins when the consumer resolved it; otherwise the family
         * model's own (an old width-cut value reads as Inter, families.js). */
        fontFamily:    value.familyCss ?? familyCssFor(value),
        fontWeight:    value.weight,
        fontStyle:     value.fontStyle ?? (value.italic ? 'italic' : 'normal'),
        fontSize:      `${value.size}px`,
        letterSpacing: `${value.tracking}em`,
        lineHeight:    value.lineHeight,
        textAlign:     value.textAlign ?? 'center',
        color:         value.color,
        WebkitTextStrokeColor: value.strokeColor || undefined,
        WebkitTextStrokeWidth: value.strokeWidth > 0 && value.strokeColor ? `${value.strokeWidth}px` : undefined,
        paintOrder:    value.strokeWidth > 0 && value.strokeColor ? 'stroke fill' : undefined,
        textTransform,
        ...value.textCss,
        ...(value.trim ? { marginTop: -value.trim.top, marginBottom: -value.trim.bottom } : {}),
        ...(value.clamp && !editing ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: value.clamp, overflow: 'hidden' } : {}),
        outline:       'none',
        minHeight:     '1em',
        overflowWrap:  'break-word',
        whiteSpace:    'pre-wrap',
        cursor:        editing ? 'text' : (selected ? 'move' : 'pointer'),
        userSelect:    editing ? 'text' : 'none',
      }}
    >
      {!editing && value.paragraphs
        ? value.paragraphs.map((p, i) => (
          <div key={i} style={p.style}>
            {p.marker && <span style={p.markerStyle}>{p.marker}</span>}
            {p.segs
              ? p.segs.map((g, k) => (typeof g === 'string' ? g : <span key={k} data-hang={g.hang}>{g.t}</span>))
              : p.text || '\u200b'}
          </div>
        ))
        : display}
    </div>
  )
}
