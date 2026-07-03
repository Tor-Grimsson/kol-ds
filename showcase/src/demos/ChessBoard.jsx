import ChessBoard from '../workshop/chess/apparatus/ChessBoard.jsx'

export const stage = 'md'

/* Ruy Lopez after 3.Bb5 — a fixture FEN, no game state, no network.
 * `lastMove` highlights the bishop's f1→b5 travel. */
const FEN = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'

export default function ChessBoardDemo() {
  return (
    <ChessBoard
      fen={FEN}
      size="fluid"
      orientation="white"
      lastMove={{ from: 'f1', to: 'b5' }}
      boardTheme="green-white"
    />
  )
}
