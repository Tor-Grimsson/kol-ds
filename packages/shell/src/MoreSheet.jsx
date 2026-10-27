import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — a column of nav Buttons */

/**
 * MoreRows — The sheet's rows, wherever the sheet opens. the one list of 44px nav rows (mono-16, 22px glyphs,
 * the pill's rounding on each) that the phone bar's More sheet and Home's masthead button both draw
 * (user 2026-10-23: *"we could even make similar dropdown as we use in phone nav"*). The sheet's chrome is
 * `.kol-more-sheet` — the pill's ground and hairline, a 24px rounding, 8px pad — on whatever box holds the rows.
 *
 * @param {Array}    actions  `[{ label, icon?, onPress, checked? }]` — the page's own buttons, first. A row with `checked`
 *                            (a pick list — TransportPill's loop lengths) draws the 22px check, or keeps its space when false
 * @param {Array}    items    `[{ path, label, icon? }]` — destinations, after a divider's worth of nothing
 * @param {string}   active   the item path that is current
 * @param {Function} onPick   `(item | action) => void` — after the row's own press; the sheet closes here
 */
export default function MoreRows({ actions = [], items = [], active, onPick }) {
  return (
    <>
      {actions.map((a) => (
        <Button key={a.label} variant="nav" size="lg" iconLeft={a.checked === undefined ? a.icon : undefined} iconSize={22} className="w-full justify-start h-11 gap-3" onClick={() => { onPick?.(a); a.onPress?.() }}>
          {a.checked !== undefined && (
            <span className="inline-flex items-center justify-center shrink-0" style={{ width: 22, height: 22 }}>{a.checked && <Icon name="check" size={22} />}</span>
          )}
          {a.label}
        </Button>
      ))}
      {items.map((i) => (
        <Button
          key={i.path}
          variant="nav"
          size="lg"
          iconLeft={i.icon}
          iconSize={22}
          aria-current={i.path === active ? 'page' : undefined}
          className="w-full justify-start h-11 gap-3"
          onClick={() => onPick?.(i)}
        >
          {i.label}
        </Button>
      ))}
    </>
  )
}
