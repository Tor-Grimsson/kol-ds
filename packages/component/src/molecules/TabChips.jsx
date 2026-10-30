import TabsRow from './TabsRow.jsx'

/**
 * @deprecated 2026-10-17 — alias of `TabsRow variant="chip"` (TabsStackedLayout: one tab component). Drops when nobody imports it (04-retirements.md).
 * TabChips — Old name for TabsRow's chip variant. Same props: `tabs` · `value` · `onChange` · `size` · `ariaLabel` · `className`.
 */
export default function TabChips(props) {
  return <TabsRow variant="chip" {...props} />
}
