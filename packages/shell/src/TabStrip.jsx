import { TabsRow } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-10-17 — alias of kol-component's `TabsRow variant="text"` (TabsStackedLayout: one tab component). Drops when nobody imports it (04-retirements.md).
 * TabStrip — Old name for TabsRow's text variant. Same props: `options` (`{ value, label }`) · `value` · `onChange` · `size` · `tracked` · `className` · `style`.
 */
export default function TabStrip({ options = [], className = 'gap-6', ...rest }) {
  return <TabsRow variant="text" tabs={options} className={className} {...rest} />
}
