import { useEffect, useRef, useState } from 'react'
import { Button, pushLayer, popLayer, isTopLayer } from '@kolkrabbi/kol-component'

/**
 * WalkthroughPanel — A stepped intro card. the absolutely-centred stepped intro card (both repos'
 * HomePage): chevron Buttons either side, text column + illustration pane.
 *
 * Steps are content: `[{ title, text: [..], illustration?, actions? }]` —
 * `illustration` is a render slot (monitor globs SVGs, mirror uses a JPEG),
 * a step with `actions` renders that node centred instead of the text/image
 * split (the "Get started" step).
 *
 * `onClose` draws an X INSIDE the card, top-right (user, 2026-09-26, on media-hub:
 * the panel had no close of its own, so every app put one outside the card or on a
 * page button). Unset = no X, exactly as before.
 *
 * KEYS (kol-fxr 2026-10-09, HubWalkthroughEscape): Escape calls `onClose`, ← → page. The panel
 * joins the DS overlay layer stack, so a sheet opened above it takes the Escape first, and keys
 * typed into a field are left alone.
 */
export default function WalkthroughPanel({ steps = [], iconComponent, onClose }) {
  const [step, setStep] = useState(0)
  const current = steps[step]
  const live = useRef()
  live.current = { onClose, last: steps.length - 1 }
  useEffect(() => {
    const layer = pushLayer()
    const onKey = (e) => {
      if (!isTopLayer(layer) || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      if (e.key === 'Escape' && live.current.onClose) { e.preventDefault(); live.current.onClose() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setStep((s) => Math.max(0, s - 1)) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setStep((s) => Math.min(live.current.last, s + 1)) }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); popLayer(layer) }
  }, [])
  if (!current) return null

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex', alignItems: 'center', gap: 16,
      maxWidth: 960, width: '100%', zIndex: 10,
    }}>
      <Button
        tone="grey"
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
        tone="grey"
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
