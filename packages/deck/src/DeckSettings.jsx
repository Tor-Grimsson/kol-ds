import { useState } from 'react'
import { Button, ColorSwatch, FullscreenOverlay, Input, LabeledControl, LabeledControlSection } from '@kolkrabbi/kol-component'
import { ROLE } from './slideDoc.js'

/* taxonomy-ok: organism — FullscreenOverlay + Input, ColorSwatch and LabeledControlSection as the deck-wide settings form */

/**
 * DeckSettings — the per-presentation pass, before anyone opens a slide.
 *
 * The user's ask, 2026-09-03: *"maybe we could have some streamline way to have
 * a view/modal where you set date and heading, or event and background color,
 * like per presentation settings … before you go in and individual edit"*.
 *
 * It edits three things that are true of the WHOLE deck rather than of any one
 * slide: the deck name in the footer and cover, the date line, and the ground
 * every slide is drawn on. Everything else stays a per-slide edit.
 *
 * SEEDED FROM THE DECK, not from blank. Opening it reads the current values off
 * the first layer carrying each role, so the fields show what the deck actually
 * says rather than making you retype it to keep it.
 *
 * The form is a SEPARATE component mounted only while open, so its `useState`
 * lazy initialisers do the seeding. The first version used a `useEffect` that
 * called three setState on `open` — which the lint rule rightly refuses, since
 * setting state synchronously in an effect cascades a second render. Remounting
 * is both cheaper and the honest expression of "read the deck as it is now".
 *
 * Nothing is applied until Apply: the modal holds a draft, so cancelling is
 * genuinely a cancel and there is no half-written deck if you close it.
 */
const firstWithRole = (slides, role) => {
  for (const s of slides) {
    const hit = s.doc.layers.find((l) => l.role === role)
    if (hit) return hit.text ?? ''
  }
  return ''
}

function SettingsForm({ onClose, slides, greys, absoluteBlack, onApply }) {
  const [name, setName] = useState(() => firstWithRole(slides, ROLE.NAME))
  const [date, setDate] = useState(() => firstWithRole(slides, ROLE.DATE))
  const [background, setBackground] = useState(() => slides[0]?.doc?.bg ?? '')

  /* the ground options are the deck's own ramp plus its true black — a deck
     background is a token like every other colour here, not a free hex */
  const grounds = [['var(--kol-color-absolute-black)', absoluteBlack], ...Object.entries(greys)]

  return (
    <div className="w-[520px] max-w-[92vw] flex flex-col gap-5 p-6">
      <p className="kol-eyebrow text-fg-80">Deck settings</p>

      <LabeledControlSection label="Identity">
          <LabeledControl label="Deck name">
            <Input size="sm" className="w-full" value={name} onChange={(e) => setName(e.target.value)} />
          </LabeledControl>
          <LabeledControl label="Date line">
            <Input size="sm" className="w-full" value={date} onChange={(e) => setDate(e.target.value)} />
          </LabeledControl>
          <p className="kol-helper-10 text-fg-48">
            Written into every slide that carries the matching role, not by matching text.
          </p>
      </LabeledControlSection>

      <LabeledControlSection label="Background">
          <div className="flex flex-wrap gap-1">
            {grounds.map(([token, hex]) => (
              <ColorSwatch
                key={token}
                hex={hex}
                size={22}
                selected={background === token}
                title={token}
                onClick={() => setBackground(token)}
              />
            ))}
          </div>
      </LabeledControlSection>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => onApply?.({ name, date, background })}>Apply to deck</Button>
      </div>
    </div>
  )
}

export default function DeckSettings({ open, onClose, slides = [], greys = {}, absoluteBlack = '#000000', onApply }) {
  return (
    <FullscreenOverlay open={open} onClose={onClose}>
      {open && <SettingsForm onClose={onClose} slides={slides} greys={greys} absoluteBlack={absoluteBlack} onApply={onApply} />}
    </FullscreenOverlay>
  )
}
