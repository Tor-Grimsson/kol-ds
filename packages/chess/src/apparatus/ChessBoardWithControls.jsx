import { useChessControls, ChessControlsProvider } from '../context/ChessControlsContext'
import ChessBoard from './ChessBoard'
import AlternativeControlsMock from './AlternativeControlsMock'
import PlaybackControls from './PlaybackControls'

const ChessBoardView = () => {
  const { activeFen, orientation, lastMove, pieceSet, boardTheme, playMove, isEditMode, placePiece } = useChessControls()
  /* Board input (brief 3.0): click-to-move feeds the provider's playMove
   * (mainline follow or sideline branch); edit mode bypasses move legality
   * and reports raw squares to the position editor. */
  return (
    <ChessBoard
      fen={activeFen}
      size="fluid"
      orientation={orientation}
      lastMove={lastMove}
      pieceSet={pieceSet}
      boardTheme={boardTheme}
      interactive={!isEditMode}
      onMove={playMove}
      onSquareClick={isEditMode ? placePiece : null}
    />
  )
}

const ChessBoardWithControlsContent = ({ panel = null }) => {
  /* married heights (2026-07-15): at lg+ the BOARD alone defines the row —
   * the rail is absolutely pinned to the board's box (inset-y-0) and its
   * content scrolls inside; flex/grid can't do "B follows A" once B's
   * content is taller, so B leaves the flow. Stacked below lg.
   *
   * `panel` (brief 2.0): a consumer strip above the board, INSIDE the
   * provider (it may call useChessControls). The 100dvh no-scroll ruling
   * holds — the shared width cap budgets ~90px for the strip. The cap is
   * shared board↔rail so their widths stay married. */
  const widthCap = panel ? 'max-w-[calc(100dvh-470px)]' : 'max-w-[calc(100dvh-380px)]'
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 lg:block lg:h-auto lg:relative lg:pr-[472px]">
      {panel && (
        <div className={`mx-auto w-full ${widthCap} flex-shrink-0 min-w-0 lg:mx-0 lg:max-w-none lg:mb-4`}>
          {panel}
        </div>
      )}
      <div className={`mx-auto w-full ${widthCap} flex-shrink-0 min-w-0 lg:mx-0 lg:max-w-none`}>
        <ChessBoardView />
      </div>
      <div className={`mx-auto min-h-0 flex-1 w-full ${widthCap} overflow-y-auto lg:overflow-hidden lg:mx-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[440px] lg:max-w-none lg:flex-none`}>
        <AlternativeControlsMock />
      </div>
    </div>
  )
}

const ChessBoardWithControls = ({ externalGame = null, chessData, panel = null }) => {
  return (
    <ChessControlsProvider externalGame={externalGame} chessData={chessData}>
      <ChessBoardWithControlsContent panel={panel} />
    </ChessControlsProvider>
  )
}

export default ChessBoardWithControls
