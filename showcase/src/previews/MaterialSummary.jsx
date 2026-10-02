import { MaterialSummary, ChessControlsProvider } from '@kolkrabbi/kol-chess'
import * as chessData from '../demo-data/chess.js'

export const stage = 'sm'

/* One part of the chess control rail, reading the same context the board does — the sample games. */
export default function MaterialSummaryPreview() {
  return (
    <ChessControlsProvider chessData={chessData}>
      <MaterialSummary className="w-full" />
    </ChessControlsProvider>
  )
}
