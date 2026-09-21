import { useRef } from 'react'
import Divider from '../atoms/Divider.jsx'
import useDragResize from '../hooks/useDragResize.js'

/**
 * EditorShell — the two-rail editor layout frame.
 *
 *   ┌──────────────── topbar ──────────────────────┐
 *   ├────────┬──────────────────────────┬──────────┤
 *   │  left  │  [canvasHeader]          │  right   │
 *   │  rail  │  children (canvas)       │  rail    │
 *   │        │  [canvasFooter]          │          │
 *   └────────┴──────────────────────────┴──────────┘
 *
 * Rails flank a fluid canvas column, all under an optional topbar. Hairlines
 * between regions are composed from the DS `Divider`. Headers and footers
 * render only when their slot is filled, so an unused one contributes no
 * border or gap (the source's `:empty` collapse, expressed as a conditional
 * render instead of a CSS rule).
 *
 * Ported from kol-fxr's editor with the app couplings dropped (per lobby
 * spec): the panel-registry + `panelsForSlot`/`SLOTS` indirection is replaced
 * by plain ReactNode slots; the `MenuTop` / `ShortcutsOverlay` imports become
 * the `topbar` / `overlays` slots; the editor stylesheet import is gone; the
 * `#0E0E11` dark canvas is a `canvasBg` prop. `data-editor-keep-selection`
 * stays as an opt-in click-away hook, not baked behavior.
 *
 * THREE GAPS CLOSED 2026-09-03 (`editor-set-is-behind-its-source`, kol-fxr,
 * which adopted this and reverted):
 *
 * 1. **The rails are CSS-width now.** `railWidth` was a px number written
 *    straight onto the element, so a consumer stylesheet had nothing to target
 *    and the rail could not follow a breakpoint. Each rail's width now reads
 *    `var(--kol-editor-{side}-w, {railWidth}px)`, so the prop is the default
 *    and CSS — a media query, a consumer's own rule, a drag — wins over it.
 * 2. **`resizable` gives both rails the estate's grab gesture** through
 *    `useDragResize`, the same hook `SideNav` and kol-shell's `NavRail` wear
 *    (that hook moved from kol-framework to kol-component in this same pass —
 *    a component-tier shell cannot import framework, ARCHITECTURE §3). Each
 *    rail owns its own token, so the two never drag together.
 * 3. **The `.kol-editor-*` class hooks are emitted**, which is what a
 *    consumer's stylesheet targets (fxr's `kol-labs.css` styles this frame by
 *    name). They are HOOKS, not styling: the layout stays here in Tailwind, so
 *    a consumer without those rules renders identically.
 *
 * Footer slots (`leftFooter`, `rightFooter`, `canvasFooter`) also came back —
 * the source fills all three and the port had none.
 *
 * @param {ReactNode} topbar       top bar spanning the full width (optional)
 * @param {ReactNode} leftHeader   left rail header (optional; renders a hairline when set)
 * @param {ReactNode} left         left rail body (scrolls independently)
 * @param {ReactNode} leftFooter   left rail footer, pinned under the scrolling body (optional)
 * @param {ReactNode} canvasHeader sub-bar spanning only the canvas column, e.g. a tool palette (optional)
 * @param {ReactNode} children     the canvas region (fills the fluid column)
 * @param {ReactNode} canvasFooter bar under the canvas, e.g. a timeline or a status line (optional)
 * @param {ReactNode} rightHeader  right rail header (optional)
 * @param {ReactNode} right        right rail body (scrolls independently)
 * @param {ReactNode} rightFooter  right rail footer (optional)
 * @param {ReactNode} overlays     floating overlays rendered above the frame (optional)
 * @param {number}    railWidth    DEFAULT rail width in px (default 320) — the fallback in `var(--kol-editor-{side}-w, …)`, so CSS and a drag both outrank it
 * @param {boolean}   resizable    give both rails the drag-resize grab edge (default false)
 * @param {string}    canvasBg     canvas column background (default var(--kol-surface-primary))
 * @param {string|number} height   shell height (default '100dvh'; pass a bounded value to embed)
 * @param {string}    className    extra classes merged onto the shell root
 */
