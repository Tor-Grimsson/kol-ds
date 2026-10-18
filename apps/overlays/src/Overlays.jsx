import { useState } from 'react'
import {
  Button, FullscreenOverlay, LabeledControlSection, QuickLookFrame, ModalProvider, SettingsPanel, SettingsRow,
  shortcutInScope, useModal,
} from '@kolkrabbi/kol-component'
import CommandModes, { KEYMAP } from './CommandModes.jsx'
import Specimen from './Specimen.jsx'

/* EVERY OVERLAY MODAL ON ONE PAGE (ShortcutsOverlayCategories, kol-monitor 2026-10-18 — user: *"I asked for EVERY
 * FUCKING TYPE OF OVERLAY MODAL"*). Each button opens the shipped component on monitor's real content
 * (monitor-data.js); nothing here is a component of its own. The list itself: apps/overlays frames it as a page
 * (App.jsx) and the showcase's Overlays set mounts it as is — one file, so the two cannot drift. */

/* apps/controls' Specimen, verbatim — the reference app's one row shape: title, where it ships, the stage */
function Group({ title, ships, children }) {
  return <Specimen title={title} ships={ships}>{children}</Specimen>
}

/* the repo's own images (public/kol-images) */
const SHOTS = ['tt-01', 'tt-02', 'tt-03', 'tt-06', 'tt-07'].map((n) => ({ url: `/kol-images/${n}.jpg`, kind: 'image', alt: n }))

const Open = ({ onClick, children }) => <Button tone="grey" size="md" onClick={onClick}>{children}</Button>

function Dialogs() {
  const { prompt, confirm, alert } = useModal()
  return (
    <Group title="Modal" ships="kol-component · useModal">
      <Open onClick={() => prompt('Name this frame:', 'Untitled')}>prompt</Open>
      <Open onClick={() => confirm('Discard unsaved changes?')}>confirm</Open>
      <Open onClick={() => confirm('Web-optimise raster images?', { okLabel: 'Upload', options: [{ id: 'optimise', label: 'Optimise', hint: '≤2560 px, ≤500 KB', defaultValue: true }, { id: 'keepOriginals', label: 'Keep originals', defaultValue: true }] })}>confirm + options</Open>
      <Open onClick={() => alert('Upload failed: quota exceeded')}>alert</Open>
    </Group>
  )
}

export default function Overlays() {
  const [open, setOpen] = useState(null)
  const [shot, setShot] = useState(0)
  const close = () => setOpen(null)
  /* monitor's ⇧S shortcuts rail (src/overlays/ShortcutsRail.jsx), verbatim — the reference for the rail */
  const shortcutsRail = KEYMAP.filter((sec) => shortcutInScope(sec, '/rack')).map((sec) => (
    <LabeledControlSection key={sec.section} label={sec.section} divided rowGap={1}>
      {sec.items.map((it) => (
        <SettingsRow key={it.label + it.combo} label={it.label} text>
          <span className="kol-mono-12 text-fg-80">{it.combo}</span>
        </SettingsRow>
      ))}
    </LabeledControlSection>
  ))

  return (
    <ModalProvider>
      <div>
        <CommandModes Group={Group} Open={Open} />

        <Dialogs />

        <Group title="SettingsPanel" ships="kol-component · SettingsPanel">
          <Open onClick={() => setOpen('rail')}>rail</Open>
          <Open onClick={() => setOpen('overlay')}>overlay</Open>
        </Group>

        {/* apps/media's Quick Look (MediaLibraryPages): FullscreenOverlay over a scrim holding a QuickLookFrame */}
        <Group title="Quick Look" ships="kol-component · QuickLookFrame">
          <Open onClick={() => { setShot(0); setOpen('quicklook') }}>quick look</Open>
        </Group>
      </div>

      {(open === 'rail' || open === 'overlay') && (
        <SettingsPanel open variant={open} title="Shortcuts" onClose={close}>{shortcutsRail}</SettingsPanel>
      )}
      {open === 'quicklook' && (
        <FullscreenOverlay open onClose={close} closeButton={false} scrim>
          <QuickLookFrame
            title={`${SHOTS[shot].alt}.jpg`}
            onClose={close}
            nav={{ index: shot, total: SHOTS.length, onPrev: () => setShot((i) => (i + SHOTS.length - 1) % SHOTS.length), onNext: () => setShot((i) => (i + 1) % SHOTS.length) }}
          >
            <img src={SHOTS[shot].url} alt={SHOTS[shot].alt} className="kol-quicklook-media" />
          </QuickLookFrame>
        </FullscreenOverlay>
      )}
    </ModalProvider>
  )
}
