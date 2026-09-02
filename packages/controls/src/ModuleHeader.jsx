import Toggle from './Toggle.jsx'

/**
 * ModuleHeader — the enable dot + module name, left-aligned (kol-monitor's rack,
 * lifted 2026-09-01). In edit mode the yellow dot removes the module; otherwise
 * an optional bypass dot. The consumer's case-power context became `powered`:
 * when the case is off the dot shows off whatever `enabled` says.
 *
 * @param {string}   label
 * @param {boolean}  enabled · onToggle
 * @param {boolean}  powered      the case's power (default true)
 * @param {boolean}  editMode · {Function} onRemove
 * @param {boolean}  bypass · {Function} onBypass
 */
export default function ModuleHeader({ label, enabled, onToggle, powered = true, editMode, onRemove, bypass, onBypass }) {
  const isOn = powered && enabled

  return (
    <div onClick={() => onToggle?.()} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '0 2px', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}>
      <Toggle value={isOn} size="sm" onChange={() => {}} padding={0} />
      <span className="kol-helper-10 text-fg-48" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', flex: 1 }}>
        {label}
      </span>
      {editMode && onRemove ? (
        <div
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          title="Send module to workbench"
          style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--kol-ctl-led-yellow)', cursor: 'pointer', flexShrink: 0 }}
        />
      ) : onBypass ? (
        <div
          onClick={(e) => { e.stopPropagation(); onBypass() }}
          title={bypass ? 'Bypassed — click to re-engage' : 'Bypass'}
          style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--kol-ctl-cv-attenuate)', opacity: bypass ? 0.25 : 1, cursor: 'pointer', flexShrink: 0 }}
        />
      ) : null}
    </div>
  )
}
