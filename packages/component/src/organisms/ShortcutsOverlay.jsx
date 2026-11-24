import { useEffect, useState } from 'react'
import SettingsPanel, { LabeledControlSection, SettingsRow } from './SettingsPanel.jsx'
import CommandOverlay, { isKeyCombo } from './CommandOverlay.jsx'
import ModalShell from '../molecules/ModalShell.jsx'

/**
 * ShortcutsOverlay — The keyboard shortcut sheet. the keyboard-shortcut sheet: blurred scrim, centred
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
 * @param {string} [props.title]  the header, beside the × (default `Shortcuts`)
 * @param {'overlay'|'rail'|'folio'|'kolbox'} [props.variant]  centred (default) or the right rail — SettingsPanel's two forms, so an app
 *   never hand-builds the rail (kol-monitor's ShortcutsRail, 2026-10-18). `folio` (Folio migration batch B, 2026-11-22):
 *   Folio's list (its KeysPanel, carried class for class): `ModalShell variant="folio"` 460 wide centred on the Folio dim,
 *   the title as a label, then each key under a rule, the label in body text and the combo in Folio's green. Flat
 *   `shortcuts` only; drawn in place, never portalled, so it keeps the frame's `data-folio-*`. Escape and a press on the
 *   dim close it. `kolbox` (Folio on kolbox, 2026-11-22): kolbox's S sheet, `CommandOverlay variant="kolbox"
 *   mode="shortcuts"`, from the same array (see `ShortcutsOverlayKolbox`)
 * @param {string} [props.currentPath]  sections may carry `routes: ['/rack']` (CommandOverlayModes, kol-monitor
 *   2026-10-17 — user: *"im in dev, how can I cable lock here?"*): with a path, only the sections that work here
 *   are drawn (ShortcutsOverlayList, kol-monitor 2026-10-18 — the muted ELSEWHERE block is gone). A section without `routes`
 *   works everywhere. Bind keys from the same scope with `shortcutInScope`.
 */

/** Does a shortcut section work on `path`? No `routes` → everywhere; a route matches itself and below it. */
export const shortcutInScope = (section, path) => !section?.routes?.length || path == null
  || section.routes.some((r) => path === r || path.startsWith(`${r.replace(/\/$/, '')}/`))

const isSectioned = (list) => Array.isArray(list?.[0]?.items)

/* ONE OVERLAY, NOT TWO (user 2026-10-18, retiring the near-copy): the sheet is `SettingsPanel variant="overlay"` —
 * the title on the header with the × beside it, a Divider, then the sections exactly as monitor's ⇧S rail draws
 * them (LabeledControlSection divided · SettingsRow text · the combo in mono). Same props as before, plus `title`. */
function ShortcutsOverlayFolio({ shortcuts = [], onClose, title = 'Shortcuts' }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose?.()
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [onClose])
  return (
    <div className="kol-modal-dim--folio fixed inset-0 z-50 flex items-center justify-center px-[16px]" onMouseDown={onClose}>
      <ModalShell variant="folio" role="dialog" aria-label={title} onMouseDown={(e) => e.stopPropagation()} className="kol-shortcuts--folio w-full max-w-[460px] gap-[4px] p-[20px]">
        <p className="kol-folio-label kol-shortcuts-title--folio pb-[10px]">{title}</p>
        {shortcuts.map((it) => (
          <div key={it.label} className="kol-shortcuts-row--folio flex items-baseline justify-between gap-[16px] border-t py-[9px]">
            <span className="kol-folio-body">{it.label}</span>
            <kbd className="kol-folio-meta kol-shortcuts-combo--folio whitespace-nowrap">{it.combo ?? it.keys}</kbd>
          </div>
        ))}
      </ModalShell>
    </div>
  )
}

/* `variant="kolbox"` (Folio on kolbox, 2026-11-22): kolbox's S sheet, which kolbox draws as `CommandOverlay variant="kolbox"
 * mode="shortcuts"` (its WindowShortcuts), from the same `shortcuts`: one group under `title`; a sectioned list's sections
 * are its folds, open. A combo that is one key chord is drawn as key caps, any other text (`S, or ⌥S while writing`) as
 * the row's hint. The sheet keeps its own lit row; Escape and the dim close it. */
function ShortcutsOverlayKolbox({ shortcuts = [], onClose, currentPath, title }) {
  const [active, setActive] = useState(0)
  const row = (it, i, at = '') => ({ id: `${at}${i}:${it.label}`, label: it.label, hint: it.combo ?? it.keys, kbd: isKeyCombo(it.combo ?? it.keys) })
  const rows = isSectioned(shortcuts)
    ? shortcuts.filter((s) => shortcutInScope(s, currentPath)).map((s, n) => ({ id: `cat:${s.section ?? n}`, label: s.section, open: true, items: (s.items ?? []).map((it, i) => row(it, i, `${n}/`)) }))
    : shortcuts.map((it, i) => row(it, i))
  return <CommandOverlay variant="kolbox" open mode="shortcuts" onClose={onClose} groups={[{ title, rows }]} active={active} onActive={setActive} />
}

export default function ShortcutsOverlay({ shortcuts = [], onClose, currentPath, title = 'Shortcuts', variant = 'overlay' }) {
  if (variant === 'kolbox') return <ShortcutsOverlayKolbox shortcuts={shortcuts} onClose={onClose} currentPath={currentPath} title={title} />
  if (variant === 'folio') return <ShortcutsOverlayFolio shortcuts={shortcuts} onClose={onClose} title={title} />
  const sections = isSectioned(shortcuts)
    ? shortcuts.filter((s) => shortcutInScope(s, currentPath))
    : [{ items: shortcuts }]
  return (
    <SettingsPanel open variant={variant} title={title} onClose={onClose}>
      {sections.map((sec, n) => (
        <LabeledControlSection key={sec.section ?? n} label={sec.section} divided rowGap={1}>
          {(sec.items ?? []).map((it, i) => (
            /* the index keeps two keys with one label apart (monitor's Pointer has two "Pan") */
            <SettingsRow key={it.id ?? `${i}:${it.label}`} label={it.label} text>
              <span className="kol-mono-12 text-fg-80">{it.combo ?? it.keys}</span>
            </SettingsRow>
          ))}
        </LabeledControlSection>
      ))}
    </SettingsPanel>
  )
}
