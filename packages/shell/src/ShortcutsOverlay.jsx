import { useEffect } from 'react'
import { SettingsSections } from '@kolkrabbi/kol-component'

/**
 * ShortcutsOverlay — the keyboard-shortcut sheet: blurred scrim, centred
 * panel, a 2-col grid (label · keys), Esc / backdrop-click close.
 * Ported from the shared cut (mirror's, "copied from kol-monitor").
 *
 * `shortcuts` is a prop — feed the SAME array your settings page renders
 * (both repos hand-maintained the list twice and both pairs drifted).
 * Stacks at `--kol-z-modal`, above the rail's sticky tier.
 *
 * TWO FORMS, DETECTED ON SHAPE (ShortcutsOverlaySections, kol-fxr 2026-08-15):
 *
 *   flat       `[{ label, keys }]`                  — one grid, as shipped
 *   sectioned  `[{ section, items: [{label,keys}] }]` — headings between groups
 *
 * The flat form renders EXACTLY as it did before, so no existing caller moves.
 * The sectioned form exists because a real keymap is grouped — kol-fxr's is
 * Edit · Selection · Layer · Tools · View, and its `shortcutsBySection()`
 * already emits this shape — and flattening it to adopt this component would
 * have lost the grouping. That consumer kept a 99-line local overlay instead,
 * which is the duplication this component exists to end.
 *
 * ONE COMPONENT WITH THE SETTINGS PAGE AND THE DRAWER (user, 2026-09-03:
 * *"align it more to the settings sidebar"* → *"lets normalise a component
 * they can grab"*). This sheet and `SettingsShortcuts` render the SAME keymap
 * array and had drifted into two anatomies — a bespoke two-column grid with a
 * plain `text-fg-32` heading and hand-rolled `<span>` pairs here, against
 * eyebrow sections over `SettingsRow`s there, down to the combo being `fg-96`
 * in one and `fg-32` in the other. Both go through `SettingsSections` now, the
 * same call the settings page and the settings drawer use, so a shortcut reads
 * identically wherever it is shown and a change to the row lands in all of
 * them. The FRAME stays each one's own: a scrim and a centred sheet here, a
 * six-column grid on the page, a right-anchored drawer over the thing you are
 * looking at.
 *
 * `keys` is a DISPLAY STRING and is never bound — this component shows a
 * keymap, it does not own one. Formatting a combo (⌘⇧Z) is the consumer's,
 * next to wherever the binding actually lives.
 *
 * @param {Array} props.shortcuts - `[{ label, combo }]` or `[{ section, items: [{ id, label, combo }] }]` — the same array `SettingsShortcuts` takes (ShellHomeSystemMonitorGaps, kol-monitor 2026-08-27: the overlay read `keys` while the settings block read `combo`; `combo` is the name, `keys` is tolerated for a release)
 * @param {Function} props.onClose
 */

const isSectioned = (list) => Array.isArray(list?.[0]?.items)

/* A shortcut as a settings ROW: the label on the left, the combo as the row's
 * value. `labelWidth="auto"` makes the label yield and the combo hug — a combo
 * is one token by nature and must not wrap. */
const toRow = ({ label, combo, keys }) => ({
  label,
  align: 'fill',
  labelWidth: 'auto',
  value: <span className="text-fg-32 kol-helper-12 whitespace-nowrap">{combo ?? keys}</span>,
})

export default function ShortcutsOverlay({ shortcuts = [], onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const sectioned = isSectioned(shortcuts)

  return (
    <div
      onClick={onClose}
      /* THE scrim (overlay-scrim-outliers, kol-client-olina 2026-09-03; user: "we
         removed the blur and put just color on the background … we missed this").
         This drew its own — an 8 % inverse wash plus a 2px blur — after the
         2026-09-01 no-blur ruling and the one-tint-48 class. */
      className="fixed inset-0 select-none kol-overlay-scrim"
      style={{ display: 'grid', placeItems: 'center', zIndex: 'var(--kol-z-modal)' }}
    >
      {/* `bg-oq-04`, not `bg-surface-primary` (user, 2026-09-03: *"this is too
          bright"*). Over a near-black editor canvas the raised page surface
          reads as a lit slab, and an `fg-16` stroke on top of it was the
          brightest edge on screen. The OPAQUE ramp is right here: the sheet
          must not let the canvas through, and `oq-04` is a 4 % lift off the
          ground rather than a surface from the page's own ladder — so the
          panel separates from the scrimmed canvas without a stroke. */}
      <div
        className="kol-shortcuts-panel text-fg-64 kol-helper-12 bg-oq-04 flex flex-col gap-6"
        style={{ padding: 24, borderRadius: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <SettingsSections
          sections={sectioned
            ? shortcuts.map(({ section, items = [] }) => ({ label: section, rowGap: 1, rows: items.map(toRow) }))
            : [{ rowGap: 1, rows: shortcuts.map(toRow) }]}
        />
      </div>
    </div>
  )
}