export default function EditorShell({
  topbar,
  leftHeader,
  left,
  leftFooter,
  canvasHeader,
  children,
  canvasFooter,
  rightHeader,
  right,
  rightFooter,
  overlays,
  railWidth = 320,
  resizable = false,
  canvasBg = 'var(--kol-surface-primary)',
  height = '100dvh',
  className = '',
}) {
  return (
    <div
      data-editor-keep-selection
      className={`kol-editor-shell flex flex-col overflow-hidden bg-surface-primary ${className}`.trim()}
      style={{ height }}
    >
      {topbar && (
        <>
          <div className="shrink-0">{topbar}</div>
          <Divider />
        </>
      )}

      <div className="kol-editor-grid flex flex-1 min-h-0">
        <Rail side="left" header={leftHeader} footer={leftFooter} width={railWidth} resizable={resizable}>
          {left}
        </Rail>
        <Divider variant="vertical" />

        <div className="kol-editor-canvas-column flex flex-col flex-1 min-w-0 min-h-0">
          {canvasHeader && (
            <>
              <div className="kol-editor-canvas-header shrink-0">{canvasHeader}</div>
              <Divider />
            </>
          )}
          <main
            className="kol-editor-canvas flex-1 min-h-0 select-none"
            style={{ background: canvasBg }}
          >
            {children}
          </main>
          {canvasFooter && (
            <>
              <Divider />
              <div className="kol-editor-canvas-footer shrink-0">{canvasFooter}</div>
            </>
          )}
        </div>

        <Divider variant="vertical" />
        <Rail side="right" header={rightHeader} footer={rightFooter} width={railWidth} resizable={resizable}>
          {right}
        </Rail>
      </div>

      {overlays}
    </div>
  )
}

/* Rail — an aside with an optional header (+ hairline) over a scrolling body,
 * and an optional footer pinned under it. `min-h-0` lets the body's overflow
 * scroll instead of stretching the whole shell.
 *
 * The width is a CSS custom property with the prop as its fallback, so the
 * cascade can move it; `useDragResize` writes that same property while
 * dragging. Each side carries its own token — `kol-editor-left` /
 * `kol-editor-right` — because two rails sharing one `:root` variable drag
 * together, which is the bug the hook's own docs record. */
function Rail({ side, header, footer, width, resizable, children }) {
  /* The hook measures the rail it resizes (`ref.current.getBoundingClientRect`
   * seeds the drag), so this is the element ref, not the handle's — the handle
   * gets its own from `grabProps`. */
  const railRef = useRef(null)
  const { grabProps } = useDragResize(railRef, {
    token: `kol-editor-${side}`,
    /* which EDGE the handle sits on: a left rail's handle faces the canvas on
     * its right, so rightward drag widens; a right rail inverts both. */
    side,
  })

  return (
    <aside
      ref={railRef}
      className={`kol-editor-${side} relative flex flex-col min-h-0 shrink-0`}
      style={{ width: `var(--kol-editor-${side}-w, ${typeof width === 'number' ? `${width}px` : width})` }}
    >
      {header && (
        <>
          <div className="kol-editor-rail-header shrink-0">{header}</div>
          <Divider />
        </>
      )}
      <div className="kol-editor-rail-body flex-1 min-h-0 overflow-y-auto">{children}</div>
      {footer && (
        <>
          <Divider />
          <div className="kol-editor-rail-footer shrink-0">{footer}</div>
        </>
      )}
      {/* `.kol-rail-grab` is the drawing (kol-animation.css); the hook supplies
          the proximity wake and the travel. Rendered only when asked, so a
          static shell has no extra hit area over its rail edge. */}
      {resizable && <div {...grabProps} className={`kol-rail-grab kol-rail-grab--${side}`} />}
    </aside>
  )
}
