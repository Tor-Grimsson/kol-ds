import { Icon } from '@kolkrabbi/kol-icons'
import { Button } from '@kolkrabbi/kol-component'

/**
 * THE CONTROL PANEL'S TWO STATES — one structure for labs and the generator (2026-10-05, the
 * user: "they opposite open, and they dont follow the same structure"). Labs hung its controls
 * off a top bar and a right drawer; the generator rose from the bottom. Both chromes now frame
 * their controls the same way per device — a rail on the right at a desk, a sheet from the bottom
 * on a phone — and both wear these two parts, so the frame cannot drift again:
 *
 *   PanelHeader — the panel's first row. The title IS the collapse control (label + chevron,
 *                 left); one optional action sits right.
 *   PanelPills  — collapsed: the row that stands in for the panel, bottom-left. Its first pill
 *                 reopens; the rest are the chrome's own shortcuts.
 *
 * They are the generator's header and pill (MobileOverlay, user rulings 2026-08-12 and
 * 2026-09-01), lifted out unchanged.
 */

export function PanelHeader({ title, onCollapse, action, className = 'px-3' }) {
  return (
    <div className={`flex w-full shrink-0 items-center ${className}`}>
      <button className="kol-helper-12 text-meta flex flex-1 items-center gap-2 py-2.5" onClick={onCollapse}>
        <span>{title}</span>
        {/* Real icon, opaque ink (the icons law — the header's text-meta alpha stays on the TEXT
            only). */}
        <Icon name="chevron-down" size={16} className="text-oq-48" />
      </button>
      {action}
    </div>
  )
}

/* The pill FIRST and the row LEFT-ANCHORED (user, 2026-09-01), `px-3` matching the header's inset,
 * so the label + chevron holds one x in both states. The row WRAPS UPWARD: three `lg` pills are
 * 440px on a 390 screen, and the last one ran off the edge — the pill keeps the bottom line and
 * what does not fit stacks above it. The row itself takes no taps; only its pills do. `tone` is
 * the pill's ground: `primary` over the generator's black stage, `grey` over labs' light one,
 * where a primary fill is the stage's own colour and the pill read as bare text. */
export function PanelPills({ label, onOpen, size = 'lg', tone = 'primary', children }) {
  return (
    <div className="pointer-events-none fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[var(--fxr-rail,0px)] right-0 z-10 flex flex-wrap-reverse gap-2 px-3 [&>*]:pointer-events-auto">
      <Button tone={tone} size={size} onClick={onOpen}>
        <span className="flex items-center gap-2">
          {label}
          <Icon name="chevron-down" size={16} className="rotate-180" />
        </span>
      </Button>
      {children}
    </div>
  )
}
