import ChessBoard from '../workshop/chess/ChessBoard.jsx'

export const meta = {
  title: 'Chess board',
  description: 'The ported presentational chess board — FEN-driven, themed, no engine or state required.',
}
export const stage = 'hug'

// Ruy Lopez, Breyer variation after 10...Nbd7 (verified with chess.js)
const BREYER_FEN = 'r1bq1rk1/2pnbppp/p2p1n2/1p2p3/3PP3/1BP2N1P/PP3PP1/RNBQR1K1 w - - 1 11'
// Sicilian Najdorf after 5...a6 (verified with chess.js)
const NAJDORF_FEN = 'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6'

export default function ChessBoardBlock() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ChessBoard fen={BREYER_FEN} size="desktop" lastMove={{ from: 'b8', to: 'd7' }} />
      <ChessBoard fen={NAJDORF_FEN} size="tablet" boardTheme="brown" />
    </div>
  )
}
