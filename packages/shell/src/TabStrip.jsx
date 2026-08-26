/**
 * TabStrip — the flat text-tab idiom both shells use twice (ContentFilters
 * view-mode/layout spans, Settings tabs): `kol-helper-14`, active
 * `text-fg-96`, rest `text-fg-32 hover:text-fg-48`.
 *
 * No auto-casing — labels render exactly as authored (the source repos'
 * `text-transform: uppercase` dropped per the DS law; author "GRID" if you
 * want GRID). `tracked` adds the 1px letter-spacing the view-mode strips
 * carried.
 *
 * SINGLE-SELECT ONLY. A `Set` form for multi-select was added 2026-08-15 so the
 * retired ContentFilters fork could render filter values through this — and
 * removed the same day with it. A multi-select, handler-carrying, active/rest
 * chip is a `Tag`; building a second one here under another name in another
 * package is exactly the duplication kol-shell exists to end.
 *
 * @param {Array} props.options  `[{ value, label }]`
 */
export default function TabStrip({ options = [], value, onChange, size = 14, tracked = false, className = 'gap-6', style }) {
  return (
    <div className={`flex items-center ${className}`.trim()} style={style}>
      {options.map((opt) => (
        <span
          key={opt.value}
          onClick={() => onChange?.(opt.value)}
          className={`kol-helper-${size} cursor-pointer select-none ${value === opt.value ? 'text-fg-96' : 'text-fg-32 hover:text-fg-48'}`}
          style={tracked ? { letterSpacing: 1 } : undefined}
        >
          {opt.label}
        </span>
      ))}
    </div>
  )
}
