/**
 * RockerSwitch — the I/O rocker with a backlit paddle (kol-monitor's
 * `PowerModule`, the switch alone, lifted 2026-09-01). 28 × 38 housing on the
 * hardware cap; the paddle sits top when on (LED red, glowing) and bottom when
 * off; static I / O legends on the housing show whichever half is uncovered.
 *
 * @param {boolean}  on
 * @param {Function} onToggle
 */
export default function RockerSwitch({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 28,
        height: 38,
        borderRadius: 3,
        backgroundColor: 'var(--kol-ctl-hw-cap)',
        border: '2px solid var(--kol-ctl-hw-cap-edge)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.6)',
      }}
    >
      {/* Rocker paddle */}
      <div style={{
        position: 'absolute',
        left: 2,
        right: 2,
        height: '50%',
        top: on ? 0 : '50%',
        borderRadius: 2,
        backgroundColor: on ? 'var(--kol-ctl-led-red)' : 'var(--kol-ctl-hw-cap-edge)',
        boxShadow: on
          ? '0 0 8px color-mix(in srgb, var(--kol-ctl-led-red) 50%, transparent), inset 0 1px 0 var(--kol-ctl-hw-cap-edge)'
          : 'inset 0 1px 0 var(--kol-ctl-hw-cap-edge)',
        transition: 'top 0.1s, background-color 0.15s, box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span className="kol-helper-8" style={{ color: on ? 'var(--kol-color-ab-white)' : 'var(--kol-ctl-hw-on-cap)', lineHeight: 1 }}>
          {on ? 'I' : 'O'}
        </span>
      </div>

      {/* Static labels on housing */}
      <span className="kol-helper-xxxxs" style={{ position: 'absolute', top: 3, left: 0, right: 0, textAlign: 'center', color: on ? 'transparent' : 'var(--kol-ctl-hw-cap-edge)', pointerEvents: 'none' }}>I</span>
      <span className="kol-helper-xxxxs" style={{ position: 'absolute', bottom: 3, left: 0, right: 0, textAlign: 'center', color: on ? 'var(--kol-ctl-hw-cap-edge)' : 'transparent', pointerEvents: 'none' }}>O</span>
    </div>
  )
}
