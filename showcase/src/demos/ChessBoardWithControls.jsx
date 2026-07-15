import { ChessBoardWithControls } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'lg'

/* The board + controls composite. ChessControlsProvider lives inside; data is
 * consumer-injected — the `/data` adapter seeds it with the sample games, no
 * network. Left: the fluid board; right: piece-set / theme / playback
 * controls, all wired to the shared context. */
export default function ChessBoardWithControlsDemo() {
  return <ChessBoardWithControls chessData={chessData} />
}
