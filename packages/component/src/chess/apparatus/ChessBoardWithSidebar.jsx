import { ChessControlsProvider, useChessControls } from '../context/ChessControlsContext'
import Button from '../../atoms/Button.jsx'
import ChessBoard from './ChessBoard'
import ChessBoardFullscreen from './ChessBoardFullscreen'
import ChessSidebar from './ChessSidebar'

// Map the legacy glyph labels to KOL icon names + accessible labels (icon names
// reused verbatim from PlaybackControls, which renders the same controls).
const GLYPH_TO_ICON = {
  '⏮': { icon: 'play-arrow-start', label: 'Jump to start' },
  '◀': { icon: 'play-arrow-back', label: 'Step backward' },
  '▶': { icon: 'play-Play', label: 'Play moves' },
  '▸': { icon: 'play-arrow-forward', label: 'Step forward' },
  '⏭': { icon: 'play-arrow-end', label: 'Jump to end' }
}

const ToolbarButton = ({ label, onClick }) => {
  const { icon, label: ariaLabel } = GLYPH_TO_ICON[label]
  return <Button variant="primary" size="sm" iconOnly={icon} onClick={onClick} aria-label={ariaLabel} />
}

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
  externalGame = null,
  chessData
}) => {
  return (
    <ChessControlsProvider externalGame={externalGame} chessData={chessData}>
      <ChessBoardWithSidebarContent
        className={className}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </ChessControlsProvider>
  )
}

export default ChessBoardWithSidebar
