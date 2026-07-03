import Divider from '../atoms/Divider.jsx'

/**
 * EditorShell — the two-rail editor layout frame.
 *
 *   ┌──────────────── topbar ──────────────────────┐
 *   ├────────┬──────────────────────────┬──────────┤
 *   │  left  │  [canvasHeader]          │  right   │
 *   │  rail  │  children (canvas)       │  rail    │
 *   └────────┴──────────────────────────┴──────────┘
 *
 * Fixed-width rails flank a fluid canvas column, all under an optional topbar.
 * Hairlines between regions are composed from the DS `Divider` (vertical
 * between rails/canvas, horizontal under the topbar and rail/canvas headers).
 * Headers render only when their slot is filled, so an unused header
 * contributes no border or gap (the source's `:empty` collapse, expressed as a
 * conditional render instead of a CSS rule).
 *
 * Ported from the brand editor with the app couplings dropped (per lobby
 * spec): the panel-registry + `panelsForSlot`/`SLOTS` indirection is replaced
 * by plain ReactNode slots (`left` / `right` / `children` + optional headers,
 * topbar, overlays); the `MenuTop` / `ShortcutsOverlay` imports become the
 * `topbar` / `overlays` slots; the editor stylesheet import is gone (layout is
 * Tailwind + composed Divider); the `#0E0E11` dark canvas is a `canvasBg` prop.
 * `data-editor-keep-selection` stays as an opt-in click-away hook, not baked
 * behavior.
 *
 * @param {ReactNode} topbar       top bar spanning the full width (optional)
 * @param {ReactNode} leftHeader   left rail header (optional; renders a hairline when set)
 * @param {ReactNode} left         left rail body (scrolls independently)
 * @param {ReactNode} canvasHeader sub-bar spanning only the canvas column, e.g. a tool palette (optional)
 * @param {ReactNode} children     the canvas region (fills the fluid column)
 * @param {ReactNode} rightHeader  right rail header (optional)
 * @param {ReactNode} right        right rail body (scrolls independently)
 * @param {ReactNode} overlays     floating overlays rendered above the frame (optional)
 * @param {number}    railWidth    rail column width in px (default 320)
 * @param {string}    canvasBg     canvas column background (default var(--kol-surface-primary))
 * @param {string|number} height   shell height (default '100dvh'; pass a bounded value to embed)
 * @param {string}    className    extra classes merged onto the shell root
 */
export default function EditorShell({
  topbar,
  leftHeader,
  left,
  canvasHeader,
  children,
  rightHeader,
  right,
  overlays,
  railWidth = 320,
  canvasBg = 'var(--kol-surface-primary)',
  height = '100dvh',
  className = '',
}) {
  return (
    <div
      data-editor-keep-selection
      className={`flex flex-col overflow-hidden bg-surface-primary ${className}`.trim()}
      style={{ height }}
    >
      {topbar && (
        <>
          <div className="shrink-0">{topbar}</div>
          <Divider />
        </>
      )}

      <div className="flex flex-1 min-h-0">
        <Rail header={leftHeader} width={railWidth}>{left}</Rail>
        <Divider variant="vertical" />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          {canvasHeader && (
            <>
              <div className="shrink-0">{canvasHeader}</div>
              <Divider />
            </>
          )}
          <main
            className="flex-1 min-h-0 select-none"
            style={{ background: canvasBg }}
          >
            {children}
          </main>
        </div>

        <Divider variant="vertical" />
        <Rail header={rightHeader} width={railWidth}>{right}</Rail>
      </div>

      {overlays}
    </div>
  )
}

/* Rail — fixed-width aside with an optional header (+ hairline) over a
 * scrolling body. `min-h-0` lets the body's overflow scroll instead of
 * stretching the whole shell. */
function Rail({ header, width, children }) {
  return (
    <aside className="flex flex-col min-h-0 shrink-0" style={{ width }}>
      {header && (
        <>
          <div className="shrink-0">{header}</div>
          <Divider />
        </>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </aside>
  )
}
