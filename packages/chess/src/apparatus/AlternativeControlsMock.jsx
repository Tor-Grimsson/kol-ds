import React, { useState, useEffect } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Button, Divider, Input, Dropdown, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'
import { TIME_CLASS_LABELS, RESULT_LABELS } from './labels.js'
import { BOARD_THEMES } from './ChessBoard'
import { ChessPiece } from '../index.js'
import { useChessControls } from '../context/ChessControlsContext'
import NotationPanel from './NotationPanel'
import PlaybackControls from './PlaybackControls'
import VariationTree from './VariationTree'

const PIECE_MAP = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king'
}

const AlternativeControlsMock = () => {
  const palettePieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  const {
    searchQuery,
    setSearchQuery,
    filteredGames,
    selectedGame,
    selectedGameId,
    setSelectedGameId,
    notationPairs,
    moveIndex,
    setMoveIndex,
    goToStart,
    goToEnd,
    stepBackward,
    stepForward,
    togglePlayback,
    isPlaying,
    isLoading,
    activeColor,
    orientation,
    toggleOrientation,
    loadEmptyPosition,
    addUserVariation,
    userVariations,
    getPgnWithUserVariations,
    isEditMode,
    toggleEditMode,
    capturedPieces,
    pieceSet,
    setPieceSet,
    boardTheme,
    setBoardTheme
  } = useChessControls()

  const [selectedPalettePiece, setSelectedPalettePiece] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const infoPopover = usePopover({ open: infoOpen, onOpenChange: setInfoOpen, placement: 'bottom-end', offset: 4 })


  const boardColors = BOARD_THEMES[boardTheme] || BOARD_THEMES['green-white']

  // Calculate material advantage
  const materialEvaluation = (() => {
    const whitePieces = capturedPieces?.white || []
    const blackPieces = capturedPieces?.black || []

    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
    const whiteValue = whitePieces.reduce((sum, piece) => sum + (values[piece] || 0), 0)
    const blackValue = blackPieces.reduce((sum, piece) => sum + (values[piece] || 0), 0)

    const diff = whiteValue - blackValue
    const percentage = Math.min(Math.max((diff + 15) / 30, 0), 1) * 100

    return { diff, percentage, advantage: diff > 0 ? 'white' : diff < 0 ? 'black' : 'equal' }
  })()

  const handleAddVariation = () => {
    const label = window.prompt('Name this variation:', `Variation ${userVariations.length + 1}`)
    if (label === null) return
    const sanInput = window.prompt('Enter SAN moves separated by spaces:', 'Nc3 Bb5 d4')
    if (!sanInput) return
    const sanSequence = sanInput.split(' ').map((san) => san.trim()).filter(Boolean)
    if (!sanSequence.length) return
    addUserVariation(label, sanSequence)
  }

  const handleExportPgn = async () => {
    const value = getPgnWithUserVariations()
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.warn('Unable to copy PGN to clipboard', error)
    }
  }

  const handlePaletteClick = (color, piece) => {
    if (!isEditMode) return
    setSelectedPalettePiece({ color, piece })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't intercept if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          stepBackward()
          break
        case 'ArrowRight':
          event.preventDefault()
          stepForward()
          break
        case ' ':
          event.preventDefault()
          togglePlayback()
          break
        case 'Home':
          event.preventDefault()
          goToStart()
          break
        case 'End':
          event.preventDefault()
          goToEnd()
          break
        case 'f':
        case 'F':
          event.preventDefault()
          toggleOrientation()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stepBackward, stepForward, togglePlayback, goToStart, goToEnd, toggleOrientation])

  return (
    <div className="w-full min-h-full lg:h-full bg-oq-02 flex flex-col text-fg-88">
      <div className={`${mobileSettingsOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-3 p-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="kol-helper-12 text-fg-80">SETUP POSITION</span>
          </div>
          <div className="flex items-center gap-2 text-fg-64">
            <Button
              variant="ghost"
              size="sm"
              iconOnly="search"
              onClick={() => setShowSearch(!showSearch)}
              title="Search games"
              aria-label="Search games"
            />
            <Button variant="ghost" size="sm" iconOnly="refresh" onClick={toggleOrientation} title="Flip board" aria-label="Flip board" />
            <Button variant="ghost" size="sm" iconOnly="x" onClick={loadEmptyPosition} title="Clear board" aria-label="Clear board" />
            <Button variant="ghost" size="sm" iconOnly="component-01" onClick={handleAddVariation} title="New variation" aria-label="New variation" />
            <Button variant="ghost" size="sm" iconOnly="copy" onClick={handleExportPgn} title="Copy PGN" aria-label="Copy PGN" />
            <Button variant="ghost" size="sm" iconOnly="edit" onClick={toggleEditMode} selected={isEditMode} title="Toggle edit mode" aria-label="Toggle edit mode" />
          </div>
        </div>

        {showSearch && (
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search games"
            iconLeft="search"
          />
        )}

        {/* Piece Set Selector */}
        <div className="flex items-center gap-2">
          <span className="kol-helper-10 text-fg-64">PIECE SET</span>
          <Dropdown
            size="sm"
            variant="grey"
            value={pieceSet}
            onChange={setPieceSet}
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Set 1', value: 'set-1' },
              { label: 'Set 2', value: 'set-2' },
              { label: 'Set 3', value: 'set-3' }
            ]}
          />
        </div>

        {/* Board Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="kol-helper-10 text-fg-64">BOARD THEME</span>
          <Dropdown
            size="sm"
            variant="grey"
            value={boardTheme}
            onChange={setBoardTheme}
            options={[
              { label: 'Green & White', value: 'green-white' },
              { label: 'Blue & Gray', value: 'blue-gray' },
              { label: 'Gray', value: 'gray' },
              { label: 'Olive', value: 'olive' },
              { label: 'Brown', value: 'brown' },
              { label: 'Dark', value: 'dark' }
            ]}
          />
        </div>
      </div>

      <div className="hidden p-3 border-t border-oq-08 bg-fg-02 lg:block">
        {isEditMode && selectedPalettePiece ? (
          <div className="kol-mono-12 text-fg-64 mb-2">
            Placing: {selectedPalettePiece.color} {selectedPalettePiece.piece}
          </div>
        ) : null}
        <div className="flex flex-col gap-3">
          {['white', 'black'].map((color) => (
            <div key={color} className="flex items-center justify-between gap-1 w-full">
              {palettePieces.map((piece, index) => (
                <div
                  key={`${color}-${piece}-${index}`}
                  className={`flex items-center justify-center bg-oq-02 rounded transition ring-offset-1 flex-1 aspect-square ${
                    isEditMode
                      ? 'cursor-pointer border border-dashed border-oq-12'
                      : ''
                  } ${
                    selectedPalettePiece &&
                    selectedPalettePiece.color === color &&
                    selectedPalettePiece.piece === piece
                      ? 'ring-2 ring-accent-primary'
                      : ''
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

      <div className="flex flex-col gap-4 flex-1 p-3 min-h-0">
        <div className="flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex flex-col gap-1 flex-1">
            {/* DS Dropdown replaces the hand-rolled selector (audit finding 7); the
              * dead GameSelector.jsx twin of this markup is deleted */}
            <Dropdown
              size="sm"
              variant="grey"
              options={filteredGames.map((game) => ({
                label: `${game.player?.username || 'Player'} vs ${game.opponent?.username || 'Opponent'}`,
                value: game.id,
              }))}
              value={selectedGame?.id}
              onChange={setSelectedGameId}
              placeholder="Select game…"
              className="w-full"
            />
            {selectedGame?.opening?.name && (
              <span className="kol-mono-10 text-fg-64">
                {selectedGame.opening.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedGame && (
              <span ref={infoPopover.refs.setReference} {...infoPopover.getReferenceProps()} className="inline-flex">
                <Button variant="ghost" size="sm" iconOnly="star-solid" selected={infoOpen} title="Game info" aria-label="Game info" />
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconOnly="settings-01"
              className="lg:hidden"
              selected={mobileSettingsOpen}
              onClick={() => setMobileSettingsOpen((v) => !v)}
              title="Board settings"
              aria-label="Board settings"
            />
          </div>
        </div>

        <Divider />

        {/* Material Evaluation Bar */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="kol-helper-12 text-fg-80">MATERIAL</span>
            {materialEvaluation.advantage !== 'equal' && (
              <span className="kol-mono-10 text-fg-80">
                {materialEvaluation.advantage === 'white' ? '+' : ''}{materialEvaluation.diff}
              </span>
            )}
          </div>
          <div className="h-2 bg-fg-04 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-300"
              style={{ width: `${materialEvaluation.percentage}%`, backgroundColor: boardColors.light }}
            />
            <div
              className="absolute top-0 right-0 h-full transition-all duration-300"
              style={{ width: `${100 - materialEvaluation.percentage}%`, backgroundColor: boardColors.dark }}
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 flex-shrink-0">
          {['white', 'black'].map((color) => {
            const pieces = capturedPieces?.[color] || []
            const materialValue = pieces.reduce((sum, piece) => {
              const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
              return sum + (values[piece] || 0)
            }, 0)

            return (
              <div key={color} className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="kol-helper-10 text-fg-64">{color === 'white' ? 'WHITE' : 'BLACK'}</span>
                  {materialValue > 0 && (
                    <span className="kol-mono-10 text-fg-80">+{materialValue}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                  {pieces.map((piece, index) => (
                    <div key={`${color}-captured-${index}`} className="flex items-center justify-center">
                      <ChessPiece piece={PIECE_MAP[piece]} color={color === 'white' ? 'black' : 'white'} size="20px" pieceSet={pieceSet} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {selectedGame && (
          <PopoverPanel popover={infoPopover} className="w-[280px] rounded bg-oq-04 p-3 z-20">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="kol-helper-10 text-fg-64">PLAYERS</span>
                <span className="kol-mono-12 text-fg-80">
                  {selectedGame.player?.rating || '—'} vs {selectedGame.opponent?.rating || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="kol-helper-10 text-fg-64">RESULT</span>
                <span className="kol-mono-12 text-fg-80">
                  {RESULT_LABELS[selectedGame.playerResult] ?? selectedGame.playerResult ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="kol-helper-10 text-fg-64">TIME CONTROL</span>
                <span className="kol-mono-12 text-fg-80">
                  {TIME_CLASS_LABELS[selectedGame.timeClass] ?? selectedGame.timeClass ?? '—'}
                </span>
              </div>
              {selectedGame.endTime && (
                <div className="flex items-center justify-between">
                  <span className="kol-helper-10 text-fg-64">DATE</span>
                  <span className="kol-mono-12 text-fg-80">
                    {new Date(selectedGame.endTime * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
              {selectedGame.opening?.name && (
                <div className="flex flex-col gap-1">
                  <span className="kol-helper-10 text-fg-64">OPENING</span>
                  <span className="kol-mono-12 text-fg-80">{selectedGame.opening.name}</span>
                </div>
              )}
              {selectedGame.termination && (
                <div className="flex flex-col gap-1">
                  <span className="kol-helper-10 text-fg-64">TERMINATION</span>
                  <span className="kol-mono-12 text-fg-80">{selectedGame.termination}</span>
                </div>
              )}
            </div>
          </PopoverPanel>
        )}

        {/* notation is the rail's primary content — always visible, fills the
          * remaining married height with internal scroll (disclosure removed
          * 2026-07-15: it only existed because the pre-marriage rail could
          * grow unbounded) */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex items-center pt-4 border-t border-oq-08 flex-shrink-0">
            <span className="kol-helper-12 text-fg-80">NOTATION</span>
          </div>
          <div className="rounded bg-oq-04 p-3 overflow-auto flex-1 min-h-0">
            <NotationPanel
              notationPairs={notationPairs}
              activePly={moveIndex}
              onSelectPly={setMoveIndex}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="order-first flex-shrink-0 lg:order-none">
          {/* the ONE playback unit; mobile floats it to the top, above the picker */}
          <PlaybackControls />
        </div>
      </div>
    </div>
  )
}

export default AlternativeControlsMock
