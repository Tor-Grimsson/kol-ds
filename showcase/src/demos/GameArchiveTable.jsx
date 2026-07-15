import { GameArchiveTable } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'md'

/* Data is consumer-injected via `chessData` — the package's `/data` adapter
 * feeds the month dropdown and archive rows. `onGameLoad` is a no-op here
 * since there's no board to feed. */
export default function GameArchiveTableDemo() {
  return <GameArchiveTable chessData={chessData} onGameLoad={() => {}} />
}
