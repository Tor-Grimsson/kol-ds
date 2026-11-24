import { useState } from 'react'
import { comboLabel, shortcutsBySection } from '../engine.js'
import { allRows, shortcutFolds } from '../../search/rows.js'
import { KbdKeys, LabeledControl, LabeledControlSection, CommandOverlay } from '@kolkrabbi/kol-component'

/* Shortcuts: the engine's keymap grouped by section, each row its label and its combo, read from the engine, never typed
   here. view: whose keys, the editor's or 'labs' (the real sheet reads the mounted chrome; round 4, 7.3); a view no key
   names (Home) gets the keys that hold everywhere.
   Round 4, W12, one source in two places, as the real hub has it: the S sheet (this window, the real CommandOverlay in
   its shortcuts mode: the search modal with no field, each section a fold that starts open, ↑↓ Navigate, ↵ Collapse,
   Esc Close, ⌘↵ Collapse all) and Settings' Shortcuts tab (ShortcutsList, the real rail's tab: the sections as rows). */
export const keymap = (view) => shortcutsBySection(view).map(({ section, items }) => ({
  section,
  items: items.map((s) => ({ id: s.id, label: s.label, combo: s.combo, keys: comboLabel(s.combo) })),
}))

export function ShortcutsList({ view = 'editor' }) {
  return (
    <div data-window="shortcuts">
      {keymap(view).map(({ section, items }) => (
        <LabeledControlSection variant="kolbox" key={section} label={section}>
          {items.map((s, i) => (
            <LabeledControl variant="kolbox" horizontal key={`${s.id}-${i}`} label={s.label} labelWidth={160}>
              <span className="flex flex-1 justify-end" data-combo><KbdKeys variant="kolbox" keys={s.keys} size="md" /></span>
            </LabeledControl>
          ))}
        </LabeledControlSection>
      ))}
    </div>
  )
}

export default function WindowShortcuts({ onClose, view = 'editor' }) {
  const [active, setActive] = useState(0)
  const groups = [{ title: 'Shortcuts', rows: shortcutFolds(allRows({ shortcuts: keymap(view) })) }]
  return <CommandOverlay variant="kolbox" open mode="shortcuts" onClose={onClose} groups={groups} active={active} onActive={setActive} />
}
