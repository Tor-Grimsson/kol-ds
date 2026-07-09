// Pass a `chessData` adapter (see chess/index.js) — forwarded to the table + board.
import { useState } from 'react'
import GameArchiveTable from './GameArchiveTable'
import ChessBoardWithControls from './ChessBoardWithControls'

const ChessAnalysisLayout = ({ chessData }) => {
  const [loadedGame, setLoadedGame] = useState(null)

  const handleGameLoad = (game) => {
    setLoadedGame(game)
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:max-w-[1232px]">
      <GameArchiveTable chessData={chessData} onGameLoad={handleGameLoad} />

      <section>
        <ChessBoardWithControls externalGame={loadedGame} chessData={chessData} />
      </section>
    </div>
  )
}

export default ChessAnalysisLayout
