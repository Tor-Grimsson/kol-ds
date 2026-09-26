import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'

/**
 * WalkthroughPanel — the absolutely-centred stepped intro card (both repos'
 * HomePage): chevron Buttons either side, text column + illustration pane.
 *
 * Steps are content: `[{ title, text: [..], illustration?, actions? }]` —
 * `illustration` is a render slot (monitor globs SVGs, mirror uses a JPEG),
 * a step with `actions` renders that node centred instead of the text/image
 * split (the "Get started" step).
 *
 * `onClose` draws an X INSIDE the card, top-right (user, 2026-09-26, on media-shell:
 * the panel had no close of its own, so every app put one outside the card or on a
 * page button). Unset = no X, exactly as before.
 */
export default function WalkthroughPanel({ steps = [], iconComponent, onClose }) {
  const [step, setStep] = useState(0)
  const current = steps[step]
  if (!current) return null

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex', alignItems: 'center', gap: 16,
      maxWidth: 960, width: '100%', zIndex: 10,
    }}>
      <Button
        variant="grey"
        size="md"
        iconOnly="chevron-left"
        iconComponent={iconComponent}
        disabled={step === 0}
        onClick={() => setStep((s) => Math.max(0, s - 1))}
        style={{ padding: 8 }}
      />

      <div
        className="bg-surface-tertiary border border-fg-08"
        style={{ flex: 1, display: 'flex', borderRadius: 4, minHeight: 480, overflow: 'hidden', position: 'relative' }}
      >
        {onClose && (
          <Button
            variant="nav"
            size="sm"
            iconOnly="x"
            iconComponent={iconComponent}
            aria-label="Close walkthrough"
            onClick={onClose}
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        )}
        {current.actions ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {current.actions}
          </div>
        ) : (
          <>
            <div style={{ flex: 1, padding: '64px 24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="text-fg-80 kol-mono-14" style={{ marginBottom: 12 }}>{current.title}</h3>
                {(current.text || []).map((t, i) => (
                  <p key={i} className="text-fg-48 kol-helper-12" style={{ lineHeight: 1.8, marginTop: i > 0 ? 12 : 0 }}>{t}</p>
                ))}
              </div>
              <span className="text-fg-48 kol-helper-12">{step + 1} / {steps.length}</span>
            </div>
            {current.illustration && (
              <div style={{ flex: '0 0 50%', overflow: 'hidden' }}>
                {current.illustration}
              </div>
            )}
          </>
        )}
      </div>

      <Button
        variant="grey"
        size="md"
        iconOnly="chevron-right"
        iconComponent={iconComponent}
        disabled={step === steps.length - 1}
        onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        style={{ padding: 8 }}
      />
    </div>
  )
}
