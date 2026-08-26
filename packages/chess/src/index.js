// @kolkrabbi/kol-chess — the chess analysis apparatus.
// Styling ships in @kolkrabbi/kol-theme (kol-components-chess.css, layer components).
// Components take a `chessData` adapter (ChessAnalysisLayout / GameArchiveTable /
// ChessHero / ChessControlsProvider). This package is presentation only — it ships
// NO adapter and never fetches. The consuming app owns its data source and passes
// an object with:
//   getSampleGames(), getManifest(), getMonthlySummary(),
//   getRandomMonth(), loadMonthGames(month), getGamePgnByIdAsync(id, month)
// Reference implementation: kol-chess/src/data/sample-games.js.
// (Until 0.6.0 an adapter shipped here as ./data. A CDN host does not belong in a
// design system — it moved to the app that owns the pipeline.)

// Apparatus
export { default as ChessAnalysisLayout } from './apparatus/ChessAnalysisLayout.jsx'
export { default as ChessBoard } from './apparatus/ChessBoard.jsx'
export { default as ChessBoardWithControls } from './apparatus/ChessBoardWithControls.jsx'
export { default as ChessBoardWithSidebar } from './apparatus/ChessBoardWithSidebar.jsx'
export { default as ChessBoardFullscreen } from './apparatus/ChessBoardFullscreen.jsx'
export { default as ChessSidebar } from './apparatus/ChessSidebar.jsx'
export { default as GameArchiveTable } from './apparatus/GameArchiveTable.jsx'
export { default as NotationPanel } from './apparatus/NotationPanel.jsx'
export { default as PlaybackControls } from './apparatus/PlaybackControls.jsx'
export { default as VariationTree } from './apparatus/VariationTree.jsx'
export { default as AlternativeControlsMock } from './apparatus/AlternativeControlsMock.jsx'

// Rail blocks — the Mock's parts, exported individually (0.5.2) so consumers
// can compose their own rail
export { default as SetupPanel } from './apparatus/SetupPanel.jsx'
export { default as PiecePalette } from './apparatus/PiecePalette.jsx'
export { default as GamePicker } from './apparatus/GamePicker.jsx'
export { default as MaterialSummary } from './apparatus/MaterialSummary.jsx'
export { default as useChessKeyboardShortcuts } from './apparatus/useChessKeyboardShortcuts.js'

// Piece renderer
export { default as ChessPiece } from './ChessPiece.jsx'

// Dashboard
export { default as ChessHero } from './dashboards/ChessHero.jsx'

// State
export { ChessControlsProvider, useChessControls, createSnapshotsFromPgn } from './context/ChessControlsContext.jsx'

// Utils
export { default as buildMoveTree } from './utils/parsePgnTree.js'
