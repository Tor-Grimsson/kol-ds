/* THE RAIL ROW'S TYPE AND INK — one constant, read by `NavRail` (the rail) and `TabsRow`'s stacked phone tab (the bar),
 * so neither retypes it (studio-hub review 2, § 7.1 — the bar's labels take the rail's row type and ink). The label is
 * `kol-helper-12 uppercase` (single-line chrome, always truncated), the glyph 20, the ink oq-64 at rest and oq-96 on
 * the route. The rail's own L1 row rests at oq-96 too (user: "make the color .96 on every icon in the rail"); its L2
 * rows and the bar's tabs rest a rung quieter. */
export const RAIL_ROW = {
  label: 'kol-helper-12 uppercase',
  glyph: 20,
  rest: 'var(--kol-oq-64)',
  active: 'var(--kol-oq-96)',
}
