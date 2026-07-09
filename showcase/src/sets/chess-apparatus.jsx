import { ChessAnalysisLayout } from '@kolkrabbi/kol-component/chess'
import * as chessData from '../workshop/chess/data/sample-games.js'

export const meta = {
  title: 'Chess apparatus',
  description: 'The full chess analysis apparatus — game archive, board, playback, notation, variations',
  category: 'game',
  featured: true,
}
export const stage = 'full'

/* Renders the SHIPPED package (@kolkrabbi/kol-component/chess) — the same code the
 * monorepo installs — so the gallery can't drift from what's published. Styling comes
 * from @kolkrabbi/kol-theme (kol-components-chess.css). Game data is not bundled in the
 * package; the showcase feeds its local sample dataset via the `chessData` adapter
 * (getSampleGames / getManifest / getMonthlySummary / getRandomMonth / loadMonthGames /
 * getGamePgnByIdAsync — all exported by workshop/chess/data/sample-games.js). */
export default function ChessApparatusSet() {
  return (
    <div className="p-6">
      <ChessAnalysisLayout chessData={chessData} />
    </div>
  )
}
