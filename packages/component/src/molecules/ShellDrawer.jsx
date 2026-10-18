import Rail from './Rail.jsx'

/**
 * @deprecated 2026-10-17 — alias of Rail (RailOverlay: two words, rail and overlay). Drops when nobody imports it (04-retirements.md).
 * ShellDrawer — Old name for Rail. The edge drawer is a rail now: same props (`side`, `width`, `height`, `header`,
 * `backdrop`, `closeSide`, `closeSize`, `edge`, `shadow`), plus `side="top"`, `mode="push"` and `resizable`.
 */
export default function ShellDrawer(props) {
  return <Rail {...props} />
}
