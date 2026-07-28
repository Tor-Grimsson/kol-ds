import React, { useState } from 'react'
import { Button, Dropdown, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'
import { TIME_CLASS_LABELS, RESULT_LABELS } from './labels.js'
import { useChessControls } from '../context/ChessControlsContext'

/**
 * GamePicker — the game-selection row: filtered-games dropdown + opening
 * name, and the game-info popover (players / result / time control / date /
 * opening / termination) behind a star button. Padding-free — composer owns
 * chrome via `className`; extra trailing buttons go in `actions`.
 *
 * Extracted from AlternativeControlsMock (0.5.2).
 *
 * @param {string}          className chrome from the composer
 * @param {React.ReactNode} actions   extra buttons after the info button
 */
export default function GamePicker({ className = '', actions = null }) {
  const { filteredGames, selectedGame, setSelectedGameId } = useChessControls()

  const [infoOpen, setInfoOpen] = useState(false)
  const infoPopover = usePopover({ open: infoOpen, onOpenChange: setInfoOpen, placement: 'bottom-end', offset: 4 })

  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
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
        {actions}
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
    </div>
  )
}
