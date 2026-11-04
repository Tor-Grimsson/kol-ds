import TreeRow from './TreeRow.jsx'

/**
 * FlyoutRow — A destination in a hover flyout: glyph · name · count. `Tasks 5` (float-everything W8 row 123,
 * 2026-11-04 — kol-float--style 48:3904). `TreeRow` at `md` — 34 tall, a 16 glyph, the 12 name, the count in mono —
 * so a flyout lists the same rows as the sidebar it flies out of. Every TreeRow prop passes through.
 */
export default function FlyoutRow(props) {
  return <TreeRow size="md" {...props} />
}
