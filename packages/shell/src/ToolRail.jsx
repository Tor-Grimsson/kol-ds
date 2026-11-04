import { Button, Tooltip, floatSurfaceClass } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — a column of float Buttons, each named by the float Tooltip */

/**
 * ToolRail — The editor's tool column as a float (float-everything W5 row 63, 2026-11-04). A 52 capsule, 6 in, 40 slots
 * (`--kol-float-row`) 4 apart; the armed tool is lit (`--kol-fg-16`, the float selection); every slot is named beside
 * the rail by the float Tooltip with its key. The exploration's `Floating tool rail` (kol-float--style 9:9192).
 *
 * @param {Array}    tools     `[{ id, icon, label, kbd? }]` in rail order — `icon` a kol-icons name, `kbd` the tooltip's key
 * @param {string}   value     the armed tool's id
 * @param {Function} onChange  `(id) => void`
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the rail is made of (default `solid`); a glass puts its own ink on the slots
 * @param {string}   className
 */
export default function ToolRail({ tools = [], value, onChange, surface = 'solid', className = '' }) {
  return (
    <div role="toolbar" aria-orientation="vertical" aria-label="Tools" className={`kol-tool-rail kol-float-chrome inline-flex flex-col gap-1 p-1.5 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
      {tools.map((t) => (
        <Tooltip key={t.id} variant="float" placement="right" offset={12} label={t.label} shortcut={t.kbd}>
          <Button variant="float" tone="ghost" iconOnly={t.icon} aria-label={t.label} pressed={t.id === value} onClick={() => onChange?.(t.id)} />
        </Tooltip>
      ))}
    </div>
  )
}
