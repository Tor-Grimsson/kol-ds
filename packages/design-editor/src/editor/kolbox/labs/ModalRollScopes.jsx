import { deriveScopes, rollEffectsOn, rollScopeOn, setAppSetting, setRollScope, useAppSettings } from './engine.js'
import { Button, LabeledControl, ModalDialog, ToggleSwitch } from '@kolkrabbi/kol-component'

/* "What Settings rolls" (the package's params/RollScopesDialog.jsx), opened from the rail's gear as the real one is: a
   centred window, 420 wide as the real, titled "Randomize all rolls", one switch per scope the lab has and one for
   Effects, the real note, Done. The switches are the app setting `rollScopes` and `rollEffects`, the same ones every
   Randomize all reads (allScopeParams, computeRoll). */
export default function ModalRollScopes({ open, onClose, schema, layer }) {
  useAppSettings()
  if (!open) return null
  const scopes = deriveScopes(schema ?? [], layer)
  return (
    <ModalDialog variant="kolbox" open onClose={onClose} title="Randomize all rolls" width="420px">
      <div className="flex flex-col gap-2 px-4 pb-3" data-roll-scopes-window>
        {scopes.map((s) => (
          <LabeledControl variant="kolbox" horizontal key={s.id} label={s.label} labelWidth={160}>
            <span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label={s.label} checked={rollScopeOn(s.id)} onChange={(v) => setRollScope(s.id, v)} /></span>
          </LabeledControl>
        ))}
        <LabeledControl variant="kolbox" horizontal label="Effects" labelWidth={160}>
          <span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label="Effects" checked={rollEffectsOn()} onChange={(v) => setAppSetting('rollEffects', !!v)} /></span>
        </LabeledControl>
        <p className="text-help text-muted">A scope switched off still rolls from its own button.</p>
      </div>
      <div className="flex px-4 pb-4">
        <Button variant="kolbox" tone="primary" className="w-full" onClick={onClose}>Done</Button>
      </div>
    </ModalDialog>
  )
}
