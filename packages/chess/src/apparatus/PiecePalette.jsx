import React from 'react'
import ChessPiece from '../ChessPiece.jsx'
import { useChessControls } from '../context/ChessControlsContext'

/* the six real piece types — the old rook…rook mirror row was decorative
 * (mock era) and had no pawn, which made removed pawns unrecoverable */
const PALETTE_PIECES = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']

/**
 * PiecePalette — the edit-mode placement palette: one row per color, six
 * piece types each. Selection lives in context (editPlacement) — the BOARD
 * consumes it via placePiece; clicking the selected piece again deselects.
 * Padding-free — composer owns chrome via `className`.
 *
 * Extracted from AlternativeControlsMock (0.5.2).
 *
 * @param {string} className chrome from the composer
 */
export default function PiecePalette({ className = '' }) {
  const { isEditMode, editPlacement, setEditPlacement, pieceSet } = useChessControls()

  const handlePaletteClick = (color, piece) => {
    if (!isEditMode) return
    setEditPlacement((prev) =>
      prev && prev.color === color && prev.piece === piece ? null : { color, piece }
    )
  }

  return (
    <div className={className}>
      {isEditMode && editPlacement ? (
        <div className="kol-mono-12 text-fg-64 mb-2">
          Placing: {editPlacement.color} {editPlacement.piece}
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        {['white', 'black'].map((color) => (
          <div key={color} className="flex items-center justify-between gap-1 w-full">
            {PALETTE_PIECES.map((piece, index) => (
              <div
                key={`${color}-${piece}-${index}`}
                className={`flex items-center justify-center rounded transition flex-1 aspect-square ${
                  isEditMode
                    ? 'cursor-pointer border border-dashed border-oq-12'
                    : ''
                } ${
                  editPlacement &&
                  editPlacement.color === color &&
                  editPlacement.piece === piece
                    ? 'chess-palette--armed'
                    : 'bg-oq-02'
                }`}
                onClick={() => handlePaletteClick(color, piece)}
              >
                <ChessPiece piece={piece} color={color} size="32px" pieceSet={pieceSet} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
