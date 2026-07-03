import React, { useState, useEffect } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'
import { ChessPiece } from '../index.js'
import { useChessControls } from '../context/ChessControlsContext'
import NotationPanel from './NotationPanel'
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
  const [showGameSelector, setShowGameSelector] = useState(false)
  const [showNotation, setShowNotation] = useState(false)
  const [showGameInfo, setShowGameInfo] = useState(false)

  const playbackButtons = [
    { icon: 'play-arrow-start', label: 'Jump to start', action: goToStart },
    { icon: 'play-arrow-back', label: 'Step backward', action: stepBackward },
    {
      icon: isPlaying ? 'play-pause' : 'play-Play',
      label: isPlaying ? 'Pause playback' : 'Play moves',
      action: togglePlayback
    },
    { icon: 'play-arrow-forward', label: 'Step forward', action: stepForward },
    { icon: 'play-arrow-end', label: 'Jump to end', action: goToEnd }
  ]

  const notationLabel = selectedGame?.opening?.name || 'notation'

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
    <div className="w-full h-full bg-oq-02 flex flex-col text-fg-88">
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="kol-mono-xs text-fg-64">Setup Position</span>
          </div>
          <div className="flex items-center gap-2 text-fg-64">
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              title="Search games"
              className="p-1 hover:text-fg transition-colors"
            >
              <Icon name="search-16" size={20} />
            </button>
            <button type="button" onClick={toggleOrientation} title="Flip board" className="p-1 hover:text-fg transition-colors">
              <Icon name="rotate" size={20} />
            </button>
            <button type="button" onClick={loadEmptyPosition} title="Clear board" className="p-1 hover:text-fg transition-colors">
              <Icon name="bucket" size={20} />
            </button>
            <button type="button" onClick={handleAddVariation} title="New variation" className="p-1 hover:text-fg transition-colors">
              <Icon name="component" size={20} />
            </button>
            <button type="button" onClick={handleExportPgn} title="Copy PGN" className="p-1 hover:text-fg transition-colors">
              <Icon name="copy" size={20} />
            </button>
            <button type="button" onClick={toggleEditMode} title="Toggle edit mode" className={`p-1 hover:text-fg transition-colors ${isEditMode ? 'text-accent-primary' : ''}`}>
              <Icon name={isEditMode ? 'stat-cycle' : 'pills'} size={20} />
            </button>
          </div>
        </div>

        {showSearch && (
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search games"
            className="bg-oq-02 border border-oq-16 rounded px-2 py-1 kol-mono-xxs text-fg-80"
          />
        )}

        {/* Piece Set Selector */}
        <div className="flex items-center gap-2">
          <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Piece Set</span>
          <select
            value={pieceSet}
            onChange={(e) => setPieceSet(e.target.value)}
            className="bg-oq-04 border border-oq-16 rounded px-2 py-1 kol-mono-xxs text-fg-80"
          >
            <option value="default">Default</option>
            <option value="set-1">Set 1</option>
            <option value="set-2">Set 2</option>
            <option value="set-3">Set 3</option>
          </select>
        </div>

        {/* Board Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Board Theme</span>
          <select
            value={boardTheme}
            onChange={(e) => setBoardTheme(e.target.value)}
            className="bg-oq-04 border border-oq-16 rounded px-2 py-1 kol-mono-xxs text-fg-80"
          >
            <option value="green-white">Green & White</option>
            <option value="blue-gray">Blue & Gray</option>
            <option value="gray">Gray</option>
            <option value="olive">Olive</option>
            <option value="brown">Brown</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="p-3 border-t border-oq-08 bg-fg-02">
        {isEditMode && selectedPalettePiece ? (
          <div className="kol-mono-xs text-fg-64 mb-2">
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
          <div className="flex items-center gap-2 flex-1 relative">
            <div
              className="flex-1 rounded bg-oq-04 px-3 py-3 flex flex-col gap-1 cursor-pointer"
              onClick={() => setShowGameSelector(!showGameSelector)}
            >
              <div className="flex items-center justify-between">
                <span className="kol-mono-xs text-fg-80 uppercase tracking-[0.2em]">
                  {selectedGame?.player?.username || 'Player'} vs {selectedGame?.opponent?.username || 'Opponent'}
                </span>
                <Icon name="chevron-down" size={16} className="text-fg-80" />
              </div>
              {selectedGame?.opening?.name && (
                <span className="kol-mono-xxs text-fg-64">
                  {selectedGame.opening.name}
                </span>
              )}
            </div>
            {showGameSelector && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-oq-08 border border-oq-16 rounded max-h-60 overflow-auto z-10">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="px-3 py-2 kol-mono-xs text-fg-80 hover:bg-oq-16 cursor-pointer"
                    onClick={() => {
                      setSelectedGameId(game.id)
                      setShowGameSelector(false)
                    }}
                  >
                    {game.player?.username} vs {game.opponent?.username}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {['stat-chart-a', 'stat-chart-b', 'stat-chart-c'].map((icon) => (
              <span key={icon} className="w-7 h-7 flex items-center justify-center">
                <Icon name={icon} size={16} className="text-fg-80" />
              </span>
            ))}
          </div>
        </div>

        {/* Material Evaluation Bar */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Material</span>
            {materialEvaluation.advantage !== 'equal' && (
              <span className="kol-mono-xxs text-fg-80">
                {materialEvaluation.advantage === 'white' ? '+' : ''}{materialEvaluation.diff}
              </span>
            )}
          </div>
          <div className="h-2 bg-fg-04 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
              style={{ width: `${materialEvaluation.percentage}%` }}
            />
            <div
              className="absolute top-0 right-0 h-full bg-[#0a682a] transition-all duration-300"
              style={{ width: `${100 - materialEvaluation.percentage}%` }}
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
                  <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">{color}</span>
                  {materialValue > 0 && (
                    <span className="kol-mono-xxs text-fg-80">+{materialValue}</span>
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
          <div className="flex flex-col gap-2 flex-shrink-0 border-t border-oq-08 pt-4">
            <div className="flex-1 rounded bg-oq-04 px-3 py-3 flex items-center justify-between cursor-pointer" onClick={() => setShowGameInfo(!showGameInfo)}>
              <span className="kol-mono-xs text-fg-80 uppercase tracking-[0.2em]">Game Info</span>
              <Icon name={showGameInfo ? 'chevron-up' : 'chevron-down'} size={16} className="text-fg-80" />
            </div>
            {showGameInfo && (
              <div className="rounded bg-oq-04 p-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Players</span>
                    <span className="kol-mono-xs text-fg-80">
                      {selectedGame.player?.rating || '—'} vs {selectedGame.opponent?.rating || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Result</span>
                    <span className="kol-mono-xs text-fg-80 capitalize">
                      {selectedGame.playerResult || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Time Control</span>
                    <span className="kol-mono-xs text-fg-80 capitalize">
                      {selectedGame.timeClass || '—'}
                    </span>
                  </div>
                  {selectedGame.endTime && (
                    <div className="flex items-center justify-between">
                      <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Date</span>
                      <span className="kol-mono-xs text-fg-80">
                        {new Date(selectedGame.endTime * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedGame.opening?.name && (
                    <div className="flex flex-col gap-1">
                      <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Opening</span>
                      <span className="kol-mono-xs text-fg-80">
                        {selectedGame.opening.name}
                      </span>
                    </div>
                  )}
                  {selectedGame.termination && (
                    <div className="flex flex-col gap-1">
                      <span className="kol-mono-xxs text-fg-64 uppercase tracking-[0.3em]">Termination</span>
                      <span className="kol-mono-xs text-fg-80">
                        {selectedGame.termination}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex items-center gap-2 pt-4 border-t border-oq-08 flex-shrink-0">
            <div className="flex-1 rounded bg-oq-04 px-3 py-3 flex items-center justify-between cursor-pointer" onClick={() => setShowNotation(!showNotation)}>
              <span className="kol-mono-xs text-fg-80 uppercase tracking-[0.2em]">{notationLabel}</span>
              <Icon name={showNotation ? 'chevron-up' : 'chevron-down'} size={16} className="text-fg-80" />
            </div>
          </div>
          {showNotation && (
            <div className="rounded bg-oq-04 p-3 overflow-auto flex-1 min-h-0">
              <NotationPanel
                notationPairs={notationPairs}
                activePly={moveIndex}
                onSelectPly={setMoveIndex}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-center">
            <span className="kol-mono-xs text-fg-64 uppercase tracking-[0.2em]">
              Move {moveIndex}/{notationPairs.length || 0}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {playbackButtons.map(({ icon, label, action }) => (
              <button
                key={icon}
                type="button"
                aria-label={label}
                className="h-12 rounded bg-oq-02 border border-fg-08 text-fg-80 flex items-center justify-center"
                onClick={action}
              >
                <Icon name={icon} size={18} className="text-fg-80" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlternativeControlsMock
