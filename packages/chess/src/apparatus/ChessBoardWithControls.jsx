import { useChessControls, ChessControlsProvider } from '../context/ChessControlsContext'
import ChessBoard from './ChessBoard'
import AlternativeControlsMock from './AlternativeControlsMock'
import PlaybackControls from './PlaybackControls'

const ChessBoardView = () => {
  const { snapshots, moveIndex, orientation, lastMove, pieceSet, boardTheme } = useChessControls()
  return (
    <ChessBoard
      fen={snapshots[moveIndex]?.fen}
      size="fluid"
      orientation={orientation}
      lastMove={lastMove}
      pieceSet={pieceSet}
      boardTheme={boardTheme}
    />
  )
}

const ChessBoardWithControlsContent = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="flex-1 min-w-0">
        <ChessBoardView />
      </div>
      <div className="w-full lg:w-[440px] lg:flex-shrink-0">
        <AlternativeControlsMock />
      </div>
    </div>
  )
}

const ChessBoardWithControls = ({ externalGame = null, chessData }) => {
  return (
    <ChessControlsProvider externalGame={externalGame} chessData={chessData}>
      <ChessBoardWithControlsContent />
    </ChessControlsProvider>
  )
}

export default ChessBoardWithControls
