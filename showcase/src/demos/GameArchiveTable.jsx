import GameArchiveTable from '../workshop/chess/apparatus/GameArchiveTable.jsx'

export const stage = 'md'

/* GameArchiveTable owns its own data layer: the month dropdown and archive
 * status read from the bundled lightweight sample set. `onGameLoad` is the only
 * prop — a no-op here since there's no board to feed. */
export default function GameArchiveTableDemo() {
  return <GameArchiveTable onGameLoad={() => {}} />
}
