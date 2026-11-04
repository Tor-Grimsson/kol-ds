import { Button } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'

/* taxonomy-ok: molecule — kol-framework's ThemeToggle over a row of float Buttons */

/**
 * RailDisplayControls — The rail's foot (float-everything W9 row 134, 2026-11-04): the theme row (kol-framework's
 * ThemeToggle, which names what the next click does) over a well on the `--kol-float-list-r` round holding Collapse
 * and Hide as two quiet float buttons with their glyphs (`kol-float-label`). The exploration's `Sidebar display
 * controls` (kol-float--style 9:14611).
 *
 * @param {Function} onCollapse · {Function} onHide  the two presses
 * @param {boolean}  theme          the theme row above the well (default true)
 * @param {string}   collapseLabel · {string} hideLabel  the words (default "Collapse" · "Hide")
 * @param {string}   className
 */
export default function RailDisplayControls({ onCollapse, onHide, theme = true, collapseLabel = 'Collapse', hideLabel = 'Hide', className = '' }) {
  return (
    <div className={`kol-rail-display kol-float-chrome flex flex-col gap-2 ${className}`.trim()}>
      {theme && <ThemeToggle size="sm" fill="none" className="kol-float-label self-start" />}
      <div className="flex items-center gap-1 p-1 rounded-[var(--kol-float-list-r)] bg-[var(--kol-float-well)]">
        <Button variant="float" tone="ghost" size="md" iconLeft="panel-left" iconGap={10} className="flex-1 justify-start kol-float-label" onClick={onCollapse}>{collapseLabel}</Button>
        <Button variant="float" tone="ghost" size="md" iconLeft="hamburger" iconGap={10} className="flex-1 justify-start kol-float-label" onClick={onHide}>{hideLabel}</Button>
      </div>
    </div>
  )
}
