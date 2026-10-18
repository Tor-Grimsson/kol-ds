import CommandOverlay from './CommandOverlay.jsx'

/**
 * @deprecated 2026-10-17 — alias of CommandOverlay (CommandOverlayModes). Drops when nobody imports it (04-retirements.md).
 * ShellSearchOverlay — Old name for CommandOverlay. The ⌘K search modal is now one overlay with modes; this
 * name keeps every call-site working. Migrate imports to `CommandOverlay`.
 */
export default function ShellSearchOverlay(props) {
  return <CommandOverlay {...props} />
}
export { HighlightMatch } from './CommandOverlay.jsx'
