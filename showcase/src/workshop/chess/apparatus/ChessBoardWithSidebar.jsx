import { ChessControlsProvider, useChessControls } from '../context/ChessControlsContext'
import ChessBoard from './ChessBoard'
import ChessBoardFullscreen from './ChessBoardFullscreen'
import ChessSidebar from './ChessSidebar'
import '../chess.css'

const ToolbarButton = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="board-toolbar__button">
    {label}
  </button>
)

const ChessBoardWithSidebarContent = ({ className = '', onToggleFullscreen = null, isFullscreen = false }) => {
  const {
    snapshots,
    moveIndex,
    orientation,
    selectedGame,
    selectedGameId,
    filteredGames,
    setSelectedGameId,
    goToStart,
    goToEnd,
    stepBackward,
    stepForward,
    togglePlayback
  } = useChessControls()

  const handleSelectGame = (event) => {
    setSelectedGameId(event.target.value || null)
  }

  if (isFullscreen) {
    const fullscreenWrapperClassName = ['min-h-dvh', className].filter(Boolean).join(' ')
    return (
      <ChessBoardFullscreen
        wrapperClassName={fullscreenWrapperClassName}
        boardProps={{
          size: 'desktop',
          fen: snapshots[moveIndex]?.fen,
          orientation
        }}
        sidebarProps={{
          selectedGame,
          selectedGameId,
          sampleGames: filteredGames,
          moveIndex,
          onSelectGame: handleSelectGame,
          onGoToStart: goToStart,
          onStepBackward: stepBackward,
          onStepForward: stepForward,
          onGoToEnd: goToEnd,
          onTogglePlayback: togglePlayback,
          size: 'desktop',
          variant: 'minimal',
          className: 'w-full h-full bg-fg-04 text-auto',
          onToggleFullscreen,
          isFullscreen
        }}
      />
    )
  }

  const rootClassName = ['board-playback', className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      <div className="board-playback__toolbar board-playback__toolbar--left">
        <ToolbarButton label="⏮" onClick={goToStart} />
        <ToolbarButton label="▶" onClick={togglePlayback} />
        <ToolbarButton label="⏭" onClick={goToEnd} />
      </div>

      <div className="board-playback__toolbar board-playback__toolbar--right">
        <ToolbarButton label="⏮" onClick={goToStart} />
        <ToolbarButton label="◀" onClick={stepBackward} />
        <ToolbarButton label="▶" onClick={togglePlayback} />
        <ToolbarButton label="▸" onClick={stepForward} />
        <ToolbarButton label="⏭" onClick={goToEnd} />
      </div>

      <div className="board-playback__content">
        <ChessBoard fen={snapshots[moveIndex]?.fen} size="fluid" orientation={orientation} />

        <ChessSidebar
          selectedGame={selectedGame}
          selectedGameId={selectedGameId}
          sampleGames={filteredGames}
          moveIndex={moveIndex}
          onSelectGame={handleSelectGame}
          onGoToStart={goToStart}
          onStepBackward={stepBackward}
          onStepForward={stepForward}
          onGoToEnd={goToEnd}
          onTogglePlayback={togglePlayback}
          size="desktop"
          onToggleFullscreen={onToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>
    </div>
  )
}

const ChessBoardWithSidebar = ({
  className = '',
  onToggleFullscreen = null,
  isFullscreen = false,
  externalGame = null
}) => {
  return (
    <ChessControlsProvider externalGame={externalGame}>
      <ChessBoardWithSidebarContent
        className={className}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </ChessControlsProvider>
  )
}

export default ChessBoardWithSidebar
