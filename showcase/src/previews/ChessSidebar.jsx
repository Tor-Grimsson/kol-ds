import { ChessSidebar, ChessControlsProvider, useChessControls } from '@kolkrabbi/kol-chess'
import * as chessData from '../demo-data/chess.js'

export const stage = 'sm'

/* The sidebar as a standalone panel — game picker, piece palette, transport,
 * footer. It's presentational (all props, no context), so the preview wires it
 * the way ChessBoardWithSidebar does: provider + useChessControls hand it the
 * real sample games and live transport — stepping moves updates the "move N"
 * meta line. size="sm" keeps the 8-piece palette rows inside the sm column. */
function SidebarStage({ variant, size }) {
  const {
    selectedGame,
    selectedGameId,
    filteredGames,
    moveIndex,
    setSelectedGameId,
    goToStart,
    goToEnd,
    stepBackward,
    stepForward,
    togglePlayback
  } = useChessControls()

  return (
    <ChessSidebar
      selectedGame={selectedGame}
      selectedGameId={selectedGameId}
      sampleGames={filteredGames}
      moveIndex={moveIndex}
      onSelectGame={(value) => setSelectedGameId(value || null)}
      onGoToStart={goToStart}
      onStepBackward={stepBackward}
      onStepForward={stepForward}
      onGoToEnd={goToEnd}
      onTogglePlayback={togglePlayback}
      variant={variant}
      size={size}
      className="w-full"
    />
  )
}

export const variants = ['default', 'minimal', 'plain']
export const sizes = ['sm', 'md', 'lg']

export default function ChessSidebarPreview({ variant = 'default', size = 'sm' }) {
  return (
    <ChessControlsProvider chessData={chessData}>
      <SidebarStage variant={variant} size={size} />
    </ChessControlsProvider>
  )
}
