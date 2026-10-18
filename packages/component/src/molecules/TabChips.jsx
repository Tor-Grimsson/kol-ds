import TabsRow from './TabsRow.jsx'

/**
 * @deprecated 2026-10-17 — alias of `TabsRow look="chip"` (TabsStackedLayout: one tab component). Drops when nobody imports it (04-retirements.md).
 * TabChips — Old name for TabsRow's chip look. Same props: `tabs` · `value` · `onChange` · `size` · `ariaLabel` · `className`.
 */
export default function TabChips(props) {
  return <TabsRow look="chip" {...props} />
}
