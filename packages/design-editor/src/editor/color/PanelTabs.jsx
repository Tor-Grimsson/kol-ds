import { Button, CloseButton } from '@kolkrabbi/kol-component'
import EditorIcon from '../icons/EditorIcon'

const COLOR_TABS = ['Stroke', 'Colour', 'Swatches']

/**
 * TabsRow — bare tab row (close · tabs · minimise).
 * No outer chrome; the consumer wraps it. Close + minimise icons render only
 * if their handlers are passed. `tabs` defaults to color tabs but accepts any
 * label list — used by ColorModal (color tabs) and SelectionPalettePanel
 * (Palette / Inspector).
 */
export function TabsRow({ tabs = COLOR_TABS, active, onChange, onClose, onMinimise }) {
  return (
    <div className="flex items-stretch gap-4 px-3 h-10">
      {/* THE WHOLE CELL TAKES THE PRESS (editor-chrome-review, 2026-09-03 —
          user: *"the close button, only closes on icon - but should on whole
          container.. thats global targeting issues"*). This was a 12px glyph at
          `lineHeight: 0` with no padding: a 12×12 target inside a 40px header.
          `CloseButton` is the DS component that exists for it and carries the
          box. */}
      {onClose && <CloseButton onClick={onClose} size="sm" className="self-center" />}

      {tabs.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange?.(t)}
            aria-pressed={isActive}
            className={[
              'kol-mono-12 flex items-center cursor-pointer border-b-2',
              isActive
                ? 'text-emphasis border-fg'
                : 'text-meta hover:text-emphasis border-transparent',
            ].join(' ')}
          >
            {t}
          </button>
        )
      })}

      {/* same 12×12 defect as the close beside it — the DS Button carries the
          box, and `iconComponent` keeps the editor's own glyph */}
      {onMinimise && (
        <Button
          iconComponent={EditorIcon}
          variant="ghost"
          quiet
          size="sm"
          iconOnly="chevron-down"
          onClick={onMinimise}
          aria-label="Minimise"
          title="Minimise"
          className="ml-auto self-center"
        />
      )}
    </div>
  )
}

/**
 * PanelTabs — TabsRow wrapped in standalone chrome (matches the panel shells).
 */
export default function PanelTabs(props) {
  return (
    <div
      className="bg-surface-primary border border-oq-08 rounded overflow-hidden"
      style={{ width: 320 }}
    >
      <TabsRow {...props} />
    </div>
  )
}
