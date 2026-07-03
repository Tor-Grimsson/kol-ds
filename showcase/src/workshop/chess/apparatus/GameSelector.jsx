import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'
import { useChessControls } from '../context/ChessControlsContext'

const GameSelector = () => {
  const { filteredGames, selectedGame, setSelectedGameId } = useChessControls()
  const [showGameSelector, setShowGameSelector] = useState(false)

  return (
    <div className="flex items-center gap-2 flex-1 relative">
      <div
        className="flex-1 rounded bg-oq-04 px-3 py-3 flex flex-col gap-1 cursor-pointer"
        onClick={() => setShowGameSelector(!showGameSelector)}
      >
        <div className="flex items-center justify-between">
          <span className="kol-mono-xs text-fg-80 uppercase tracking-[0.2em]">
            {selectedGame?.player?.username || 'Player'} vs {selectedGame?.opponent?.username || 'Opponent'}
          </span>
          <Icon name="chevron-down" size={16} className="text-fg-80" />
        </div>
        {selectedGame?.opening?.name && (
          <span className="kol-mono-xxs text-fg-64">
            {selectedGame.opening.name}
          </span>
        )}
      </div>
      {showGameSelector && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-oq-08 border border-oq-16 rounded max-h-60 overflow-auto z-10">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="px-3 py-2 kol-mono-xs text-fg-80 hover:bg-oq-16 cursor-pointer"
              onClick={() => {
                setSelectedGameId(game.id)
                setShowGameSelector(false)
              }}
            >
              {game.player?.username} vs {game.opponent?.username}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameSelector
