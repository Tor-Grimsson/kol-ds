import { useState } from 'react'
import { Chess } from 'chess.js'
import { ChessBoard } from '@kolkrabbi/kol-chess'

export const stage = 'md'

/* Ruy Lopez after 3.Bb5, playable from here — `interactive` + `onMove` is the
 * board-input layer (brief 3.0): tap a side-to-move piece, legal targets mark
 * up, tap one to play. The board validates via chess.js and never emits an
 * illegal move; the demo just applies it and feeds the next fen back in. */
const START_FEN = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'

export default function ChessBoardDemo() {
  const [fen, setFen] = useState(START_FEN)
  const [lastMove, setLastMove] = useState({ from: 'f1', to: 'b5' })

  const handleMove = ({ from, to, promotion }) => {
    const chess = new Chess(fen)
    const move = chess.move({ from, to, promotion })
    if (!move) return
    setFen(chess.fen())
    setLastMove({ from: move.from, to: move.to })
  }

  return (
    <ChessBoard
      fen={fen}
      size="fluid"
      orientation="white"
      lastMove={lastMove}
      boardTheme="green-white"
      interactive
      onMove={handleMove}
    />
  )
}
