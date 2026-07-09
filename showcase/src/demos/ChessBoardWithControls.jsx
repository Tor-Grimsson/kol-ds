import { ChessBoardWithControls } from '@kolkrabbi/kol-chess'

export const stage = 'lg'

/* The board + controls composite. It's self-providing — ChessControlsProvider
 * lives inside — and seeds from the bundled sample games, so no props and no
 * network are needed. Left: the fluid board; right: piece-set / theme / playback
 * controls, all wired to the shared context. */
export default function ChessBoardWithControlsDemo() {
  return <ChessBoardWithControls />
}
