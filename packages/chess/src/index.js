// @kolkrabbi/kol-chess — the chess analysis apparatus.
// Styling ships in @kolkrabbi/kol-theme (kol-components-chess.css, layer components).
// Components take a `chessData` adapter (ChessAnalysisLayout / GameArchiveTable /
// ChessHero / ChessControlsProvider). A ready adapter ships at @kolkrabbi/kol-chess/data
// (bundled demo set + B2 CDN fetch for the full archive); or bring your own with:
//   getSampleGames(), getManifest(), getMonthlySummary(),
//   getRandomMonth(), loadMonthGames(month), getGamePgnByIdAsync(id, month)

// Apparatus
export { default as ChessAnalysisLayout } from './apparatus/ChessAnalysisLayout.jsx'
export { default as ChessBoard } from './apparatus/ChessBoard.jsx'
export { default as ChessBoardWithControls } from './apparatus/ChessBoardWithControls.jsx'
export { default as ChessBoardWithSidebar } from './apparatus/ChessBoardWithSidebar.jsx'
export { default as ChessBoardFullscreen } from './apparatus/ChessBoardFullscreen.jsx'
export { default as ChessSidebar } from './apparatus/ChessSidebar.jsx'
export { default as GameArchiveTable } from './apparatus/GameArchiveTable.jsx'
export { default as GameSelector } from './apparatus/GameSelector.jsx'
export { default as NotationPanel } from './apparatus/NotationPanel.jsx'
export { default as PlaybackControls } from './apparatus/PlaybackControls.jsx'
export { default as VariationTree } from './apparatus/VariationTree.jsx'
export { default as AlternativeControlsMock } from './apparatus/AlternativeControlsMock.jsx'

// Piece renderer
export { default as ChessPiece } from './ChessPiece.jsx'

// Dashboard
export { default as ChessHero } from './dashboards/ChessHero.jsx'

// State
export { ChessControlsProvider, useChessControls, createSnapshotsFromPgn } from './context/ChessControlsContext.jsx'

// Utils
export { default as buildMoveTree } from './utils/parsePgnTree.js'
