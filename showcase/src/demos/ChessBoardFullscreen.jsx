import { ChessBoardFullscreen, ChessControlsProvider, useChessControls } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'full'

/* The fullscreen composition: board centred in the remaining space, sidebar
 * pinned to the right edge. It's presentational (min-height 100dvh is inline,
 * so no frame can shrink it — the demo owns a viewport of height, which is
 * the component's actual shape). Wiring mirrors the package's own fullscreen
 * branch in ChessBoardWithSidebar: provider + useChessControls feed fen,
 * game list, and transport, so playback is fully live. Board size 'tablet'
 * (520px) instead of the 760px default so the board fits beside the 400px
 * sidebar on a docs-width canvas. */
function FullscreenStage() {
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

  return (
    <ChessBoardFullscreen
      boardProps={{
        size: 'tablet',
        fen: snapshots[moveIndex]?.fen,
        orientation
      }}
      sidebarProps={{
        selectedGame,
        selectedGameId,
        sampleGames: filteredGames,
        moveIndex,
        /* ChessSidebar's Dropdown hands the raw value (already null-normalised) */
        onSelectGame: (value) => setSelectedGameId(value || null),
        onGoToStart: goToStart,
        onStepBackward: stepBackward,
        onStepForward: stepForward,
        onGoToEnd: goToEnd,
        onTogglePlayback: togglePlayback
      }}
    />
  )
}

export default function ChessBoardFullscreenDemo() {
  return (
    <ChessControlsProvider chessData={chessData}>
      <FullscreenStage />
    </ChessControlsProvider>
  )
}
