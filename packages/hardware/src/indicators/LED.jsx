/* The set's own LED colours (`--kol-ctl-led-*`) — a module that needs a
 * red/green/yellow uses <LED color="…"> or the same token, never a hex. */
const COLORS = {
  red: 'var(--kol-ctl-led-red)',
  yellow: 'var(--kol-ctl-led-yellow)',
  green: 'var(--kol-ctl-led-green)',
  white: 'var(--kol-fg-88)',
  blue: 'var(--kol-ctl-led-blue)',
}

const SIZES = { sm: 6, md: 8 }
const HIT_PAD = 5

/**
 * LED — the indicator lamp (kol-monitor's rack, lifted 2026-09-01). Sizes sm 6 ·
 * md 8; colours red · yellow · green · white · blue, or any CSS colour. With
 * `onClick` an invisible hit pad (+5px each side) overlays the lamp.
 *
 * @param {boolean}  active
 * @param {string}   color   a name above or a CSS colour (default red)
 * @param {'sm'|'md'|number} size
 * @param {Function} onClick
 */
export default function LED({ active = false, color = 'red', size = 'sm', onClick }) {
  const s = SIZES[size] || size
  const c = COLORS[color] || color
  return (
    <div style={{ width: s, height: s, flexShrink: 0, position: 'relative' }}>
      <div style={{
        width: s,
        height: s,
        borderRadius: '50%',
        backgroundColor: active ? c : 'var(--kol-fg-16)',
        boxShadow: active ? `0 0 4px color-mix(in srgb, ${c} 40%, transparent)` : 'none',
        transition: 'background-color 0.1s, box-shadow 0.1s',
      }} />
      {onClick && (
        <div
          onClick={onClick}
          style={{ position: 'absolute', top: -HIT_PAD, left: -HIT_PAD, width: s + HIT_PAD * 2, height: s + HIT_PAD * 2, cursor: 'pointer' }}
        />
      )}
    </div>
  )
}
