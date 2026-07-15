import { ChessHero } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'full'

/* The archive-stats dashboard hero — four metric cards, the 12-month
 * performance-trend chart, and the time-class side rail. Data is
 * consumer-injected via `chessData`: getManifest() + getMonthlySummary()
 * from the `/data` adapter feed every number and both SVG paths — the real
 * 27k-game archive stats, no network. */
export default function ChessHeroDemo() {
  return <ChessHero chessData={chessData} />
}
