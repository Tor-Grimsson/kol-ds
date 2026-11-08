/* One 8px rounded bar split into `segments` `{ key?, label, value, color }` by their share of `total` (default their
 * sum). For a store's file types; ProportionBar is the ink-ladder version. */
export default function SegmentBar({ segments, total }) {
  const sum = total ?? segments.reduce((a, s) => a + s.value, 0)
  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-fg-08 mt-4">
      {segments.map((s) => <div key={s.key ?? s.label} style={{ width: `${(s.value / sum) * 100}%`, background: s.color }} />)}
    </div>
  )
}
