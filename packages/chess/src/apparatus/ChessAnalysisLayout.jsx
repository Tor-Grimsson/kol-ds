// Pass a `chessData` adapter (see chess/index.js) — forwarded to the table + board.
import { useState } from 'react'
import { Button, FullscreenOverlay } from '@kolkrabbi/kol-component'
import GameArchiveTable from './GameArchiveTable'
import ChessBoardWithControls from './ChessBoardWithControls'

/* The 100dvh stage (2026-07-15 ruling): the BOARD is the anchor — everything
 * fits beside it or overlays it, nothing pushes, the page never scrolls.
 * The game archive lives in a FullscreenOverlay (Esc/backdrop dismiss);
 * loading a game closes it, landing focus on the board. Page framing
 * (max-width, x padding) stays the consumer's job. */
const ChessAnalysisLayout = ({ chessData, overlayActions = null }) => {
  const [loadedGame, setLoadedGame] = useState(null)
  const [archiveOpen, setArchiveOpen] = useState(false)

  const handleGameLoad = (game) => {
    setLoadedGame(game)
    setArchiveOpen(false)
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col gap-3 pt-3">
      <div className="flex flex-shrink-0 items-center">
        <Button variant="ghost" size="sm" iconLeft="grid" onClick={() => setArchiveOpen(true)}>
          Games
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <ChessBoardWithControls externalGame={loadedGame} chessData={chessData} />
      </div>

      <FullscreenOverlay open={archiveOpen} onClose={() => setArchiveOpen(false)} closeButton={false}>
        <div className="max-h-[88dvh] w-[min(1100px,calc(100vw-48px))] overflow-y-auto rounded bg-surface-primary p-4 md:p-6">
          {/* close mirrors the opener's anatomy exactly — icon + label, ghost/sm;
            * overlayActions is the consumer slot (e.g. a ThemeToggle) beside it */}
          <div className="-mr-2 -mt-1 mb-2 flex items-center justify-end gap-2">
            {overlayActions}
            <Button variant="ghost" size="sm" iconLeft="x" onClick={() => setArchiveOpen(false)}>
              Close
            </Button>
          </div>
          <GameArchiveTable chessData={chessData} onGameLoad={handleGameLoad} />
        </div>
      </FullscreenOverlay>
    </div>
  )
}

export default ChessAnalysisLayout
