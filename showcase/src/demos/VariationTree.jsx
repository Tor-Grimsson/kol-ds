import { VariationTree, ChessControlsProvider } from '@kolkrabbi/kol-chess'

export const stage = 'md'

/* VariationTree renders the move tree parsed from the active game's PGN, which
 * lives in ChessControlsContext. The provider self-seeds from the bundled
 * sample games (each carries a full PGN), so the tree is real and clickable. */
export default function VariationTreeDemo() {
  return (
    <ChessControlsProvider>
      <VariationTree />
    </ChessControlsProvider>
  )
}
