import { useState } from 'react'
import GameArchiveTable from './GameArchiveTable'
import ChessBoardWithControls from './ChessBoardWithControls'

const ChessAnalysisLayout = () => {
  const [loadedGame, setLoadedGame] = useState(null)

  const handleGameLoad = (game) => {
    setLoadedGame(game)
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <GameArchiveTable onGameLoad={handleGameLoad} />

      <section>
        <ChessBoardWithControls externalGame={loadedGame} />
      </section>
    </div>
  )
}

export default ChessAnalysisLayout
