import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const meta = {
  title: 'Chess apparatus',
  description: 'The full chess analysis apparatus — game archive, board, playback, notation, variations',
  category: 'game',
  featured: true,
}
export const stage = 'full'

/* Renders the SHIPPED package (@kolkrabbi/kol-chess) — the same code the monorepo
 * installs — so the gallery can't drift from what's published. Styling comes from
 * @kolkrabbi/kol-theme (kol-components-chess.css). Game data comes from the package's
 * own adapter (@kolkrabbi/kol-chess/data — getSampleGames / getManifest /
 * getMonthlySummary / getRandomMonth / loadMonthGames / getGamePgnByIdAsync; demo set
 * bundled, full archive fetched from the B2 CDN). */
export default function ChessApparatusSet() {
  return (
    <div className="p-6">
      <ChessAnalysisLayout chessData={chessData} />
    </div>
  )
}
