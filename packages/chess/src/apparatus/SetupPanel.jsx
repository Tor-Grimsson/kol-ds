import React, { useState } from 'react'
import { Button, Input, Dropdown } from '@kolkrabbi/kol-component'
import { useChessControls } from '../context/ChessControlsContext'

/**
 * SetupPanel — the SETUP POSITION block: header + icon actions (search, flip,
 * clear, copy PGN, edit mode) and the piece-set / board-theme selectors.
 * Reads everything from ChessControlsContext; padding-free — the composer
 * owns spacing, visibility, and responsive behavior via `className`.
 *
 * Extracted from AlternativeControlsMock (0.5.2) so consumers can compose
 * their own rail.
 *
 * @param {string}          className leading/trailing chrome from the composer
 * @param {React.ReactNode} actions   extra icon buttons appended to the action row
 */
export default function SetupPanel({ className = '', actions = null }) {
  const {
    searchQuery,
    setSearchQuery,
    toggleOrientation,
    loadEmptyPosition,
    getPgnWithVariations,
    isEditMode,
    toggleEditMode,
    pieceSet,
    setPieceSet,
    boardTheme,
    setBoardTheme
  } = useChessControls()

  const [showSearch, setShowSearch] = useState(false)

  const handleExportPgn = async () => {
    const value = getPgnWithVariations()
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.warn('Unable to copy PGN to clipboard', error)
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
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
          <Button variant="ghost" size="sm" iconOnly="copy" onClick={handleExportPgn} title="Copy PGN" aria-label="Copy PGN" />
          <Button variant="ghost" size="sm" iconOnly="edit" onClick={toggleEditMode} selected={isEditMode} title="Toggle edit mode" aria-label="Toggle edit mode" />
          {actions}
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
  )
}
