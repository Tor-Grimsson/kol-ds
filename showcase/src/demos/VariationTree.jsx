import { VariationTree, ChessControlsProvider } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'md'

/* VariationTree renders the move tree parsed from the active game's PGN, which
 * lives in ChessControlsContext. Data is consumer-injected: the `/data` adapter
 * seeds the provider with the sample games (each carries a full PGN), so the
 * tree is real and clickable. */
export default function VariationTreeDemo() {
  return (
    <ChessControlsProvider chessData={chessData}>
      <VariationTree />
    </ChessControlsProvider>
  )
}
