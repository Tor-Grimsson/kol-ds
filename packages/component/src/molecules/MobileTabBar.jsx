import TabsRow, { TABBAR_H } from './TabsRow.jsx'

/**
 * @deprecated 2026-10-17 — alias of `TabsRow look="stacked" placement="phone"` (TabsStackedLayout). Drops when nobody imports it (04-retirements.md).
 * MobileTabBar — Old name for the stacked phone bar. Same props: `tabs` (`{ value, label, icon }`) · `value` · `onChange` · `className`.
 */
export { TABBAR_H }
export default function MobileTabBar(props) {
  return <TabsRow look="stacked" placement="phone" {...props} />
}
